# Rate Limiting Setup and Configuration Guide

## 📋 Overview

This guide provides step-by-step instructions for setting up and configuring the rate limiting system for both development and production environments.

## 🚀 Part 1: Upstash Redis Configuration

### Step 1: Create Upstash Redis Database

1. **Sign up/Login to Upstash**
   - Go to [https://upstash.com](https://upstash.com)
   - Create an account or login

2. **Create Redis Database**
   - Click "Create Database"
   - Choose "Redis" as database type
   - Select region closest to your users
   - Choose "Free Tier" for development or paid plan for production
   - Click "Create"

3. **Get Connection Details**
   - After creation, go to database details
   - Copy the "REST URL" (starts with `https://`)
   - Copy the "REST Token" (starts with `AX`)

### Step 2: Configure Environment Variables

**For Development (.env.local):**
```bash
# Add these lines to your .env.local file
UPSTASH_REDIS_REST_URL=https://your-region.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_token_here
```

**For Production:**
- Add the same variables to your hosting platform (Vercel, Railway, etc.)
- Use environment variables section in your hosting dashboard

### Step 3: Test Redis Connection

```bash
# Install dependencies if not already installed
npm install @upstash/redis

# Test connection
node test-redis-connection.js
```

Expected output:
```
✅ Environment variables found
✅ Ping response: PONG
✅ Set test key: test:1234567890
✅ Get test key: test-value
✅ Deleted test key: test:1234567890
✅ Rate limit test successful
🎉 Redis connection successful! Rate limiting ready to use.
```

## 🔧 Part 2: Local Testing Techniques

### Understanding Localhost Exemption

The system has special handling for localhost:
- **Localhost (127.0.0.1, ::1)**: 1000 requests/10 minutes
- **External IPs**: 5 requests/10 minutes

### Testing Methods

#### Method 1: Use External IP for Testing
```bash
# Test with external IP (will trigger rate limiting)
curl -H "X-Forwarded-For: 8.8.8.8" http://localhost:3000/api/test

# Test with different IPs
curl -H "X-Forwarded-For: 192.168.1.100" http://localhost:3000/api/test
curl -H "X-Forwarded-For: 192.168.1.101" http://localhost:3000/api/test
```

#### Method 2: Disable Localhost Exemption (for testing)
Temporarily modify `proxy.ts`:
```typescript
// Change this line in proxy.ts
const isLocal = isLocalhost(ip);

// To this (force external IP behavior):
const isLocal = false;
```

#### Method 3: Use Test Scripts
```bash
# Test with external IP simulation
npm run test:ratelimit

# Comprehensive test
npm run test:all
```

### Common Testing Scenarios

#### Scenario 1: Verify Rate Limiting Works
```bash
# Send 6 requests quickly with external IP
for i in {1..6}; do
  echo -n "Request $i: "
  curl -s -o /dev/null -w "Status: %{http_code}\n" \
    -H "X-Forwarded-For: 203.0.113.$i" \
    http://localhost:3000/api/test
done
```

#### Scenario 2: Test Independent IP Limits
```bash
# IP 1: 192.168.1.100 (should get 5 requests)
for i in {1..6}; do
  curl -H "X-Forwarded-For: 192.168.1.100" http://localhost:3000/api/test
done

# IP 2: 192.168.1.101 (should also get 5 requests)
for i in {1..6}; do
  curl -H "X-Forwarded-For: 192.168.1.101" http://localhost:3000/api/test
done
```

## 🚀 Part 3: Production Environment Deployment

### Step 1: Production Redis Database

1. **Upgrade to Production Plan**
   - In Upstash dashboard, upgrade database to paid plan
   - Choose appropriate tier based on expected traffic
   - Enable persistence if needed

2. **Get Production Credentials**
   - Use same database or create new production database
   - Copy production REST URL and Token

### Step 2: Configure Production Environment

**Vercel Deployment:**
```bash
# Using Vercel CLI
vercel env add UPSTASH_REDIS_REST_URL
vercel env add UPSTASH_REDIS_REST_TOKEN

# Or through Vercel Dashboard:
# 1. Go to project settings
# 2. Navigate to "Environment Variables"
# 3. Add both variables
```

**Railway Deployment:**
```bash
# Using Railway CLI
railway variables set UPSTASH_REDIS_REST_URL=your_url
railway variables set UPSTASH_REDIS_REST_TOKEN=your_token

# Or through Railway Dashboard
```

**Other Platforms:**
- Add environment variables in platform's settings
- Ensure variables are available at build time

### Step 3: Verify Production Setup

1. **Deploy Application**
   ```bash
   # For Vercel
   vercel --prod

   # For Railway
   railway up
   ```

2. **Test Production Endpoint**
   ```bash
   # Test rate limiting in production
   curl https://your-domain.com/api/test

   # Test with external IP
   curl -H "X-Forwarded-For: 8.8.8.8" https://your-domain.com/api/test
   ```

3. **Monitor Rate Limiting**
   - Check application logs for 429 responses
   - Monitor Upstash Redis metrics
   - Set up alerts for abnormal traffic

## 🔍 Troubleshooting Guide

### Issue: Redis Connection Failed
**Symptoms:**
- Rate limiting not working
- 500 errors on API requests
- Console shows Redis connection errors

**Solutions:**
1. Check environment variables are set correctly
2. Verify Redis database is active in Upstash
3. Test connection with `node test-redis-connection.js`
4. Check network connectivity/firewall rules

### Issue: No Rate Limiting in Production
**Symptoms:**
- All requests succeed even with high volume
- No 429 responses

**Solutions:**
1. Verify production environment variables are set
2. Check middleware is deployed (`proxy.ts`)
3. Test with external IP using `X-Forwarded-For` header
4. Check application logs for middleware execution

### Issue: Rate Limiting Too Aggressive
**Symptoms:**
- Legitimate users getting rate limited
- 429 responses for normal usage

**Solutions:**
1. Adjust limits in `lib/ratelimit.ts`:
   ```typescript
   // Increase limit
   limiter: Ratelimit.slidingWindow(10, "10 m"), // 10 requests/10 minutes
   ```
2. Consider user authentication for higher limits
3. Implement different limits for different endpoints

## 📊 Monitoring and Maintenance

### 1. Upstash Redis Monitoring
- Monitor memory usage
- Track request counts
- Set up alerts for high usage

### 2. Application Monitoring
- Log 429 responses
- Track rate limit triggers by IP
- Monitor API response times

### 3. Regular Maintenance
- Review rate limit thresholds quarterly
- Update based on usage patterns
- Test rate limiting after deployments

## 🆘 Getting Help

### 1. Upstash Support
- Documentation: [https://upstash.com/docs](https://upstash.com/docs)
- Discord: [https://upstash.com/discord](https://upstash.com/discord)

### 2. Next.js Middleware
- Documentation: [https://nextjs.org/docs/app/building-your-application/routing/middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)

### 3. Rate Limiting Best Practices
- Start with conservative limits
- Monitor and adjust based on real usage
- Consider user authentication for personalized limits

## 📁 File Reference

- `lib/ratelimit.ts` - Rate limiting configuration
- `proxy.ts` - Middleware implementation
- `.env.local` - Development environment variables
- `test-redis-connection.js` - Redis connection tester
- `RATE_LIMIT_TESTING.md` - Testing guide

## 🎯 Quick Start Checklist

- [x] Create Upstash Redis database ✓
- [x] Add credentials to `.env.local` ✓
- [x] Test Redis connection ✓
- [x] Test rate limiting locally ✓
- [ ] Deploy to production ⚠ Ready for deployment
- [x] Set production environment variables ✓ (Configured in Vercel)
- [ ] Test rate limiting in production ⚠ Use `test-production-ratelimit.js` after deployment
- [ ] Set up monitoring ⚠ Configure in production

**✅ Setup Complete - Ready for Production Deployment**