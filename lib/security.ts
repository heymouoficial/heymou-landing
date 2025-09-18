/**
 * Security configuration and utilities
 */

// Rate limiting configuration
export const RATE_LIMITS = {
  API_REQUESTS_PER_MINUTE: 60,
  API_REQUESTS_PER_HOUR: 1000,
  CONTACT_FORM_SUBMISSIONS_PER_HOUR: 5,
} as const;

// Input validation schemas
export const SECURITY_PATTERNS = {
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  PHONE: /^\+?[\d\s\-\(\)]{10,}$/,
  NAME: /^[a-zA-ZÀ-ÿ\s\-']{2,50}$/,
  MESSAGE: /^[\w\sÀ-ÿ.,!?\-()'"@#$%&*+:;]{10,2000}$/,
} as const;

// Sanitization functions
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .slice(0, 10000); // Limit length
}

export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

export function sanitizeUrl(url: string): string {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.toString();
  } catch {
    return '';
  }
}

// Security headers configuration
export const SECURITY_HEADERS = {
  CONTENT_SECURITY_POLICY: process.env.NODE_ENV === 'production' ? [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.googletagmanager.com https://*.google-analytics.com https://unpkg.com https://va.vercel-scripts.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://*.supabase.co https://*.google-analytics.com https://*.googletagmanager.com https://api.elevenlabs.io",
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'"
  ].join('; ') : "", // Disable CSP in development

  PERMISSIONS_POLICY: 'camera=(), microphone=(), geolocation=()',
} as const;

// Environment validation
export function validateEnvironment(): void {
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  ];

  const missingVars = requiredEnvVars.filter(
    varName => !process.env[varName]
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`
    );
  }
}

// Validate environment on module import
if (typeof window === 'undefined') {
  // Only run on server side
  validateEnvironment();
}

// Request validation
export function isValidRequestOrigin(origin: string | null): boolean {
  if (!origin) return false;

  const allowedOrigins = [
    'http://localhost:3000',
    'https://heymou.com',
    'https://www.heymou.com',
  ];

  // In production, you might want to be more restrictive
  if (process.env.NODE_ENV === 'production') {
    return allowedOrigins.includes(origin);
  }

  // In development, allow localhost
  return origin.startsWith('http://localhost:') || allowedOrigins.includes(origin);
}

// Log security events (without exposing sensitive data)
export function logSecurityEvent(event: string, details: Record<string, unknown>): void {
  const sanitizedDetails = { ...details };

  // Remove sensitive information
  delete sanitizedDetails.password;
  delete sanitizedDetails.token;
  delete sanitizedDetails.apiKey;

  // eslint-disable-next-line no-console
  console.warn(`[SECURITY] ${event}:`, sanitizedDetails);
}

// Basic rate limiting (in production, use Redis or similar)
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  identifier: string,
  limit: number,
  windowMs: number
): boolean {
  const now = Date.now();
  const existing = requestCounts.get(identifier);

  if (!existing || now > existing.resetTime) {
    requestCounts.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return true;
  }

  if (existing.count >= limit) {
    return false;
  }

  existing.count++;
  return true;
}