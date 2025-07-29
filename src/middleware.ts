import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

import { locales } from './i18n';

const intlMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale: 'es',

  // Always use locale prefix for cleaner URLs
  localePrefix: 'always',

  // Detect locale from Accept-Language header
  localeDetection: true,
});

// In-memory rate limiting store (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// BuildShip API security middleware
function handleBuildShipAPI(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Only apply to BuildShip API routes
  if (!pathname.startsWith('/api/buildship/')) {
    return null;
  }

  // Get client identifier
  const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  const userAgent = request.headers.get('user-agent') || '';
  const clientId = `${clientIP}_${userAgent.slice(0, 50)}`;

  // Rate limiting configuration
  const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
  const RATE_LIMIT_MAX_REQUESTS = 30; // 30 requests per minute
  const now = Date.now();

  // Clean up expired entries
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  }

  // Check rate limit
  const rateLimitKey = `buildship_${clientId}`;
  const currentLimit = rateLimitStore.get(rateLimitKey);

  if (currentLimit) {
    if (now < currentLimit.resetTime) {
      if (currentLimit.count >= RATE_LIMIT_MAX_REQUESTS) {
        return NextResponse.json(
          { 
            error: 'Rate limit exceeded',
            retryAfter: Math.ceil((currentLimit.resetTime - now) / 1000)
          },
          { 
            status: 429,
            headers: {
              'X-RateLimit-Limit': String(RATE_LIMIT_MAX_REQUESTS),
              'X-RateLimit-Remaining': '0',
              'X-RateLimit-Reset': String(currentLimit.resetTime),
              'Retry-After': String(Math.ceil((currentLimit.resetTime - now) / 1000)),
            }
          }
        );
      }
      currentLimit.count++;
    } else {
      // Reset window
      rateLimitStore.set(rateLimitKey, {
        count: 1,
        resetTime: now + RATE_LIMIT_WINDOW,
      });
    }
  } else {
    // First request
    rateLimitStore.set(rateLimitKey, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
  }

  // Verify BuildShip webhook signature for incoming webhooks
  if (request.method === 'POST' && pathname.includes('/webhook/')) {
    const signature = request.headers.get('x-buildship-signature');
    const timestamp = request.headers.get('x-buildship-timestamp');
    const webhookSecret = process.env.BUILDSHIP_WEBHOOK_SECRET;
    
    if (!signature || !timestamp || !webhookSecret) {
      return NextResponse.json(
        { error: 'Unauthorized: Missing required webhook headers' },
        { status: 401 }
      );
    }

    // Verify timestamp (prevent replay attacks)
    const webhookTimestamp = parseInt(timestamp, 10);
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const timeDifference = Math.abs(currentTimestamp - webhookTimestamp);

    // Allow 5 minutes tolerance
    if (timeDifference > 300) {
      return NextResponse.json(
        { error: 'Webhook timestamp too old' },
        { status: 401 }
      );
    }
  }

  // Security headers for BuildShip API routes
  const response = NextResponse.next();
  const currentRateLimit = rateLimitStore.get(rateLimitKey);
  
  if (currentRateLimit) {
    response.headers.set('X-RateLimit-Limit', String(RATE_LIMIT_MAX_REQUESTS));
    response.headers.set('X-RateLimit-Remaining', String(Math.max(0, RATE_LIMIT_MAX_REQUESTS - currentRateLimit.count)));
    response.headers.set('X-RateLimit-Reset', String(currentRateLimit.resetTime));
  }

  // Additional security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  return response;
}

export default function middleware(request: NextRequest) {
  // Handle BuildShip API security first
  const buildShipResponse = handleBuildShipAPI(request);
  if (buildShipResponse) {
    return buildShipResponse;
  }

  // Handle internationalization for non-API routes
  const response = intlMiddleware(request);
  
  // Add security headers
  if (response) {
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  }
  
  return response;
}

export const config = {
  // Match internationalized pathnames and BuildShip API routes
  matcher: [
    '/',
    '/(es|en)/:path*',
    '/api/buildship/:path*',
    '/((?!_next|_vercel|.*\\..*).*)'
  ]
};