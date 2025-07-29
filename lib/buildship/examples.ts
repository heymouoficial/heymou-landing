/**
 * BuildShip Client Usage Examples
 * This file demonstrates how to use the BuildShip client in different scenarios
 */

import type { ContactFormData, AnalyticsEventData } from '../../types/buildship';

import { 
  buildShipClient, 
  handleBuildShipError,
  validateContactFormData,
  validateAnalyticsEventData,
  createRequestMetadata,
  checkBuildShipHealth,
  BuildShipApiError 
} from './index';

/**
 * Example: Submit contact form with error handling
 */
export async function submitContactFormExample(
  formData: Partial<ContactFormData>,
  locale: 'es' | 'en' = 'es'
): Promise<{ success: boolean; message: string; data?: unknown }> {
  try {
    // Validate form data
    const validatedData = validateContactFormData(formData);

    // Submit to BuildShip
    const result = await buildShipClient.submitContactForm(validatedData);

    return {
      success: true,
      message: locale === 'es' 
        ? 'Formulario enviado exitosamente. Te contactaremos pronto.'
        : 'Form submitted successfully. We will contact you soon.',
      data: result,
    };

  } catch (error) {
    const errorMessage = handleBuildShipError(error, locale);
    
    return {
      success: false,
      message: errorMessage,
    };
  }
}

/**
 * Example: Track analytics event with retry logic
 */
export async function trackAnalyticsEventExample(
  eventType: string,
  eventData: Record<string, unknown>,
  locale: 'es' | 'en' = 'es'
): Promise<{ success: boolean; eventId?: string }> {
  try {
    // Create analytics event data
    const analyticsData: Partial<AnalyticsEventData> = {
      eventType,
      eventData,
      metadata: {
        userAgent: '',
        referer: '',
        timestamp: new Date().toISOString(),
        ip: '',
        locale,
        ...createRequestMetadata(),
      },
    };

    // Validate and submit
    const validatedData = validateAnalyticsEventData(analyticsData);
    const result = await buildShipClient.trackEvent(validatedData);

    return {
      success: true,
      eventId: result.eventId,
    };

  } catch (error) {
    // For analytics, we typically don't want to fail the user experience
    // eslint-disable-next-line no-console
    console.error('Analytics tracking failed:', error);
    
    return {
      success: false,
    };
  }
}

/**
 * Example: Handle rate limiting gracefully
 */
export async function submitWithRateLimitHandling<T>(
  operation: () => Promise<T>,
  locale: 'es' | 'en' = 'es'
): Promise<{ success: boolean; data?: T; message?: string; retryAfter?: number }> {
  try {
    const data = await operation();
    
    return {
      success: true,
      data,
    };

  } catch (error) {
    if (error instanceof BuildShipApiError && error.code === 'RATE_LIMITED') {
      const retryAfter = error.details?.retryAfter as number || 60;
      
      return {
        success: false,
        message: locale === 'es'
          ? `Has excedido el límite de solicitudes. Inténtalo de nuevo en ${retryAfter} segundos.`
          : `You have exceeded the request limit. Try again in ${retryAfter} seconds.`,
        retryAfter,
      };
    }

    return {
      success: false,
      message: handleBuildShipError(error, locale),
    };
  }
}

/**
 * Example: Batch analytics events
 */
export async function batchAnalyticsEvents(
  events: Array<{ type: string; data: Record<string, unknown> }>,
  locale: 'es' | 'en' = 'es'
): Promise<{ success: boolean; processed: number; failed: number }> {
  let processed = 0;
  let failed = 0;

  // Process events in parallel with concurrency limit
  const concurrencyLimit = 5;
  const chunks = [];
  
  for (let i = 0; i < events.length; i += concurrencyLimit) {
    chunks.push(events.slice(i, i + concurrencyLimit));
  }

  for (const chunk of chunks) {
    const promises = chunk.map(async (event) => {
      try {
        await trackAnalyticsEventExample(event.type, event.data, locale);
        processed++;
      } catch {
        failed++;
      }
    });

    await Promise.all(promises);
  }

  return {
    success: failed === 0,
    processed,
    failed,
  };
}

