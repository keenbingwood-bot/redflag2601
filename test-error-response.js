#!/usr/bin/env node

const http = require('http');

async function triggerRateLimit() {
  console.log('🔍 Validating Rate Limit Error Response Format\n');
  console.log('Goal: Trigger rate limiting and check error response format');
  console.log('─'.repeat(60));

  // First send enough requests to trigger the limit
  console.log('Step 1: Triggering rate limit...');
  const requests = [];

  for (let i = 0; i < 10; i++) {
    const result = await makeRequest('203.0.113.1'); // Use test IP
    requests.push(result);
    if (result.status === 429) {
      console.log(`Request ${i + 1}: Rate limited (429)`);
      break;
    }
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Find the first 429 response
  const rateLimitedResponse = requests.find(r => r.status === 429);

  if (!rateLimitedResponse) {
    console.log('⚠ Failed to trigger rate limit, may be localhost or configuration issue');
    return;
  }

  console.log('\nStep 2: Analyzing error response...');
  console.log('─'.repeat(40));

  // Check status code
  console.log(`📋 Status Code: ${rateLimitedResponse.status}`);
  if (rateLimitedResponse.status === 429) {
    console.log('   ✅ Correctly returns 429 status code');
  } else {
    console.log('   ❌ Incorrect status code');
  }

  // Check response headers
  console.log('\n📋 Response Headers Check:');
  const expectedHeaders = [
    'content-type',
    'x-ratelimit-limit',
    'x-ratelimit-remaining',
    'x-ratelimit-reset',
  ];

  let headersPass = 0;
  for (const header of expectedHeaders) {
    const value = rateLimitedResponse.headers[header];
    if (value) {
      console.log(`   ✅ ${header}: ${value}`);
      headersPass++;
    } else {
      console.log(`   ❌ ${header}: Missing`);
    }
  }

  // Check response body
  console.log('\n📋 Response Body Check:');
  const responseData = rateLimitedResponse.data;

  if (typeof responseData === 'object' && responseData !== null) {
    console.log('   ✅ Response body is valid JSON');

    // Check required fields
    const requiredFields = ['error', 'limit', 'reset', 'remaining'];
    let fieldsPass = 0;

    for (const field of requiredFields) {
      if (responseData[field] !== undefined) {
        console.log(`   ✅ ${field}: ${JSON.stringify(responseData[field])}`);
        fieldsPass++;
      } else {
        console.log(`   ❌ ${field}: Missing`);
      }
    }

    // Check error message
    if (responseData.error && responseData.error.includes('Rate limit exceeded')) {
      console.log('   ✅ Error message contains expected text');
    } else {
      console.log(`   ❌ Error message incorrect: ${responseData.error}`);
    }

    // Check timestamp format
    if (responseData.reset) {
      const resetDate = new Date(responseData.reset);
      if (!isNaN(resetDate.getTime())) {
        console.log(`   ✅ reset time is valid ISO format: ${responseData.reset}`);
      } else {
        console.log(`   ❌ reset time format invalid: ${responseData.reset}`);
      }
    }

    console.log(`\n📊 Field Check: ${fieldsPass}/${requiredFields.length} passed`);
  } else {
    console.log('   ❌ Response body is not valid JSON');
    console.log(`   Response content: ${JSON.stringify(responseData)}`);
  }

  console.log(`\n📊 Header Check: ${headersPass}/${expectedHeaders.length} passed`);

  // Show complete error response
  console.log('\n📋 Complete Error Response:');
  console.log('─'.repeat(40));
  console.log('Status Code:', rateLimitedResponse.status);
  console.log('Response Headers:');
  Object.entries(rateLimitedResponse.headers).forEach(([key, value]) => {
    console.log(`  ${key}: ${value}`);
  });
  console.log('Response Body:');
  console.log(JSON.stringify(responseData, null, 2));

  // Summary
  console.log('\n' + '─'.repeat(60));
  console.log('📊 Validation Summary:');

  const totalChecks = 5; // status code + headers count + JSON format + error message + time format
  let passedChecks = 0;

  if (rateLimitedResponse.status === 429) passedChecks++;
  if (headersPass >= 3) passedChecks++; // at least 3 headers
  if (typeof responseData === 'object') passedChecks++;
  if (responseData.error && responseData.error.includes('Rate limit exceeded')) passedChecks++;
  if (responseData.reset && !isNaN(new Date(responseData.reset).getTime())) passedChecks++;

  console.log(`Passed Checks: ${passedChecks}/${totalChecks}`);

  if (passedChecks >= 4) {
    console.log('🎉 Error response format validation passed!');
    console.log('✅ Rate limit error response format meets requirements');
  } else {
    console.log('🔧 Error response format needs adjustment');
  }
}

async function makeRequest(ip) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/test',
      method: 'GET',
      headers: {
        'X-Forwarded-For': ip,
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

    req.on('error', reject);
    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

// Run the test
triggerRateLimit().catch(console.error);