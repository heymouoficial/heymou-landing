import { NextResponse } from 'next/server';
import { z } from 'zod';

import { getAllPosts } from '../../../../lib/blog';
import {
  checkRateLimit,
  logSecurityEvent,
  RATE_LIMITS
} from '../../../../lib/security';

// Input validation schema
const blogQuerySchema = z.object({
  locale: z.enum(['es', 'en']).optional().default('es'),
});

export async function GET(request: Request) {
  try {
    // Temporarily disable origin validation for debugging
    // const origin = request.headers.get('origin');
    // if (!isValidRequestOrigin(origin)) {
    //   logSecurityEvent('Invalid origin', { origin, url: request.url });
    //   return NextResponse.json(
    //     { error: 'Forbidden' },
    //     { status: 403 }
    //   );
    // }

    const { searchParams } = new URL(request.url);

    // Validate and sanitize input
    const validationResult = blogQuerySchema.safeParse({
      locale: searchParams.get('locale'),
    });

    if (!validationResult.success) {
      logSecurityEvent('Invalid query parameters', {
        issues: validationResult.error.issues,
        url: request.url
      });
      return NextResponse.json(
        { error: 'Invalid query parameters' },
        { status: 400 }
      );
    }

    const { locale } = validationResult.data;

    // Rate limiting check
    const clientIP = request.headers.get('x-forwarded-for') ||
                    request.headers.get('x-real-ip') ||
                    'unknown';

    if (!checkRateLimit(
      `blog-api-${clientIP}`,
      RATE_LIMITS.API_REQUESTS_PER_MINUTE,
      60 * 1000 // 1 minute
    )) {
      logSecurityEvent('Rate limit exceeded', { clientIP, endpoint: 'blog' });
      return NextResponse.json(
        { error: 'Too many requests' },
        {
          status: 429,
          headers: {
            'Retry-After': '60',
          },
        }
      );
    }

    const posts = getAllPosts(locale);

    return NextResponse.json({
      posts,
      meta: {
        locale,
        count: posts.length,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    // Log error securely (don't expose internal details)
    logSecurityEvent('Blog API error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      url: request.url
    });

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}