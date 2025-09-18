'use client';

import { useEffect } from 'react';

// Extend Window interface for web-vitals initialization tracking
declare global {
  interface Window {
    __webVitalsInitialized?: boolean;
  }
}

// Web Vitals metric type
interface WebVitalsMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  id: string;
}

// Web Vitals component to track Core Web Vitals
export default function WebVitals() {
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') {
      return;
    }

    // Check if already initialized to prevent duplicate registrations during HMR
    if (window.__webVitalsInitialized) {
      return;
    }

    // Use a longer delay to ensure all modules are loaded and HMR is stable
    const timer = setTimeout(() => {
      // Dynamically import and initialize web-vitals with better error handling
      import('web-vitals').then(({ onCLS, onFCP, onLCP, onTTFB, onINP }) => {
        // Mark as initialized
        window.__webVitalsInitialized = true;

        // Safe wrapper for analytics calls
        const safeSendAnalytics = (metric: WebVitalsMetric) => {
          try {
            if (typeof window !== 'undefined' && window.gtag) {
              window.gtag('event', metric.name, {
                event_category: 'Web Vitals',
                event_label: metric.id,
                value: Math.round(metric.value),
                metric_rating: metric.rating
              });
            }
          } catch {
            // Silent fail - no logging needed for analytics errors
          }
        };

        // Register metrics with error handling
        try {
          onCLS(safeSendAnalytics);
          onFCP(safeSendAnalytics);
          onLCP(safeSendAnalytics);
          onTTFB(safeSendAnalytics);
          onINP(safeSendAnalytics);
        } catch {
          // Silent fail if registration fails
        }
      }).catch(() => {
        // Silent fail if import fails
      });
    }, 2000); // Increased delay to avoid HMR conflicts

    return () => clearTimeout(timer);
  }, []);

  // This component doesn't render anything
  return null;
}