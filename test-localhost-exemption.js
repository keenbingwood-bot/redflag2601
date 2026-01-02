#!/usr/bin/env node

const http = require('http');

async function makeRequest(ipHeader = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/test',
      method: 'GET',
      headers: {},
    };

    if (ipHeader) {
      options.headers['X-Forwarded-For'] = ipHeader;
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
            ipUsed: ipHeader || 'localhost (默认)',
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: data,
            ipUsed: ipHeader || 'localhost (默认)',
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

async function testLocalhostExemption() {
  console.log('🔍 Testing Localhost Exemption Feature\n');
  console.log('Theory: Localhost (127.0.0.1, ::1) should have higher limits (1000 requests/10 minutes)');
  console.log('External IPs should be limited to 5 requests/10 minutes');
  console.log('─'.repeat(60));

  // Test 1: Localhost requests (should use higher limits)
  console.log('\n📋 Test 1: Localhost Requests (no X-Forwarded-For header)');
  console.log('Sending 20 rapid requests, all should succeed:');

  const localResults = [];
  for (let i = 0; i < 20; i++) {
    try {
      const result = await makeRequest();
      localResults.push(result);
      process.stdout.write(result.status === 200 ? '✅' : '❌');
    } catch (error) {
      process.stdout.write('💥');
    }
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  const localSuccess = localResults.filter(r => r.status === 200).length;
  const localLimited = localResults.filter(r => r.status === 429).length;
  console.log(`\nResults: ${localSuccess} successful, ${localLimited} rate limited`);

  if (localLimited === 0) {
    console.log('✓ Localhost exemption working - higher limits active');
  } else {
    console.log('⚠ Localhost requests rate limited - check configuration');
  }

  // Test 2: External IP requests (should be limited)
  console.log('\n📋 Test 2: External IP Requests (X-Forwarded-For: 8.8.8.8)');
  console.log('Sending 10 rapid requests, should be limited after 6th:');

  const externalResults = [];
  for (let i = 0; i < 10; i++) {
    try {
      const result = await makeRequest('8.8.8.8');
      externalResults.push(result);
      if (result.status === 200) {
        process.stdout.write('✅');
      } else if (result.status === 429) {
        process.stdout.write('⛔');
      } else {
        process.stdout.write('❌');
      }
    } catch (error) {
      process.stdout.write('💥');
    }
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  const externalSuccess = externalResults.filter(r => r.status === 200).length;
  const externalLimited = externalResults.filter(r => r.status === 429).length;
  console.log(`\nResults: ${externalSuccess} successful, ${externalLimited} rate limited`);

  if (externalSuccess <= 5 && externalLimited >= 5) {
    console.log('✓ External IP limiting working - 5 requests/10 minutes limit active');
  } else {
    console.log('⚠ External IP limiting not working as expected');
  }

  // Test 3: Independent limits for different IP addresses
  console.log('\n📋 Test 3: Independent Limits for Different IP Addresses');
  console.log('Test IPs: 192.168.1.100 and 192.168.1.101');

  const ip1Results = [];
  const ip2Results = [];

  // Send 6 requests for IP1
  console.log('\nSending 6 requests for 192.168.1.100:');
  for (let i = 0; i < 6; i++) {
    const result = await makeRequest('192.168.1.100');
    ip1Results.push(result);
    process.stdout.write(result.status === 200 ? '✅' : '⛔');
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  // Send 6 requests for IP2
  console.log('\nSending 6 requests for 192.168.1.101:');
  for (let i = 0; i < 6; i++) {
    const result = await makeRequest('192.168.1.101');
    ip2Results.push(result);
    process.stdout.write(result.status === 200 ? '✅' : '⛔');
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  const ip1Success = ip1Results.filter(r => r.status === 200).length;
  const ip2Success = ip2Results.filter(r => r.status === 200).length;

  console.log(`\n\nResults:`);
  console.log(`  192.168.1.100: ${ip1Success} successful (expected: ≤5)`);
  console.log(`  192.168.1.101: ${ip2Success} successful (expected: ≤5)`);

  if (ip1Success <= 5 && ip2Success <= 5) {
    console.log('✓ Independent IP limiting working correctly');
  } else {
    console.log('⚠ Independent IP limiting not working as expected');
  }

  // Summary
  console.log('\n' + '─'.repeat(60));
  console.log('📊 Test Summary:');
  console.log(`1. Localhost Exemption: ${localLimited === 0 ? '✅ Working' : '⚠ Issues'}`);
  console.log(`2. External IP Limiting: ${externalSuccess <= 5 ? '✅ Working' : '⚠ Issues'}`);
  console.log(`3. Independent IP Limits: ${ip1Success <= 5 && ip2Success <= 5 ? '✅ Working' : '⚠ Issues'}`);

  if (localLimited === 0 && externalSuccess <= 5 && ip1Success <= 5 && ip2Success <= 5) {
    console.log('\n🎉 All tests passed! Rate limiting system working correctly.');
  } else {
    console.log('\n🔧 Some tests failed, please check configuration.');
    console.log('Tip: Ensure Upstash Redis environment variables are correctly set.');
  }
}

// Run the test
testLocalhostExemption().catch(console.error);