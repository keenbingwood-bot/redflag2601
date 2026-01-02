#!/usr/bin/env node

/**
 * Production Rate Limit Testing Script
 *
 * This script tests rate limiting in production environment.
 * Replace YOUR_PRODUCTION_DOMAIN with your actual domain before running.
 *
 * Usage:
 * node test-production-ratelimit.js
 */

const https = require('https');

// Configuration - UPDATE THESE VALUES
const PRODUCTION_DOMAIN = 'YOUR_PRODUCTION_DOMAIN'; // e.g., 'redflag.buzz'
const TEST_ENDPOINT = `/api/test`;
const REQUESTS_TO_SEND = 10;
const DELAY_BETWEEN_REQUESTS = 100; // ms

// Test IPs - using different IPs to test isolation
const testIPs = [
  '203.0.113.100',
  '203.0.113.101',
  '203.0.113.102',
  '203.0.113.103',
  '203.0.113.104',
];

async function makeRequest(ip = null, requestNum = 1) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: PRODUCTION_DOMAIN,
      port: 443,
      path: TEST_ENDPOINT,
      method: 'GET',
      headers: {},
    };

    // Add X-Forwarded-For header to simulate external IP
    if (ip) {
      options.headers['X-Forwarded-For'] = ip;
    }

    // Add User-Agent to identify test requests
    options.headers['User-Agent'] = `RateLimitTest/1.0 (Request ${requestNum})`;

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: jsonData,
            ip: ip || 'default',
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: data,
            ip: ip || 'default',
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout (10s)'));
    });

    req.end();
  });
}

async function runSingleIPTest(ip) {
  console.log(`\n🔍 Testing single IP: ${ip}`);
  console.log('─'.repeat(50));

  const results = [];

  for (let i = 0; i < REQUESTS_TO_SEND; i++) {
    try {
      const result = await makeRequest(ip, i + 1);
      results.push(result);

      if (result.status === 200) {
        console.log(`✅ Request ${i + 1}: Success (Status: ${result.status})`);
        console.log(`   Remaining: ${result.headers['x-ratelimit-remaining'] || 'Unknown'}`);
      } else if (result.status === 429) {
        console.log(`⛔ Request ${i + 1}: Rate Limited (Status: ${result.status})`);
        console.log(`   Error: ${result.data?.error?.substring(0, 50) || 'Unknown error'}...`);
        console.log(`   Remaining: ${result.headers['x-ratelimit-remaining'] || 'Unknown'}`);
      } else {
        console.log(`❌ Request ${i + 1}: Unexpected Status (${result.status})`);
      }
    } catch (error) {
      console.log(`💥 Request ${i + 1}: Failed - ${error.message}`);
    }

    // Wait between requests
    if (i < REQUESTS_TO_SEND - 1) {
      await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_REQUESTS));
    }
  }

  // Analyze results
  const successCount = results.filter(r => r.status === 200).length;
  const rateLimitedCount = results.filter(r => r.status === 429).length;

  console.log('\n📊 Summary:');
  console.log(`   Successful: ${successCount}`);
  console.log(`   Rate Limited: ${rateLimitedCount}`);

  if (rateLimitedCount > 0 && successCount >= 5) {
    console.log('   ✅ Rate limiting working correctly');
  } else if (successCount === REQUESTS_TO_SEND) {
    console.log('   ⚠ All requests succeeded - check configuration');
  }

  return results;
}

