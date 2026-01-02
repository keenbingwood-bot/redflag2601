#!/usr/bin/env node

const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

async function runTest(name, command) {
  console.log(`\n🚀 Starting Test: ${name}`);
  console.log('─'.repeat(50));

  try {
    const { stdout, stderr } = await execAsync(command);

    if (stdout) {
      console.log(stdout);
    }

    if (stderr) {
      console.error('⚠ Warning:', stderr);
    }

    console.log(`✅ ${name} Completed`);
    return true;
  } catch (error) {
    console.error(`❌ ${name} Failed:`, error.message);
    if (error.stdout) console.log('Output:', error.stdout);
    if (error.stderr) console.error('Error:', error.stderr);
    return false;
  }
}

async function runAllTests() {
  console.log('🎯 Comprehensive Rate Limiting System Test');
  console.log('='.repeat(60));
  console.log('Note: Ensure development server is running (npm run dev)');
  console.log('='.repeat(60));

  const tests = [
    {
      name: 'TypeScript Compilation Check',
      command: 'npx tsc --noEmit',
    },
    {
      name: 'Next.js Build Check',
      command: 'npm run build 2>&1 | head -30',
    },
    {
      name: 'Basic Rate Limiting Test',
      command: 'node test-rate-limit.js',
    },
    {
      name: 'Localhost Exemption Test',
      command: 'node test-localhost-exemption.js',
    },
    {
      name: 'Error Response Format Test',
      command: 'node test-error-response.js',
    },
  ];

  const results = [];

  for (const test of tests) {
    const success = await runTest(test.name, test.command);
    results.push({ name: test.name, success });

    // Wait a bit between tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Show summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Test Results Summary');
  console.log('='.repeat(60));

  const passed = results.filter(r => r.success).length;
  const total = results.length;

  results.forEach((result, index) => {
    const icon = result.success ? '✅' : '❌';
    console.log(`${icon} ${index + 1}. ${result.name}`);
  });

  console.log('\n' + '='.repeat(60));
  console.log(`Passed: ${passed}/${total} tests`);

  if (passed === total) {
    console.log('🎉 All tests passed! Rate limiting system working correctly.');
  } else if (passed >= total * 0.7) {
    console.log('⚠ Most tests passed, but some issues need checking.');
  } else {
    console.log('🔧 Multiple tests failed, please check system configuration.');
  }

  // Provide next steps
  console.log('\n🔍 Next Steps:');
  if (passed < total) {
    console.log('1. Check Upstash Redis environment variable configuration');
    console.log('2. Confirm development server is running');
    console.log('3. Review specific failed test outputs');
  } else {
    console.log('1. Deploy to production environment');
    console.log('2. Set production environment variables');
    console.log('3. Monitor rate limiting in production');
  }

  console.log('\n📚 See RATE_LIMIT_TESTING.md for more information');
}

// Run all tests
runAllTests().catch(console.error);