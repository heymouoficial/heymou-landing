// BuildShip API Types and Interfaces

export interface BuildShipResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
  requestId?: string;
}

export interface BuildShipError {
  code: BuildShipErrorCode;
  message: string;
  details?: Record<string, unknown>;
  timestamp: string;
  requestId?: string;
  retryable?: boolean;
}

// Contact Form Types
export interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  projectType: 'web' | 'mobile' | 'automation' | 'consulting';
  message: string;
  budget?: string;
  timeline?: string;
  locale: 'es' | 'en';
  metadata?: {
    userAgent: string;
    referer: string;
    timestamp: string;
    ip: string;
  };
}

export interface ContactSubmissionResponse {
  id: string;
  status: 'received' | 'processing' | 'completed';
  submittedAt: string;
  estimatedResponseTime?: string;
}

// Analytics Types
export interface AnalyticsEventData {
  eventType: string;
  eventData: Record<string, unknown>;
  metadata: {
    userAgent: string;
    referer: string;
    timestamp: string;
    ip: string;
    locale: string;
  };
}

export interface AnalyticsResponse {
  eventId: string;
  processed: boolean;
  timestamp: string;
}

// Webhook Types
export interface WebhookPayload {
  type: string;
  data: Record<string, unknown>;
  metadata: {
    signature: string;
    timestamp: string;
    ip: string;
  };
}

export interface WebhookResponse {
  processed: boolean;
  type: string;
  timestamp: string;
  result?: Record<string, unknown>;
}

// Content Management Types
export interface ContentData {
  type: 'blog_post' | 'success_story' | 'service';
  slug: string;
  locale: 'es' | 'en';
  title: string;
  description: string;
  content: Record<string, unknown>;
  metadata: Record<string, unknown>;
  status: 'draft' | 'published';
}

export interface ContentResponse {
  id: string;
  slug: string;
  status: 'created' | 'updated' | 'published';
  publishedAt?: string;
  url?: string;
}

// BuildShip Client Configuration
export interface BuildShipConfig {
  baseUrl: string;
  apiKey: string;
  webhookSecret: string;
  timeout?: number;
  retryAttempts?: number;
}

// API Request Options
export interface BuildShipRequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  endpoint: string;
  data?: Record<string, unknown>;
  headers?: Record<string, string>;
  timeout?: number;
}

// Rate Limiting Types
export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
  retryAfter?: number;
}

// Error Types
export type BuildShipErrorCode = 
  | 'INVALID_REQUEST'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'RATE_LIMITED'
  | 'SERVER_ERROR'
  | 'TIMEOUT'
  | 'NETWORK_ERROR';

export interface BuildShipApiError extends Error {
  code: BuildShipErrorCode;
  status?: number;
  details?: Record<string, unknown>;
  retryable?: boolean;
}