/**
 * Example: Check BuildShip service health before operations
 */
export async function performOperationWithHealthCheck<T>(
  operation: () => Promise<T>,
  fallback?: () => T
): Promise<T> {
  try {
    // Check if BuildShip is healthy
    const isHealthy = await checkBuildShipHealth() || true;
    
    if (!isHealthy && fallback) {
      // eslint-disable-next-line no-console
      console.warn('BuildShip service unhealthy, using fallback');
      return fallback();
    }

    return await operation();

  } catch (error) {
    if (fallback) {
      // eslint-disable-next-line no-console
      console.error('Operation failed, using fallback:', error);
      return fallback();
    }
    
    throw error;
  }
}

/**
 * Example: Form submission with comprehensive error handling
 */
export async function handleContactFormSubmission(
  formElement: HTMLFormElement,
  locale: 'es' | 'en' = 'es'
): Promise<{ success: boolean; message: string }> {
  try {
    // Extract form data
    const formData = new FormData(formElement);
    const contactData: Partial<ContactFormData> = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      company: formData.get('company') as string || undefined,
      projectType: formData.get('projectType') as ContactFormData['projectType'],
      message: formData.get('message') as string,
      budget: formData.get('budget') as string || undefined,
      timeline: formData.get('timeline') as string || undefined,
      locale,
      metadata: {
        userAgent: navigator.userAgent,
        referer: document.referrer,
        timestamp: new Date().toISOString(),
        ip: '', // Will be set by server
      },
    };

    // Submit with rate limit handling
    const result = await submitWithRateLimitHandling(
      () => submitContactFormExample(contactData, locale),
      locale
    );

    return {
      success: result.success,
      message: result.message || (result.success 
        ? (locale === 'es' ? 'Enviado exitosamente' : 'Sent successfully')
        : (locale === 'es' ? 'Error al enviar' : 'Error sending')
      ),
    };

  } catch (error) {
    return {
      success: false,
      message: handleBuildShipError(error, locale),
    };
  }
}

/**
 * Example: Track page view with additional context
 */
export async function trackPageView(
  path: string,
  title: string,
  locale: 'es' | 'en' = 'es',
  additionalData?: Record<string, unknown>
): Promise<void> {
  await trackAnalyticsEventExample(
    'page_view',
    {
      path,
      title,
      timestamp: new Date().toISOString(),
      ...additionalData,
    },
    locale
  );
}

/**
 * Example: Track user interaction events
 */
export async function trackUserInteraction(
  action: string,
  element: string,
  value?: string | number,
  locale: 'es' | 'en' = 'es'
): Promise<void> {
  await trackAnalyticsEventExample(
    'user_interaction',
    {
      action,
      element,
      value,
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : '',
    },
    locale
  );
}

/**
 * Example: Error tracking
 */
export async function trackError(
  error: Error,
  context?: Record<string, unknown>,
  locale: 'es' | 'en' = 'es'
): Promise<void> {
  await trackAnalyticsEventExample(
    'error_occurred',
    {
      message: error.message,
      stack: error.stack,
      name: error.name,
      context,
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : '',
    },
    locale
  );
}

/**
 * Example: Send chatbot message
 */
export async function sendChatbotMessage(
  message: string,
  locale: 'es' | 'en' = 'es'
): Promise<{ success: boolean; response?: string; error?: string }> {
  try {
    const result = await buildShipClient.sendChatMessage(message, 'website');
    
    return {
      success: true,
      response: result.response,
    };

  } catch (error) {
    const errorMessage = handleBuildShipError(error, locale);
    
    return {
      success: false,
      error: errorMessage,
    };
  }
}