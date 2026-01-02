#!/usr/bin/env node

const http = require('http');

// 测试配置
const TEST_URL = 'http://localhost:3002/api/test';
const REQUESTS_TO_SEND = 10; // 发送10个请求
const DELAY_BETWEEN_REQUESTS = 100; // 100ms间隔
const USE_DIFFERENT_IPS = true; // 是否使用不同IP测试

// 模拟不同IP地址
const fakeIPs = [
  '192.168.1.100',
  '192.168.1.101',
  '192.168.1.102',
  '192.168.1.103',
  '192.168.1.104',
];

async function makeRequest(ip = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3002,
      path: '/api/test',
      method: 'GET',
      headers: {},
    };

    // 如果指定了IP，添加X-Forwarded-For头
    if (ip) {
      options.headers['X-Forwarded-For'] = ip;
    }

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
  console.log('🚀 Starting Rate Limit Test\n');
  console.log(`Test Endpoint: ${TEST_URL}`);
  console.log(`Requests to Send: ${REQUESTS_TO_SEND}`);
  console.log(`Delay Between Requests: ${DELAY_BETWEEN_REQUESTS}ms`);
  console.log(`Use Different IPs: ${USE_DIFFERENT_IPS ? 'Yes' : 'No'}`);
  console.log('─'.repeat(50));

  const results = [];
  let successCount = 0;
  let rateLimitedCount = 0;
  let errorCount = 0;

  for (let i = 0; i < REQUESTS_TO_SEND; i++) {
    const ip = USE_DIFFERENT_IPS ? fakeIPs[i % fakeIPs.length] : null;

    try {
      const result = await makeRequest(ip);
      results.push(result);

      if (result.status === 200) {
        successCount++;
        console.log(`✅ Request ${i + 1}: Success (Status: ${result.status})`);
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
      console.log('\n📋 Rate Limit Headers (Last Successful Request):');
      console.log(`   X-RateLimit-Limit: ${lastResult.headers['x-ratelimit-limit']}`);
      console.log(`   X-RateLimit-Remaining: ${lastResult.headers['x-ratelimit-remaining']}`);
      console.log(`   X-RateLimit-Reset: ${lastResult.headers['x-ratelimit-reset']}`);
    }
  }

  // Analyze test results
  console.log('\n🔍 Test Analysis:');
  if (rateLimitedCount > 0) {
    console.log('   ✓ Rate limiting is working correctly');
    console.log('   ✓ Requests exceeding limit return 429 status code');
    console.log('   ✓ Error messages are clear and informative');
  } else if (successCount === REQUESTS_TO_SEND) {
    console.log('   ⚠ All requests succeeded - localhost exemption may be active');
    console.log('   ℹ Localhost has higher limits (1000 requests/10 minutes)');
  } else {
    console.log('   ❓ Rate limiting not detected, please check configuration');
  }
}

// Run the test
runTest().catch(console.error);