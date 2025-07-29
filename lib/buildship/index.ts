import {
  BuildShipResponse,
  BuildShipError,
  BuildShipConfig,
  BuildShipRequestOptions,
  BuildShipErrorCode,
  ContactFormData,
  ContactSubmissionResponse,
  AnalyticsEventData,
  AnalyticsResponse,
  ContentData,
  ContentResponse,
  RateLimitInfo,
} from '../../types/buildship';

import { BuildShipApiError } from './utils';

/**
 * BuildShip Client for secure API communication
 * All requests go through Next.js API routes as proxy to BuildShip workflows
 */
export class BuildShipClient {
  private config: BuildShipConfig;
  private rateLimitInfo: RateLimitInfo | null = null;

  constructor(config: BuildShipConfig) {
    this.config = {
      timeout: 30000,
      retryAttempts: 3,
      ...config,
    };
  }

  /**
   * Make a request to BuildShip via Next.js API proxy
   */
  private async makeRequest<T>(
    options: BuildShipRequestOptions
  ): Promise<BuildShipResponse<T>> {
    const { method, endpoint, data, headers = {}, timeout = this.config.timeout } = options;

    // All requests go through our API proxy routes
    const proxyUrl = `/api/buildship${endpoint}`;

    const requestHeaders: HeadersInit = {
      'Content-Type': 'application/json',
      'X-BuildShip-Client': 'next-proxy',
      ...headers,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(proxyUrl, {
        method,
        headers: requestHeaders,
        body: data ? JSON.stringify(data) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Update rate limit info from response headers
      this.updateRateLimitInfo(response);

      if (!response.ok) {
        throw await this.handleErrorResponse(response);
      }

      const result: BuildShipResponse<T> = await response.json();
      return result;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof BuildShipApiError) {
        throw error;
      }

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new BuildShipApiError('Request timeout', 'TIMEOUT', 408, {}, true);
        }
        throw new BuildShipApiError(error.message, 'NETWORK_ERROR', 0, {}, true);
      }

      throw new BuildShipApiError('Unknown error occurred', 'SERVER_ERROR', 500, {}, false);
    }
  }

  /**
   * Handle error responses from the API
   */
  private async handleErrorResponse(response: Response): Promise<BuildShipApiError> {
    let errorData: BuildShipError;

    try {
      errorData = await response.json();
    } catch {
      errorData = {
        code: this.getErrorCodeFromStatus(response.status),
        message: response.statusText || 'Unknown error',
        timestamp: new Date().toISOString(),
      };
    }

    const isRetryable = this.isRetryableError(response.status, errorData.code);

    return new BuildShipApiError(
      errorData.message,
      errorData.code,
      response.status,
      errorData.details,
      isRetryable
    );
  }

  /**
   * Update rate limit information from response headers
   */
  private updateRateLimitInfo(response: Response): void {
    const limit = response.headers.get('X-RateLimit-Limit');
    const remaining = response.headers.get('X-RateLimit-Remaining');
    const reset = response.headers.get('X-RateLimit-Reset');
    const retryAfter = response.headers.get('Retry-After');

    if (limit && remaining && reset) {
      this.rateLimitInfo = {
        limit: parseInt(limit, 10),
        remaining: parseInt(remaining, 10),
        reset: parseInt(reset, 10),
        retryAfter: retryAfter ? parseInt(retryAfter, 10) : undefined,
      };
    }
  }

  /**
   * Get error code from HTTP status
   */
  private getErrorCodeFromStatus(status: number): BuildShipErrorCode {
    switch (status) {
      case 400:
        return 'INVALID_REQUEST';
      case 401:
        return 'UNAUTHORIZED';
      case 403:
        return 'FORBIDDEN';
      case 404:
        return 'NOT_FOUND';
      case 429:
        return 'RATE_LIMITED';
      case 500:
      case 502:
      case 503:
      case 504:
        return 'SERVER_ERROR';
      default:
        return 'SERVER_ERROR';
    }
  }

  /**
   * Check if error is retryable
   */
  private isRetryableError(status: number, code: BuildShipErrorCode): boolean {
    const retryableCodes: BuildShipErrorCode[] = ['TIMEOUT', 'NETWORK_ERROR', 'SERVER_ERROR'];
    const retryableStatuses = [429, 500, 502, 503, 504];

    return retryableCodes.includes(code) || retryableStatuses.includes(status);
  }

  /**
   * Retry logic for failed requests
   */
  private async withRetry<T>(
    operation: () => Promise<BuildShipResponse<T>>,
    maxAttempts: number = this.config.retryAttempts || 3
  ): Promise<BuildShipResponse<T>> {
    let lastError: BuildShipApiError;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as BuildShipApiError;

        if (!lastError.retryable || attempt === maxAttempts) {
          throw lastError;
        }

        // Exponential backoff
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError!;
  }

  /**
   * Submit contact form data
   */
  async submitContactForm(data: ContactFormData): Promise<ContactSubmissionResponse> {
    const response = await this.withRetry(() =>
      this.makeRequest<ContactSubmissionResponse>({
        method: 'POST',
        endpoint: '/contact',
        data: data as unknown as Record<string, unknown>,
      })
    );

    if (!response.success || !response.data) {
      throw new BuildShipApiError(
        response.error || 'Failed to submit contact form',
        'SERVER_ERROR',
        500,
        {},
        false
      );
    }

    return response.data;
  }

  /**
   * Track analytics event
   */
  async trackEvent(eventData: AnalyticsEventData): Promise<AnalyticsResponse> {
    const response = await this.withRetry(() =>
      this.makeRequest<AnalyticsResponse>({
        method: 'POST',
        endpoint: '/analytics',
        data: eventData as unknown as Record<string, unknown>,
      })
    );

    if (!response.success || !response.data) {
      throw new BuildShipApiError(
        response.error || 'Failed to track analytics event',
        'SERVER_ERROR',
        500,
        {},
        false
      );
    }

    return response.data;
  }

  /**
   * Create or update content
   */
  async manageContent(contentData: ContentData): Promise<ContentResponse> {
    const response = await this.withRetry(() =>
      this.makeRequest<ContentResponse>({
        method: 'POST',
        endpoint: '/content',
        data: contentData as unknown as Record<string, unknown>,
      })
    );

    if (!response.success || !response.data) {
      throw new BuildShipApiError(
        response.error || 'Failed to manage content',
        'SERVER_ERROR',
        500,
        {},
        false
      );
    }

    return response.data;
  }

  /**
   * Send message to chatbot
   */
  async sendChatMessage(message: string, origen: string = 'website'): Promise<{ response: string; success: boolean; timestamp: string }> {
    const response = await this.withRetry(() =>
      this.makeRequest<{ response: string; success: boolean; timestamp: string }>({
        method: 'POST',
        endpoint: '/chatbot',
        data: { message, origen } as Record<string, unknown>,
      })
    );

    if (!response.success || !response.data) {
      throw new BuildShipApiError(
        response.error || 'Failed to send chat message',
        'SERVER_ERROR',
        500,
        {},
        false
      );
    }

    return response.data;
  }

  /**
   * Get current rate limit information
   */
  getRateLimitInfo(): RateLimitInfo | null {
    return this.rateLimitInfo;
  }

  /**
   * Check if client is rate limited
   */
  isRateLimited(): boolean {
    if (!this.rateLimitInfo) return false;
    return this.rateLimitInfo.remaining <= 0 && Date.now() < this.rateLimitInfo.reset;
  }
}



/**
 * Create BuildShip client instance
 */
function createBuildShipClient(): BuildShipClient {
  const config: BuildShipConfig = {
    baseUrl: process.env.NEXT_PUBLIC_BUILDSHIP_API_URL || 'https://api.buildship.app',
    apiKey: process.env.BUILDSHIP_API_KEY || '',
    webhookSecret: process.env.BUILDSHIP_WEBHOOK_SECRET || '',
    timeout: 30000,
    retryAttempts: 3,
  };

  return new BuildShipClient(config);
}

// Export singleton instance
export const buildShipClient = createBuildShipClient();

// Export utility functions
export { createBuildShipClient };

// Export utility functions and classes
export {
  BuildShipApiError,
  validateContactFormData,
  validateAnalyticsEventData,
  validateContentData,
  handleBuildShipError,
  retryWithBackoff,
  createRequestMetadata,
  checkBuildShipHealth,
  formatBuildShipResponse,
  logBuildShipCall,
} from './utils';

// Re-export types for convenience
export type {
  BuildShipResponse,
  BuildShipError,
  BuildShipConfig,
  ContactFormData,
  ContactSubmissionResponse,
  AnalyticsEventData,
  AnalyticsResponse,
  ContentData,
  ContentResponse,
};
