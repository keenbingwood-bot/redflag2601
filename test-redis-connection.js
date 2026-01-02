#!/usr/bin/env node

const { Redis } = require("@upstash/redis");

async function testRedisConnection() {
  console.log('🔍 Testing Redis Connection\n');
  console.log('='.repeat(60));

  // Check if environment variables are set
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    console.error('❌ Environment variables not set');
    console.log('\nPlease set the following in .env.local:');
    console.log('UPSTASH_REDIS_REST_URL=your_upstash_redis_url');
    console.log('UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token');
    console.log('\nOr run with:');
    console.log('UPSTASH_REDIS_REST_URL=url UPSTASH_REDIS_REST_TOKEN=token node test-redis-connection.js');
    process.exit(1);
  }

  console.log('✅ Environment variables found');
  console.log(`URL: ${url.substring(0, 30)}...`);
  console.log(`Token: ${token.substring(0, 10)}...`);

  try {
    // Initialize Redis client
    const redis = new Redis({
      url,
      token,
    });

    console.log('\n🔄 Testing Redis connection...');

    // Test 1: Ping Redis
    const pingResult = await redis.ping();
    console.log(`✅ Ping response: ${pingResult}`);

    // Test 2: Set a test key
    const testKey = `test:${Date.now()}`;
    await redis.set(testKey, 'test-value');
    console.log(`✅ Set test key: ${testKey}`);

    // Test 3: Get the test key
    const getResult = await redis.get(testKey);
    console.log(`✅ Get test key: ${getResult}`);

    // Test 4: Delete the test key
    await redis.del(testKey);
    console.log(`✅ Deleted test key: ${testKey}`);

    // Test 5: Test rate limiting operations
    console.log('\n🔄 Testing rate limiting operations...');

    const { Ratelimit } = require("@upstash/ratelimit");
    const ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "10 m"),
      analytics: true,
    });

    const testIp = 'test-ip-123';
    const limitResult = await ratelimit.limit(testIp);

    console.log(`✅ Rate limit test successful`);
    console.log(`   Success: ${limitResult.success}`);
    console.log(`   Limit: ${limitResult.limit}`);
    console.log(`   Remaining: ${limitResult.remaining}`);

    console.log('\n🎉 Redis connection successful! Rate limiting ready to use.');
    console.log('\n📊 Connection Details:');
    console.log(`   Database: Upstash Redis`);
    console.log(`   Status: Connected`);
    console.log(`   Rate Limiting: Ready`);

  } catch (error) {
    console.error('\n❌ Redis connection failed:');
    console.error(`   Error: ${error.message}`);

    if (error.code === 'ECONNREFUSED') {
      console.error('\n🔧 Troubleshooting:');
      console.error('   1. Check if URL is correct');
      console.error('   2. Verify token is valid');
      console.error('   3. Check network connectivity');
      console.error('   4. Ensure database is active in Upstash console');
    }

    process.exit(1);
  }
}

// Run the test
testRedisConnection().catch(console.error);