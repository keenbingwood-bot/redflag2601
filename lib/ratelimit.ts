import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Create a new ratelimiter with sliding window strategy
// 5 requests per 10 minutes
export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "10 m"),
  analytics: true,
  prefix: "@upstash/ratelimit",
});

// Helper function to check if request is from localhost
export function isLocalhost(ip: string | null): boolean {
  if (!ip) return false;
  return ip === "127.0.0.1" || ip === "::1" || ip === "::ffff:127.0.0.1";
}

// Create a separate rate limiter for localhost with higher limits
// This allows unlimited requests for local development
export const localhostRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(1000, "10 m"), // Very high limit for localhost
  analytics: true,
  prefix: "@upstash/ratelimit/localhost",
});