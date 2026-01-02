#!/bin/bash

echo "🚀 Rate Limiting Setup Script"
echo "=============================="
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ .env.local file not found"
    echo "Creating .env.local from .env..."
    cp .env .env.local 2>/dev/null || touch .env.local
fi

echo "📋 Current .env.local contents:"
echo "-------------------------------"
grep -E "UPSTASH|REDIS" .env.local || echo "No Upstash Redis configuration found"
echo ""

echo "🔧 Configuration Options:"
echo "1. Manual configuration (edit .env.local)"
echo "2. Test existing configuration"
echo "3. Run comprehensive tests"
echo "4. Exit"
echo ""

read -p "Select option (1-4): " option

case $option in
    1)
        echo ""
        echo "📝 Manual Configuration"
        echo "----------------------"
        echo "Please add the following to your .env.local file:"
        echo ""
        echo "# Upstash Redis for Rate Limiting"
        echo "UPSTASH_REDIS_REST_URL=https://your-region.upstash.io"
        echo "UPSTASH_REDIS_REST_TOKEN=your_token_here"
        echo ""
        echo "Get these values from: https://console.upstash.com/redis"
        echo ""
        read -p "Press Enter to open .env.local for editing..."
        nano .env.local || vi .env.local || code .env.local || notepad .env.local
        ;;
    2)
        echo ""
        echo "🔍 Testing Configuration"
        echo "----------------------"
        if [ -f test-redis-connection.js ]; then
            echo "Running Redis connection test..."
            node test-redis-connection.js
        else
            echo "❌ test-redis-connection.js not found"
            echo "Creating test script..."
            cat > test-redis-connection.js << 'EOF'
const { Redis } = require("@upstash/redis");

async function test() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    console.log("❌ Environment variables not set");
    console.log("Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in .env.local");
    return;
  }

  try {
    const redis = new Redis({ url, token });
    await redis.ping();
    console.log("✅ Redis connection successful");
  } catch (error) {
    console.log("❌ Redis connection failed:", error.message);
  }
}

test();
EOF
            node test-redis-connection.js
        fi
        ;;
    3)
        echo ""
        echo "🧪 Running Comprehensive Tests"
        echo "---------------------------"
        echo "1. First, ensure development server is running:"
        echo "   npm run dev"
        echo ""
        echo "2. Then run tests in another terminal:"
        echo "   npm run test:all"
        echo ""
        echo "Or run individual tests:"
        echo "   npm run test:ratelimit    # Basic test"
        echo "   npm run test:localhost    # Localhost exemption"
        echo "   npm run test:error        # Error response format"
        echo "   npm run test:quick        # Quick curl test"
        ;;
    4)
        echo "Exiting..."
        exit 0
        ;;
    *)
        echo "Invalid option"
        ;;
esac

echo ""
echo "📚 Additional Resources:"
echo "----------------------"
echo "1. Create Upstash Redis: https://console.upstash.com/redis"
echo "2. Documentation: RATE_LIMIT_SETUP_GUIDE.md"
echo "3. Testing Guide: RATE_LIMIT_TESTING.md"
echo ""
echo "✅ Setup complete!"