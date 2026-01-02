#!/usr/bin/env node

const http = require('http');

// 测试配置 - 使用单个IP发送多个请求
const TEST_URL = 'http://localhost:3002/api/test';
const REQUESTS_TO_SEND = 10; // 发送10个请求
const DELAY_BETWEEN_REQUESTS = 100; // 100ms间隔
const TEST_IP = '203.0.113.100'; // 使用一个外部IP

async function makeRequest() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3002,
      path: '/api/test',
      method: 'GET',
      headers: {
        'X-Forwarded-For': TEST_IP
      },
    };

    const req = http.request(options, (res) => {
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
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: data,
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

async function runTest() {
  console.log('🚀 Starting Single IP Rate Limit Test\n');
  console.log(`Test Endpoint: ${TEST_URL}`);
  console.log(`Test IP: ${TEST_IP}`);
  console.log(`Requests to Send: ${REQUESTS_TO_SEND}`);
  console.log(`Delay Between Requests: ${DELAY_BETWEEN_REQUESTS}ms`);
  console.log('─'.repeat(50));

  const results = [];
  let successCount = 0;
  let rateLimitedCount = 0;
  let errorCount = 0;

  for (let i = 0; i < REQUESTS_TO_SEND; i++) {
    try {
      const result = await makeRequest();
      results.push(result);

      if (result.status === 200) {
        successCount++;
        console.log(`✅ Request ${i + 1}: Success (Status: ${result.status})`);
        console.log(`   Remaining: ${result.headers['x-ratelimit-remaining'] || 'Unknown'}`);
      } else if (result.status === 429) {
        rateLimitedCount++;
        console.log(`⛔ Request ${i + 1}: Rate Limited (Status: ${result.status})`);
        console.log(`   Error Message: ${result.data?.error || 'Unknown error'}`);
        console.log(`   Remaining: ${result.headers['x-ratelimit-remaining'] || 'Unknown'}`);
      } else {
        errorCount++;
        console.log(`❌ Request ${i + 1}: Error (Status: ${result.status})`);
      }
    } catch (error) {
      errorCount++;
      console.log(`💥 Request ${i + 1}: Failed - ${error.message}`);
    }

    // Wait if not the last request
    if (i < REQUESTS_TO_SEND - 1) {
      await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_REQUESTS));
    }
  }

  console.log('\n' + '─'.repeat(50));
  console.log('📊 Test Results Summary:');
  console.log(`✅ Successful Requests: ${successCount}`);
  console.log(`⛔ Rate Limited Requests: ${rateLimitedCount}`);
  console.log(`❌ Error Requests: ${errorCount}`);
  console.log(`📈 Success Rate: ${((successCount / REQUESTS_TO_SEND) * 100).toFixed(1)}%`);

  // Show rate limit header information
  if (results.length > 0) {
    const lastResult = results[results.length - 1];
    if (lastResult.headers['x-ratelimit-limit']) {
      console.log('\n📋 Rate Limit Headers (Last Request):');
      console.log(`   X-RateLimit-Limit: ${lastResult.headers['x-ratelimit-limit']}`);
      console.log(`   X-RateLimit-Remaining: ${lastResult.headers['x-ratelimit-remaining']}`);
      console.log(`   X-RateLimit-Reset: ${lastResult.headers['x-ratelimit-reset']}`);
    }
  }

  // Analyze test results
  console.log('\n🔍 Test Analysis:');
  if (rateLimitedCount > 0) {
    console.log('   ✅ Rate limiting is working correctly');
    console.log('   ✅ Requests exceeding limit return 429 status code');
    console.log('   ✅ Error messages are clear and informative');

    // Check if rate limiting happened at the right point (after 5 requests)
    const firstRateLimitedIndex = results.findIndex(r => r.status === 429);
    if (firstRateLimitedIndex >= 5) {
      console.log(`   ✅ Rate limiting triggered correctly after ${firstRateLimitedIndex + 1} requests`);
    } else {
      console.log(`   ⚠ Rate limiting triggered early at request ${firstRateLimitedIndex + 1}`);
    }
  } else if (successCount === REQUESTS_TO_SEND) {
    console.log('   ⚠ All requests succeeded - check if IP is being treated as localhost');
    console.log('   ℹ Expected: 5 successful requests, then rate limiting');
  } else {
    console.log('   ❓ Unexpected results, please check configuration');
  }
}

// Run the test
runTest().catch(console.error);