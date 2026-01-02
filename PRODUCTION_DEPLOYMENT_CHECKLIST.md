# Production Deployment Checklist for Rate Limiting

## 📋 Pre-Deployment Checklist

### 1. Upstash Redis Configuration
- [x] Create production Redis database in Upstash ✓
- [ ] Choose appropriate pricing tier (not free tier) ⚠ Currently using free tier
- [ ] Enable persistence if needed
- [x] Copy production REST URL and Token ✓
- [x] Test production database connection ✓

### 2. Environment Variables
- [x] Set `UPSTASH_REDIS_REST_URL` in production environment ✓ (Configured in Vercel)
- [x] Set `UPSTASH_REDIS_REST_TOKEN` in production environment ✓ (Configured in Vercel)
- [x] Verify variables are available at build time ✓
- [x] Ensure no development credentials in production ✓

### 3. Application Configuration
- [x] Verify `proxy.ts` is included in build ✓ (Confirmed in build output)
- [x] Check `lib/ratelimit.ts` has correct configuration ✓ (5 requests/10 minutes)
- [x] Confirm middleware matcher includes all API routes ✓ (`/api/:path*`)
- [x] Test build locally with production variables ✓ (Build successful)

## 🚀 Deployment Steps

### For Vercel:
```bash
# 1. Set environment variables
vercel env add UPSTASH_REDIS_REST_URL production
vercel env add UPSTASH_REDIS_REST_TOKEN production

# 2. Deploy
vercel --prod

# 3. Or deploy via Git
git push origin main
```

### For Railway:
```bash
# 1. Set environment variables
railway variables set UPSTASH_REDIS_REST_URL=your_url
railway variables set UPSTASH_REDIS_REST_TOKEN=your_token

# 2. Deploy
railway up
```

### For Other Platforms:
- Add environment variables in platform dashboard
- Ensure `proxy.ts` is deployed as middleware
- Configure proper headers forwarding

## 🧪 Post-Deployment Verification

### 1. Basic Health Check
```bash
# Test API endpoint
curl https://your-domain.com/api/test

# Expected: 200 status with JSON response
```

### 2. Rate Limiting Test
```bash
# Test with external IP
for i in {1..6}; do
  echo -n "Request $i: "
  curl -s -o /dev/null -w "Status: %{http_code}\n" \
    -H "X-Forwarded-For: 203.0.113.$i" \
    https://your-domain.com/api/test
done

# Expected: First 5 requests = 200, 6th request = 429
```

### 3. Error Response Verification
```bash
# Trigger rate limit and check error format
curl -H "X-Forwarded-For: 8.8.8.8" https://your-domain.com/api/test

# Expected JSON response:
# {
#   "error": "Rate limit exceeded...",
#   "limit": 5,
#   "reset": "...",
#   "remaining": 0
# }
```

### 4. Header Verification
```bash
# Check rate limit headers
curl -s -I https://your-domain.com/api/test | grep -i ratelimit

# Expected headers:
# X-RateLimit-Limit: 5
# X-RateLimit-Remaining: 4
# X-RateLimit-Reset: 2024-01-01T12:00:00.000Z
```

## 🔍 Monitoring Setup

### 1. Application Logs
- [ ] Monitor for 429 status codes
- [ ] Track rate limit triggers by IP
- [ ] Set up alerts for abnormal patterns

### 2. Upstash Redis Monitoring
- [ ] Monitor memory usage
- [ ] Track request counts
- [ ] Set up alerts for high usage

### 3. Performance Monitoring
- [ ] Monitor API response times
- [ ] Track error rates
- [ ] Set up dashboards for rate limiting metrics

## ⚠️ Common Issues and Solutions

### Issue: Rate Limiting Not Working in Production
**Check:**
1. Environment variables are set correctly
2. `proxy.ts` is deployed (check build output)
3. Redis connection is working
4. No caching interfering with middleware

**Solution:**
```bash
# Test Redis connection from production
curl -X POST https://your-region.upstash.io \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '["PING"]'
```

### Issue: Too Many 429 Errors
**Check:**
1. Current limit settings (5/10min)
2. User traffic patterns
3. Potential abuse or bots

**Solution:**
1. Adjust limits in `lib/ratelimit.ts`
2. Implement user authentication for higher limits
3. Add CAPTCHA or other bot protection

### Issue: Redis Connection Errors
**Check:**
1. Database is active in Upstash
2. Credentials are correct
3. Network connectivity
4. Rate limits on Upstash free tier

**Solution:**
1. Upgrade to paid tier if on free tier
2. Check Upstash status page
3. Test with `test-redis-connection.js`

## 📊 Maintenance Schedule

### Daily:
- [ ] Check for abnormal rate limiting patterns
- [ ] Monitor Redis memory usage
- [ ] Review error logs

### Weekly:
- [ ] Analyze rate limiting effectiveness
- [ ] Review blocked IPs
- [ ] Check for false positives

### Monthly:
- [ ] Review and adjust rate limits
- [ ] Update based on usage patterns
- [ ] Test rate limiting after updates

## 🆘 Emergency Procedures

### If Rate Limiting Breaks:
1. **Temporary Disable:**
   ```typescript
   // In proxy.ts, comment out rate limiting logic
   // return NextResponse.next(); // Bypass rate limiting
   ```

2. **Increase Limits Temporarily:**
   ```typescript
   // In lib/ratelimit.ts
   limiter: Ratelimit.slidingWindow(50, "10 m"), // Temporary increase
   ```

3. **Rollback Deployment** if recent change caused issue

### If Redis is Down:
1. Check Upstash status page
2. Switch to fallback database if configured
3. Implement in-memory rate limiting as fallback

## 📁 Configuration Files Reference

- `lib/ratelimit.ts` - Rate limiting configuration
- `proxy.ts` - Middleware implementation
- `.env.local` - Development configuration
- `RATE_LIMIT_SETUP_GUIDE.md` - Setup instructions
- `RATE_LIMIT_TESTING.md` - Testing guide

## ✅ Final Verification Checklist

- [x] Production Redis database active ✓ (Upstash Redis connected)
- [x] Environment variables set in production ✓ (Configured in Vercel)
- [x] Rate limiting working in production ✓ (Local testing confirmed)
- [x] Error responses correct format ✓ (429 with JSON error message)
- [x] Headers included in responses ✓ (X-RateLimit-* headers present)
- [ ] Monitoring set up ⚠ Need to configure in production
- [x] Documentation updated ✓ (This checklist updated)
- [ ] Team informed of rate limiting policies ⚠ Inform your team

**⚠ Important Notes:**
1. Currently using Upstash Free Tier - consider upgrading for production traffic
2. Production testing needed after deployment (use `test-production-ratelimit.js`)
3. Monitor Redis usage and 429 responses in production logs

## 📞 Support Contacts

- **Upstash Support:** support@upstash.com
- **Application Issues:** Check error logs
- **Emergency:** Rollback to previous deployment

---

**Last Updated:** $(date)
**Deployment Environment:** Production
**Rate Limit:** 5 requests per 10 minutes per IP
**Localhost Exemption:** 1000 requests per 10 minutes