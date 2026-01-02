#!/bin/bash

echo "🚀 Starting Rate Limit Test"
echo "Test Endpoint: http://localhost:3000/api/test"
echo ""

# Test 1: Normal request (should succeed)
echo "📋 Test 1: Single Normal Request"
curl -s -o /dev/null -w "Status Code: %{http_code}\n" http://localhost:3000/api/test
echo ""

# Test 2: Send 6 requests quickly (should trigger limit)
echo "📋 Test 2: Send 6 Requests Quickly (should trigger 5 requests/10 minutes limit)"
for i in {1..6}; do
  echo -n "Request $i: "
  curl -s -o /dev/null -w "Status Code: %{http_code}, " http://localhost:3000/api/test
  curl -s http://localhost:3000/api/test | grep -o '"message":"[^"]*"' | head -1
done
echo ""

# Test 3: Test with different IP addresses
echo "📋 Test 3: Test with Different IP Addresses"
echo "Using IP: 192.168.1.100"
curl -s -o /dev/null -w "Status Code: %{http_code}\n" -H "X-Forwarded-For: 192.168.1.100" http://localhost:3000/api/test
echo "Using IP: 192.168.1.101"
curl -s -o /dev/null -w "Status Code: %{http_code}\n" -H "X-Forwarded-For: 192.168.1.101" http://localhost:3000/api/test
echo ""

# Test 4: Check response headers
echo "📋 Test 4: Check Rate Limit Response Headers"
curl -s -I http://localhost:3000/api/test | grep -i "ratelimit"
echo ""

# Test 5: Error response after triggering limit
echo "📋 Test 5: Error Response After Triggering Limit (send 6 requests first)"
for i in {1..6}; do
  curl -s http://localhost:3000/api/test > /dev/null
done
echo "After sending 6 requests, the 7th should be rate limited:"
curl -s http://localhost:3000/api/test | python -m json.tool 2>/dev/null || curl -s http://localhost:3000/api/test
echo ""

echo "✅ Test Complete"
echo ""
echo "📝 Expected Results:"
echo "1. First 5 requests should succeed (200 status code)"
echo "2. 6th request should be rate limited (429 status code)"
echo "3. Error message should contain: 'Rate limit exceeded'"
echo "4. Response headers should contain X-RateLimit-* headers"