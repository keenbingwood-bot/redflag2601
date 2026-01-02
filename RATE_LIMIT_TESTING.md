# Rate Limiting Testing Guide

## 📋 Overview

This document provides testing methods and scripts to verify that the rate limiting system is working correctly.

## 🚀 Quick Start

### 1. Start Development Server
```bash
npm run dev
```

### 2. Run Comprehensive Test
```bash
npm run test:all
```

### 3. Run Simple Test (using curl)
```bash
# Give script execution permission
chmod +x test-rate-limit.sh
npm run test:quick
```

## 🔧 Test Scripts Description

### 1. `test-rate-limit.js` - Comprehensive Test Script
- Sends multiple requests to test rate limiting
- Displays detailed test results
- Supports testing with different IP addresses

### 2. `test-localhost-exemption.js` - Localhost Exemption Test
- Tests higher limits for localhost (1000 requests/10 minutes)
- Tests external IP limits (5 requests/10 minutes)
- Verifies independent limits for different IP addresses

### 3. `test-error-response.js` - Error Response Format Validation
- Triggers rate limiting and checks error response
- Validates status codes, response headers, and response body format
- Checks error messages and timestamp format

### 4. `test-rate-limit.sh` - Shell Script Test
- Simple testing using curl
- Suitable for quick verification

### 5. `run-all-tests.js` - Comprehensive Test Runner
- Runs all tests and generates reports
- Provides test summaries and recommendations

## 🧪 Manual Testing Methods

### Test 1: Basic Functionality Test
```bash
# Send 6 rapid requests, 6th should be limited
for i in {1..6}; do
  echo -n "Request $i: "
  curl -s -o /dev/null -w "Status Code: %{http_code}\n" http://localhost:3000/api/test
done
```

### Test 2: Check Response Headers
```bash
curl -s -I http://localhost:3000/api/test | grep -i ratelimit
```

### Test 3: Test with Different IPs
```bash
# IP1: 192.168.1.100
curl -H "X-Forwarded-For: 192.168.1.100" http://localhost:3000/api/test

# IP2: 192.168.1.101
curl -H "X-Forwarded-For: 192.168.1.101" http://localhost:3000/api/test
```

## 📊 Expected Results

### Success Scenario
1. **First 5 requests**: Return 200 status code
2. **6th request**: Return 429 status code
3. **Error message**: "Rate limit exceeded. Please wait a few minutes before trying again."
4. **Response headers**: Include `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`
5. **Localhost**: Higher limits (1000 requests/10 minutes)
6. **Different IPs**: Independent counting limits

### Response Format Example
```json
{
  "error": "Rate limit exceeded. Please wait a few minutes before trying again.",
  "limit": 5,
  "reset": "2024-01-01T12:00:00.000Z",
  "remaining": 0
}
```

## 🔍 Troubleshooting

### Issue 1: All Requests Succeed
**Possible Cause**: Localhost exemption active
**Solution**: Test with external IP
```bash
curl -H "X-Forwarded-For: 8.8.8.8" http://localhost:3000/api/test
```

### Issue 2: No Rate Limiting
**Possible Cause**: Upstash Redis not configured
**Check Steps**:
1. Confirm Upstash configuration in `.env.local` file
2. Check if environment variables are loaded correctly
3. Check console for Redis connection errors

### Issue 3: Incorrect Error Response Format
**Check Steps**:
1. Run `node test-error-response.js`
2. Check error response logic in `proxy.ts`
3. Confirm JSON serialization is correct

## 📝 Test Checklist

### Test Items
- [ ] Basic rate limiting functionality
- [ ] Localhost exemption
- [ ] Independent limits for different IPs
- [ ] Error response format
- [ ] Response header information
- [ ] Sliding window algorithm

### Testing Frequency
- Run full tests before each deployment
- Run quick tests during development
- Monitor rate limiting triggers in production

## 🎯 Production Environment Validation

### 1. Monitor Logs
Check for 429 status code requests to confirm rate limiting is working.

### 2. Performance Testing
Use tools like `wrk` or `artillery` for stress testing:
```bash
# Example: Test with wrk
wrk -t12 -c100 -d30s http://your-domain.com/api/test
```

### 3. Real-time Monitoring
Set up monitoring alerts for abnormal rate limiting trigger frequencies.

## 📚 Related Files
- `lib/ratelimit.ts` - Rate limiting utilities
- `proxy.ts` - Middleware/proxy configuration
- `.env.local` - Environment variable configuration
- `app/api/test/route.ts` - Test API endpoint

## 🆘 Getting Help

If tests fail or you have issues, check:
1. Upstash Redis connection status
2. Environment variables are correctly set
3. Middleware configuration is correct
4. Console error logs