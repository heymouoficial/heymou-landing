import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';

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

export default function middleware(request: NextRequest) {
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
  // Match internationalized pathnames but exclude API routes
  matcher: [
    '/',
    '/(es|en)/:path*',
    '/((?!_next|_vercel|api|.*\\..*).*)'
  ]
};