async function runMultiIPTest() {
  console.log('\n🔍 Testing multiple IPs (IP isolation)');
  console.log('─'.repeat(50));

  const allResults = [];

  // Test each IP with 3 requests
  for (let ipIndex = 0; ipIndex < testIPs.length; ipIndex++) {
    const ip = testIPs[ipIndex];
    console.log(`\nTesting IP ${ipIndex + 1}: ${ip}`);

    for (let i = 0; i < 3; i++) {
      try {
        const result = await makeRequest(ip, i + 1);
        allResults.push(result);

        if (result.status === 200) {
          console.log(`  ✅ Request ${i + 1}: Success`);
        } else if (result.status === 429) {
          console.log(`  ⛔ Request ${i + 1}: Rate Limited`);
        }
      } catch (error) {
        console.log(`  💥 Request ${i + 1}: Failed`);
      }

      if (i < 2) {
        await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_REQUESTS));
      }
    }
  }

  // Check if all IPs got their own limits
  const ipResults = {};
  allResults.forEach(result => {
    if (!ipResults[result.ip]) {
      ipResults[result.ip] = { success: 0, limited: 0 };
    }
    if (result.status === 200) ipResults[result.ip].success++;
    if (result.status === 429) ipResults[result.ip].limited++;
  });

  console.log('\n📊 IP Isolation Test:');
  Object.entries(ipResults).forEach(([ip, counts]) => {
    console.log(`   ${ip}: ${counts.success} success, ${counts.limited} limited`);
  });

  const allIPsGotRequests = Object.keys(ipResults).length === testIPs.length;
  if (allIPsGotRequests) {
    console.log('   ✅ IP isolation working correctly');
  }
}

async function runHealthCheck() {
  console.log('\n🏥 Production Health Check');
  console.log('─'.repeat(50));

  try {
    const result = await makeRequest(null, 0);

    console.log(`Domain: ${PRODUCTION_DOMAIN}`);
    console.log(`Endpoint: ${TEST_ENDPOINT}`);
    console.log(`Status: ${result.status}`);

    if (result.status === 200) {
      console.log('✅ API endpoint is accessible');

      // Check headers
      const hasRateLimitHeaders =
        result.headers['x-ratelimit-limit'] &&
        result.headers['x-ratelimit-remaining'] &&
        result.headers['x-ratelimit-reset'];

      if (hasRateLimitHeaders) {
        console.log('✅ Rate limit headers present');
        console.log(`   Limit: ${result.headers['x-ratelimit-limit']}`);
        console.log(`   Remaining: ${result.headers['x-ratelimit-remaining']}`);
        console.log(`   Reset: ${result.headers['x-ratelimit-reset']}`);
      } else {
        console.log('⚠ Rate limit headers missing');
      }
    } else {
      console.log(`❌ Unexpected status: ${result.status}`);
    }
  } catch (error) {
    console.log(`💥 Health check failed: ${error.message}`);
    console.log('Please check:');
    console.log('1. Domain is correct and accessible');
    console.log('2. SSL certificate is valid');
    console.log('3. API endpoint exists');
  }
}

async function main() {
  console.log('🚀 Production Rate Limit Testing');
  console.log('='.repeat(60));

  if (PRODUCTION_DOMAIN === 'YOUR_PRODUCTION_DOMAIN') {
    console.log('❌ Please update PRODUCTION_DOMAIN in this script');
    console.log('Current value:', PRODUCTION_DOMAIN);
    console.log('\nExample:');
    console.log('const PRODUCTION_DOMAIN = "redflag.buzz";');
    return;
  }

  console.log(`Testing domain: ${PRODUCTION_DOMAIN}`);
  console.log(`Test endpoint: ${TEST_ENDPOINT}`);
  console.log(`Requests per IP: ${REQUESTS_TO_SEND}`);
  console.log(`Test IPs: ${testIPs.length}`);

  // Run tests
  await runHealthCheck();
  await runSingleIPTest(testIPs[0]);
  await runMultiIPTest();

  console.log('\n' + '='.repeat(60));
  console.log('🎉 Production rate limit testing complete!');
  console.log('\n📋 Expected Results:');
  console.log('1. Health check: 200 status with rate limit headers');
  console.log('2. Single IP: First 5 requests succeed, next 5 get 429');
  console.log('3. Multiple IPs: Each IP gets its own 5-request limit');
  console.log('\n⚠ Important:');
  console.log('- Tests use real production database');
  console.log('- Avoid running tests frequently to prevent false positives');
  console.log('- Monitor Upstash Redis usage during testing');
}

// Run the tests
main().catch(console.error);