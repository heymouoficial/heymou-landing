// Error monitoring and logging system

export interface ErrorInfo {
  message: string;
  stack?: string;
  componentStack?: string;
  errorBoundary?: string;
  url: string;
  userAgent: string;
  timestamp: number;
  userId?: string;
  sessionId: string;
  buildId?: string;
  locale?: string;
  additionalContext?: Record<string, unknown>;
}

export interface APIError {
  endpoint: string;
  method: string;
  status: number;
  statusText: string;
  responseBody?: string;
  requestBody?: string;
  duration: number;
  timestamp: number;
}

// Generate session ID
function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

// Get or create session ID
function getSessionId(): string {
  if (typeof window === 'undefined') return generateSessionId();
  
  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = generateSessionId();
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
}

// Send error to monitoring service
async function sendErrorToService(errorInfo: ErrorInfo | APIError) {
  try {
    // Send to internal API
    await fetch('/api/analytics/errors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(errorInfo),
    });

    // Send to external monitoring service (e.g., Sentry, LogRocket)
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
      // Example Sentry integration would go here
    }
  } catch {
    // Silently fail - don't create error loops
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Failed to send error to monitoring service');
    }
  }
}

// Log JavaScript errors
export function logError(
  error: Error,
  errorInfo?: { componentStack?: string; errorBoundary?: string },
  additionalContext?: Record<string, unknown>
) {
  const errorData: ErrorInfo = {
    message: error.message,
    stack: error.stack,
    componentStack: errorInfo?.componentStack,
    errorBoundary: errorInfo?.errorBoundary,
    url: typeof window !== 'undefined' ? window.location.href : '',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    timestamp: Date.now(),
    sessionId: getSessionId(),
    buildId: process.env.NEXT_PUBLIC_BUILD_ID,
    locale: typeof window !== 'undefined' ? document.documentElement.lang : undefined,
    additionalContext,
  };

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.error('🚨 Error logged:', errorData);
  }

  // Send to monitoring service
  sendErrorToService(errorData);

  // Track in analytics
  if (typeof window !== 'undefined' && window.gtag) {
    const params: Record<string, string | number | boolean> = {
      description: error.message,
      fatal: false,
    };
    
    if (errorInfo?.errorBoundary) params.error_boundary = errorInfo.errorBoundary;
    if (errorInfo?.componentStack) params.component_stack = errorInfo.componentStack;

    window.gtag('event', 'exception', params);
  }
}

// Log API errors
export function logAPIError(
  endpoint: string,
  method: string,
  response: Response,
  requestBody?: string,
  duration?: number
) {
  const apiError: APIError = {
    endpoint,
    method,
    status: response.status,
    statusText: response.statusText,
    requestBody,
    duration: duration || 0,
    timestamp: Date.now(),
  };

  // Try to get response body
  response.clone().text().then(responseBody => {
    apiError.responseBody = responseBody;
    sendErrorToService(apiError);
  }).catch(() => {
    // If we can't read the response, send without it
    sendErrorToService(apiError);
  });

  // Track in analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'api_error', {
      event_category: 'api',
      event_label: endpoint,
      value: response.status,
      method,
      status: response.status,
      endpoint,
    });
  }
}

// Initialize error monitoring
export function initErrorMonitoring() {
  if (typeof window === 'undefined') return;

  // Global error handler
  window.addEventListener('error', (event) => {
    logError(new Error(event.message), undefined, {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    });
  });

  // Unhandled promise rejection handler
  window.addEventListener('unhandledrejection', (event) => {
    logError(
      new Error(`Unhandled Promise Rejection: ${event.reason}`),
      undefined,
      {
        type: 'unhandled_promise_rejection',
        reason: event.reason,
      }
    );
  });

  // Resource loading errors
  window.addEventListener('error', (event) => {
    if (event.target && event.target !== window) {
      const target = event.target as HTMLElement & { src?: string; href?: string };
      logError(
        new Error(`Resource loading error: ${target.src || target.href || 'unknown'}`),
        undefined,
        {
          type: 'resource_error',
          resource: target.src || target.href,
          tagName: target.tagName,
        }
      );
    }
  }, true);

  // Network errors (fetch failures)
  const originalFetch = window.fetch;
  window.fetch = async (...args) => {
    const startTime = Date.now();
    try {
      const response = await originalFetch(...args);
      const duration = Date.now() - startTime;
      
      // Log API errors (4xx, 5xx)
      if (!response.ok) {
        const url = typeof args[0] === 'string' ? args[0] : (args[0] as Request).url;
        const method = typeof args[1] === 'object' && args[1]?.method ? args[1].method : 'GET';
        const requestBody = typeof args[1] === 'object' && args[1]?.body ? String(args[1].body) : undefined;
        
        logAPIError(url, method, response, requestBody, duration);
      }
      
      return response;
    } catch (error) {
      const duration = Date.now() - startTime;
      const url = typeof args[0] === 'string' ? args[0] : (args[0] as Request).url;
      const method = typeof args[1] === 'object' && args[1]?.method ? args[1].method : 'GET';
      
      logError(
        error instanceof Error ? error : new Error('Fetch error'),
        undefined,
        {
          type: 'fetch_error',
          url,
          method,
          duration,
        }
      );
      
      throw error;
    }
  };
}

// Performance monitoring for errors
export function trackPerformanceError(metricName: string, value: number, threshold: number) {
  if (value > threshold) {
    logError(
      new Error(`Performance threshold exceeded: ${metricName}`),
      undefined,
      {
        type: 'performance_error',
        metric_name: metricName,
        value,
        threshold,
      }
    );
  }
}

// Custom error boundary hook
export function useErrorHandler() {
  return (error: Error, errorInfo?: { componentStack?: string }) => {
    logError(error, errorInfo, {
      type: 'react_error_boundary',
    });
  };
}

// Utility to wrap async functions with error handling
export function withErrorHandling<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  context?: string
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      logError(
        error instanceof Error ? error : new Error('Unknown error'),
        undefined,
        {
          type: 'wrapped_function_error',
          context,
          arguments: args,
        }
      );
      throw error;
    }
  }) as T;
}

// Rate limiting for error reporting
class ErrorRateLimiter {
  private errorCounts: Map<string, { count: number; lastReset: number }> = new Map();
  private readonly maxErrorsPerMinute = 10;
  private readonly resetInterval = 60000; // 1 minute

  shouldReportError(errorKey: string): boolean {
    const now = Date.now();
    const errorData = this.errorCounts.get(errorKey);

    if (!errorData) {
      this.errorCounts.set(errorKey, { count: 1, lastReset: now });
      return true;
    }

    // Reset count if interval has passed
    if (now - errorData.lastReset > this.resetInterval) {
      this.errorCounts.set(errorKey, { count: 1, lastReset: now });
      return true;
    }

    // Check if under limit
    if (errorData.count < this.maxErrorsPerMinute) {
      errorData.count++;
      return true;
    }

    return false;
  }
}

export const errorRateLimiter = new ErrorRateLimiter();