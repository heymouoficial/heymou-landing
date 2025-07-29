// Analytics and performance monitoring utilities
import { PERFORMANCE_CONFIG, getMetricRating, shouldSampleMetric } from './performance-config';
import { trackEvent as gtagTrackEvent } from './gtag';

// Network Information API interface
interface NetworkInformation {
  effectiveType: '2g' | '3g' | '4g' | 'slow-2g';
  downlink: number;
  rtt: number;
  saveData: boolean;
}

// Extended Navigator interface
interface NavigatorWithConnection extends Navigator {
  connection?: NetworkInformation;
}

// Extended HTMLElement interface for error tracking
interface HTMLElementWithSrc extends HTMLElement {
  src?: string;
  href?: string;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta?: number;
  id: string;
  navigationType?: string;
}

export interface WebVitalsMetric {
  name: 'CLS' | 'FCP' | 'LCP' | 'TTFB' | 'INP';
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta?: number;
  id: string;
  navigationType?: string;
}

// Get rating based on metric value and thresholds
export function getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  return getMetricRating(name, value);
}

// Send metric to analytics service
export function sendToAnalytics(metric: PerformanceMetric) {
  // In production, you would send this to your analytics service
  // For now, we'll log to console in development
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.log('📊 Performance Metric:', {
      name: metric.name,
      value: Math.round(metric.value),
      rating: metric.rating,
      id: metric.id
    });
  }

  // Example: Send to Google Analytics 4
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.value),
      metric_rating: metric.rating
    });
  }

  // Send to custom analytics endpoint
  if (process.env.NODE_ENV === 'production') {
    const endpoint = PERFORMANCE_CONFIG.endpoints.webVitals;
    fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: metric.name,
        value: metric.value,
        rating: metric.rating,
        id: metric.id,
        url: window.location.href,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        connection: (() => {
          const navigatorWithConnection = navigator as NavigatorWithConnection;
          const connection = navigatorWithConnection.connection;
          return connection ? {
            effectiveType: connection.effectiveType,
            downlink: connection.downlink
          } : null;
        })()
      })
    }).catch((error) => {
      // eslint-disable-next-line no-console
      console.error('Analytics error:', error);
    });
  }
}

// Track custom performance metrics
export function trackCustomMetric(name: string, value: number, additionalData?: Record<string, unknown>) {
  // Check if we should sample this metric
  if (!shouldSampleMetric('customMetrics')) {
    return;
  }

  const metric: PerformanceMetric = {
    name,
    value,
    rating: getRating(name, value),
    id: generateId(),
    ...additionalData
  };

  sendToAnalytics(metric);
}

// Generate unique ID for metrics
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

// Track page load performance
export function trackPageLoad() {
  if (typeof window === 'undefined') return;

  // Track page load time
  window.addEventListener('load', () => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    if (navigation) {
      const pageLoadTime = navigation.loadEventEnd - navigation.fetchStart;
      trackCustomMetric('page_load_time', pageLoadTime);
      
      const domContentLoaded = navigation.domContentLoadedEventEnd - navigation.fetchStart;
      trackCustomMetric('dom_content_loaded', domContentLoaded);
      
      const timeToFirstByte = navigation.responseStart - navigation.fetchStart;
      trackCustomMetric('time_to_first_byte', timeToFirstByte);
    }
  });
}

// Track user interactions
export function trackInteraction(element: string, action: string) {
  trackCustomMetric('user_interaction', Date.now(), {
    element,
    action,
    url: window.location.pathname
  });
  
  // Also track in Google Analytics
  gtagTrackEvent(action, 'user_interaction', element);
}

// Track form submissions
export function trackFormSubmission(formName: string, success: boolean, duration?: number) {
  trackCustomMetric('form_submission', duration || 0, {
    form_name: formName,
    success,
    url: window.location.pathname
  });
  
  // Also track in Google Analytics
  gtagTrackEvent(
    success ? 'form_submit_success' : 'form_submit_error',
    'engagement',
    formName,
    duration
  );
}

// Track API call performance
export function trackAPICall(endpoint: string, duration: number, status: number) {
  trackCustomMetric('api_call', duration, {
    endpoint,
    status,
    success: status >= 200 && status < 300
  });
}

// Initialize performance monitoring
export function initPerformanceMonitoring() {
  if (typeof window === 'undefined') return;

  // Track page loads
  trackPageLoad();

  // Track resource loading errors
  window.addEventListener('error', (event) => {
    if (event.target && event.target !== window) {
      const target = event.target as HTMLElementWithSrc;
      trackCustomMetric('resource_error', 1, {
        resource: target.src || target.href || 'unknown',
        message: event.message
      });
    }
  });

  // Track unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    trackCustomMetric('unhandled_rejection', 1, {
      reason: event.reason?.toString() || 'Unknown error'
    });
  });
}

// Declare gtag for TypeScript
declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      config?: Record<string, string | number | boolean>
    ) => void;
  }
}