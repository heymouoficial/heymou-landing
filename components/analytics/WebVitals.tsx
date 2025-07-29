'use client';

import { useEffect } from 'react';

import { sendToAnalytics, initPerformanceMonitoring } from '../../lib/analytics';

// Web Vitals component to track Core Web Vitals
export default function WebVitals() {
  useEffect(() => {
    // Initialize performance monitoring
    initPerformanceMonitoring();

    // Dynamically import web-vitals to avoid SSR issues
    import('web-vitals').then(({ onCLS, onFCP, onLCP, onTTFB, onINP }) => {
      // Track Core Web Vitals with proper typing
      onCLS((metric) => {
        sendToAnalytics({
          name: 'CLS',
          value: metric.value,
          rating: metric.rating,
          delta: metric.delta,
          id: metric.id,
          navigationType: metric.navigationType
        });
      });

      onFCP((metric) => {
        sendToAnalytics({
          name: 'FCP',
          value: metric.value,
          rating: metric.rating,
          delta: metric.delta,
          id: metric.id,
          navigationType: metric.navigationType
        });
      });

      onLCP((metric) => {
        sendToAnalytics({
          name: 'LCP',
          value: metric.value,
          rating: metric.rating,
          delta: metric.delta,
          id: metric.id,
          navigationType: metric.navigationType
        });
      });

      onTTFB((metric) => {
        sendToAnalytics({
          name: 'TTFB',
          value: metric.value,
          rating: metric.rating,
          delta: metric.delta,
          id: metric.id,
          navigationType: metric.navigationType
        });
      });

      // INP (Interaction to Next Paint) - newer metric replacing FID
      onINP((metric) => {
        sendToAnalytics({
          name: 'INP',
          value: metric.value,
          rating: metric.rating,
          delta: metric.delta,
          id: metric.id,
          navigationType: metric.navigationType
        });
      });
    }).catch((error) => {
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.warn('Failed to load web-vitals:', error);
      }
    });
  }, []);

  // This component doesn't render anything
  return null;
}