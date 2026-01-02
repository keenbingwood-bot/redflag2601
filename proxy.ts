import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ratelimit, isLocalhost, localhostRatelimit } from "./lib/ratelimit";

export async function proxy(request: NextRequest) {
  // Only apply rate limiting to API routes
  if (!request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Get the IP address from the request
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
             request.headers.get("x-real-ip") ||
             "anonymous";

  // Check if it's localhost
  const isLocal = isLocalhost(ip);

  // Use appropriate rate limiter based on IP
  const { success, limit, reset, remaining } = isLocal
    ? await localhostRatelimit.limit(ip)
    : await ratelimit.limit(ip);

  // If rate limit is exceeded, return 429 response
  if (!success) {
    return new NextResponse(
      JSON.stringify({
        error: "Rate limit exceeded. Please wait a few minutes before trying again.",
        limit,
        reset: new Date(reset).toISOString(),
        remaining,
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": new Date(reset).toISOString(),
        },
      }
    );
  }

  // Add rate limit headers to successful responses
  const response = NextResponse.next();
  response.headers.set("X-RateLimit-Limit", limit.toString());
  response.headers.set("X-RateLimit-Remaining", remaining.toString());
  response.headers.set("X-RateLimit-Reset", new Date(reset).toISOString());

  return response;
}

// Configure which paths the middleware should run on
export const config = {
  matcher: "/api/:path*",
};