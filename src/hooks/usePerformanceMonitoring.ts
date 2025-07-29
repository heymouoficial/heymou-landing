'use client';

import { useEffect, useCallback } from 'react';

import { trackCustomMetric, trackInteraction, trackFormSubmission, trackAPICall } from '../../lib/analytics';

// Extended PerformanceEntry interface for LCP entries
interface LargestContentfulPaintEntry extends PerformanceEntry {
  element?: Element;
}

export function usePerformanceMonitoring() {
  // Track component mount time
  const trackComponentMount = useCallback((componentName: string) => {
    const startTime = performance.now();
    
    return () => {
      const mountTime = performance.now() - startTime;
      trackCustomMetric('component_mount_time', mountTime, {
        component: componentName
      });
    };
  }, []);

  // Track user interactions
  const trackClick = useCallback((element: string, additionalData?: Record<string, unknown>) => {
    trackInteraction(element, 'click');
    
    if (additionalData) {
      trackCustomMetric('user_action', Date.now(), {
        action: 'click',
        element,
        ...additionalData
      });
    }
  }, []);

  // Track form interactions
  const trackForm = useCallback((formName: string, action: 'start' | 'submit' | 'error', duration?: number) => {
    if (action === 'submit') {
      trackFormSubmission(formName, true, duration);
    } else if (action === 'error') {
      trackFormSubmission(formName, false, duration);
    } else {
      trackCustomMetric('form_interaction', Date.now(), {
        form_name: formName,
        action
      });
    }
  }, []);

  // Track API calls
  const trackAPI = useCallback((endpoint: string) => {
    const startTime = performance.now();
    
    return (status: number) => {
      const duration = performance.now() - startTime;
      trackAPICall(endpoint, duration, status);
    };
  }, []);

  // Track resource loading performance
  const trackResourceLoad = useCallback((resourceType: string, resourceUrl: string) => {
    const startTime = performance.now();
    
    return (success: boolean) => {
      const duration = performance.now() - startTime;
      trackCustomMetric('resource_load_time', duration, {
        resource_type: resourceType,
        resource_url: resourceUrl,
        success
      });
    };
  }, []);

  // Track page visibility changes
  useEffect(() => {
    let visibilityStart = Date.now();
    
    const handleVisibilityChange = () => {
      if (document.hidden) {
        const visibleTime = Date.now() - visibilityStart;
        trackCustomMetric('page_visible_time', visibleTime, {
          url: window.location.pathname
        });
      } else {
        visibilityStart = Date.now();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      
      // Track final visible time on unmount
      if (!document.hidden) {
        const visibleTime = Date.now() - visibilityStart;
        trackCustomMetric('page_visible_time', visibleTime, {
          url: window.location.pathname
        });
      }
    };
  }, []);

  // Track scroll depth
  useEffect(() => {
    let maxScrollDepth = 0;
    const scrollDepthMarkers = [25, 50, 75, 100];
    const trackedMarkers = new Set<number>();

    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = Math.round((scrollTop / documentHeight) * 100);

      maxScrollDepth = Math.max(maxScrollDepth, scrollPercentage);

      // Track scroll depth markers
      scrollDepthMarkers.forEach(marker => {
        if (scrollPercentage >= marker && !trackedMarkers.has(marker)) {
          trackedMarkers.add(marker);
          trackCustomMetric('scroll_depth', marker, {
            url: window.location.pathname,
            marker: `${marker}%`
          });
        }
      });
    };

    const throttledScroll = throttle(handleScroll, 250);
    window.addEventListener('scroll', throttledScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', throttledScroll);
      
      // Track final scroll depth
      trackCustomMetric('max_scroll_depth', maxScrollDepth, {
        url: window.location.pathname
      });
    };
  }, []);

  // Track Core Web Vitals in real-time
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Track Largest Contentful Paint (LCP)
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      
      if (lastEntry) {
        const lcpEntry = lastEntry as LargestContentfulPaintEntry;
        trackCustomMetric('lcp_realtime', lastEntry.startTime, {
          url: window.location.pathname,
          element: lcpEntry.element?.tagName || 'unknown'
        });
      }
    });

    try {
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch {
      // LCP not supported in this browser
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return {
    trackComponentMount,
    trackClick,
    trackForm,
    trackAPI,
    trackResourceLoad,
  };
}

// Throttle utility function
function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return function (this: unknown, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}