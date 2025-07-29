import { 
  BuildShipResponse, 
  ContactFormData,
  AnalyticsEventData,
  ContentData,
  BuildShipErrorCode
} from '../../types/buildship';

/**
 * Custom error class for BuildShip API errors
 */
export class BuildShipApiError extends Error {
  public code: BuildShipErrorCode;
  public status?: number;
  public details?: Record<string, unknown>;
  public retryable?: boolean;

  constructor(
    message: string,
    code: BuildShipErrorCode,
    status?: number,
    details?: Record<string, unknown>,
    retryable?: boolean
  ) {
    super(message);
    this.name = 'BuildShipApiError';
    this.code = code;
    this.status = status;
    this.details = details;
    this.retryable = retryable;
  }
}

/**
 * Utility functions for BuildShip API interactions
 */

/**
 * Validate contact form data before submission
 */
export function validateContactFormData(data: Partial<ContactFormData>): ContactFormData {
  const errors: string[] = [];

  if (!data.name?.trim()) {
    errors.push('Name is required');
  }

  if (!data.email?.trim()) {
    errors.push('Email is required');
  } else if (!isValidEmail(data.email)) {
    errors.push('Invalid email format');
  }

  if (!data.message?.trim()) {
    errors.push('Message is required');
  }

  if (!data.locale || !['es', 'en'].includes(data.locale)) {
    errors.push('Valid locale is required');
  }

  if (!data.projectType || !['web', 'mobile', 'automation', 'consulting'].includes(data.projectType)) {
    errors.push('Valid project type is required');
  }

  if (errors.length > 0) {
    throw new BuildShipApiError(
      `Validation failed: ${errors.join(', ')}`,
      'INVALID_REQUEST',
      400,
      { validationErrors: errors },
      false
    );
  }

  return {
    name: data.name!.trim(),
    email: data.email!.trim().toLowerCase(),
    company: data.company?.trim(),
    projectType: data.projectType!,
    message: data.message!.trim(),
    budget: data.budget?.trim(),
    timeline: data.timeline?.trim(),
    locale: data.locale!,
    metadata: data.metadata,
  };
}

/**
 * Validate analytics event data
 */
export function validateAnalyticsEventData(data: Partial<AnalyticsEventData>): AnalyticsEventData {
  const errors: string[] = [];

  if (!data.eventType?.trim()) {
    errors.push('Event type is required');
  }

  if (!data.metadata?.locale || !['es', 'en'].includes(data.metadata.locale)) {
    errors.push('Valid locale is required in metadata');
  }

  if (errors.length > 0) {
    throw new BuildShipApiError(
      `Analytics validation failed: ${errors.join(', ')}`,
      'INVALID_REQUEST',
      400,
      { validationErrors: errors },
      false
    );
  }

  return {
    eventType: data.eventType!.trim(),
    eventData: data.eventData || {},
    metadata: {
      userAgent: data.metadata?.userAgent || '',
      referer: data.metadata?.referer || '',
      timestamp: new Date().toISOString(),
      ip: data.metadata?.ip || '',
      locale: data.metadata!.locale,
    },
  };
}

/**
 * Validate content data
 */
export function validateContentData(data: Partial<ContentData>): ContentData {
  const errors: string[] = [];

  if (!data.type || !['blog_post', 'success_story', 'service'].includes(data.type)) {
    errors.push('Valid content type is required');
  }

  if (!data.slug?.trim()) {
    errors.push('Slug is required');
  } else if (!isValidSlug(data.slug)) {
    errors.push('Invalid slug format');
  }

  if (!data.locale || !['es', 'en'].includes(data.locale)) {
    errors.push('Valid locale is required');
  }

  if (!data.title?.trim()) {
    errors.push('Title is required');
  }

  if (!data.status || !['draft', 'published'].includes(data.status)) {
    errors.push('Valid status is required');
  }

  if (errors.length > 0) {
    throw new BuildShipApiError(
      `Content validation failed: ${errors.join(', ')}`,
      'INVALID_REQUEST',
      400,
      { validationErrors: errors },
      false
    );
  }

  return {
    type: data.type!,
    slug: data.slug!.trim(),
    locale: data.locale!,
    title: data.title!.trim(),
    description: data.description?.trim() || '',
    content: data.content || {},
    metadata: data.metadata || {},
    status: data.status!,
  };
}

/**
 * Handle BuildShip API errors with user-friendly messages
 */
