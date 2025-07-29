import { onCLS, onINP, onFCP, onLCP, onTTFB } from 'web-vitals';

interface WebVitalMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
}

// Send metrics to analytics service
const sendToAnalytics = (metric: WebVitalMetric) => {
  // In production, send to your analytics service
  if (process.env.NODE_ENV === 'production') {
    // Example: Send to Google Analytics
    if (typeof window !== 'undefined' && 'gtag' in window) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).gtag('event', metric.name, {
        event_category: 'Web Vitals',
        event_label: metric.id,
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        non_interaction: true,
      });
    }
    
    // Example: Send to custom analytics endpoint
    fetch('/api/analytics/web-vitals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        metric: metric.name,
        value: metric.value,
        rating: metric.rating,
        page: window.location.pathname,
        timestamp: Date.now(),
      }),
    }).catch(console.error);
  } else {
    // Development: Log to console
    // eslint-disable-next-line no-console
    console.log('Web Vital:', metric);
  }
};

// Initialize web vitals monitoring
export const initPerformanceMonitoring = () => {
  onCLS(sendToAnalytics);
  onINP(sendToAnalytics); // INP replaced FID in web-vitals v3
  onFCP(sendToAnalytics);
  onLCP(sendToAnalytics);
  onTTFB(sendToAnalytics);
};

// Performance observer for custom metrics
export const observePerformance = () => {
  if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
    // Observe navigation timing
    const navObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming;
          
          // Log key navigation metrics
          // eslint-disable-next-line no-console
          console.log('Navigation Metrics:', {
            domContentLoaded: navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart,
            loadComplete: navEntry.loadEventEnd - navEntry.loadEventStart,
            firstByte: navEntry.responseStart - navEntry.requestStart,
          });
        }
      }
    });
    
    navObserver.observe({ entryTypes: ['navigation'] });
    
    // Observe resource timing
    const resourceObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'resource') {
          const resourceEntry = entry as PerformanceResourceTiming;
          
          // Log slow resources (> 1 second)
          if (resourceEntry.duration > 1000) {
            // eslint-disable-next-line no-console
            console.warn('Slow resource:', {
              name: resourceEntry.name,
              duration: resourceEntry.duration,
              size: resourceEntry.transferSize,
            });
          }
        }
      }
    });
    
    resourceObserver.observe({ entryTypes: ['resource'] });
  }
};

// Error monitoring
export const initErrorMonitoring = () => {
  if (typeof window !== 'undefined') {
    // Global error handler
    window.addEventListener('error', (event) => {
      const errorData = {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error?.stack,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      };
      
      // Send to error monitoring service
      fetch('/api/analytics/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorData),
      }).catch(console.error);
    });
    
    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      const errorData = {
        message: 'Unhandled Promise Rejection',
        reason: event.reason,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      };
      
      fetch('/api/analytics/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorData),
      }).catch(console.error);
    });
  }
};

// Initialize all monitoring
export const initMonitoring = () => {
  initPerformanceMonitoring();
  observePerformance();
  initErrorMonitoring();
};