export function handleBuildShipError(error: unknown, locale: 'es' | 'en' = 'es'): string {
  if (error instanceof BuildShipApiError) {
    return getBuildShipErrorMessage(error, locale);
  }

  if (error instanceof Error) {
    return locale === 'es' 
      ? 'Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo.'
      : 'An unexpected error occurred. Please try again.';
  }

  return locale === 'es' 
    ? 'Error desconocido. Por favor, contacta al soporte.'
    : 'Unknown error. Please contact support.';
}

/**
 * Get user-friendly error messages for BuildShip errors
 */
function getBuildShipErrorMessage(error: BuildShipApiError, locale: 'es' | 'en'): string {
  const messages = {
    es: {
      INVALID_REQUEST: 'Los datos enviados no son válidos. Por favor, revisa la información.',
      UNAUTHORIZED: 'No tienes autorización para realizar esta acción.',
      FORBIDDEN: 'Esta acción no está permitida.',
      NOT_FOUND: 'El recurso solicitado no fue encontrado.',
      RATE_LIMITED: 'Has excedido el límite de solicitudes. Por favor, espera un momento.',
      SERVER_ERROR: 'Error del servidor. Por favor, inténtalo más tarde.',
      TIMEOUT: 'La solicitud tardó demasiado tiempo. Por favor, inténtalo de nuevo.',
      NETWORK_ERROR: 'Error de conexión. Verifica tu conexión a internet.',
    },
    en: {
      INVALID_REQUEST: 'The submitted data is invalid. Please check the information.',
      UNAUTHORIZED: 'You are not authorized to perform this action.',
      FORBIDDEN: 'This action is not allowed.',
      NOT_FOUND: 'The requested resource was not found.',
      RATE_LIMITED: 'You have exceeded the request limit. Please wait a moment.',
      SERVER_ERROR: 'Server error. Please try again later.',
      TIMEOUT: 'The request took too long. Please try again.',
      NETWORK_ERROR: 'Connection error. Check your internet connection.',
    },
  };

  return messages[locale][error.code] || error.message;
}

/**
 * Retry function with exponential backoff
 */
export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  maxAttempts: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;

      if (error instanceof BuildShipApiError && !error.retryable) {
        throw error;
      }

      if (attempt === maxAttempts) {
        throw lastError;
      }

      // Exponential backoff with jitter
      const delay = Math.min(baseDelay * Math.pow(2, attempt - 1), 10000);
      const jitter = Math.random() * 0.1 * delay;
      await new Promise(resolve => setTimeout(resolve, delay + jitter));
    }
  }

  throw lastError!;
}

/**
 * Create request metadata for BuildShip calls
 */
export function createRequestMetadata(request?: Request): Record<string, string> {
  const metadata: Record<string, string> = {
    timestamp: new Date().toISOString(),
    source: 'nextjs-client',
  };

  if (request) {
    metadata.userAgent = request.headers.get('user-agent') || '';
    metadata.referer = request.headers.get('referer') || '';
  }

  if (typeof window !== 'undefined') {
    metadata.userAgent = navigator.userAgent;
    metadata.referer = document.referrer;
    metadata.url = window.location.href;
  }

  return metadata;
}

/**
 * Check if BuildShip service is healthy
 */
export async function checkBuildShipHealth(): Promise<boolean> {
  try {
    const response = await fetch('/api/buildship/health', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Utility validation functions
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidSlug(slug: string): boolean {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
}

/**
 * Format BuildShip response for client consumption
 */
export function formatBuildShipResponse<T>(
  response: BuildShipResponse<T>,
  locale: 'es' | 'en' = 'es'
): { success: boolean; data?: T; error?: string } {
  if (response.success) {
    return {
      success: true,
      data: response.data,
    };
  }

  return {
    success: false,
    error: response.error || (locale === 'es' 
      ? 'Error procesando la solicitud'
      : 'Error processing request'
    ),
  };
}

/**
 * Log BuildShip API calls for debugging
 */
export function logBuildShipCall(
  endpoint: string,
  method: string,
  data?: unknown,
  response?: unknown,
  error?: unknown
): void {
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.log('BuildShip API Call:', {
      endpoint,
      method,
      timestamp: new Date().toISOString(),
      data: data ? JSON.stringify(data, null, 2) : undefined,
      response: response ? JSON.stringify(response, null, 2) : undefined,
      error: error ? String(error) : undefined,
    });
  }
}