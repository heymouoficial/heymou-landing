'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

import { initPlausible, trackPageView } from '../../lib/gtag';
import { initErrorMonitoring } from '../../lib/error-monitoring';

import WebVitals from './WebVitals';
import EventTracker from './EventTracker';
import GoogleAnalytics from './GoogleAnalytics';

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

export default function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  const pathname = usePathname();

  useEffect(() => {
    // Initialize analytics services
    if (process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN) {
      initPlausible();
    }

    // Initialize error monitoring
    initErrorMonitoring();

    // Track initial page view (GA is handled by GoogleAnalytics component)
    if (typeof window !== 'undefined') {
      trackPageView(window.location.href, document.title);
    }
  }, []);

  // Track page changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = window.location.origin + pathname;
      trackPageView(url, document.title);
    }
  }, [pathname]);

  return (
    <>
      <GoogleAnalytics />
      <WebVitals />
      <EventTracker>
        {children}
      </EventTracker>
    </>
  );
}

// Hook for accessing analytics functions in components
export function useAnalytics() {
  return {
    trackEvent: (action: string, category: string, label?: string, value?: number) => {
      if (typeof window !== 'undefined' && window.gtag) {
        const eventConfig: Record<string, string | number | boolean> = {
          event_category: category,
        };
        if (label) eventConfig.event_label = label;
        if (value !== undefined) eventConfig.value = value;
        
        window.gtag('event', action, eventConfig);
      }
    },
    trackConversion: (type: string, value?: number) => {
      if (typeof window !== 'undefined' && window.gtag) {
        const conversionConfig: Record<string, string | number | boolean> = {
          event_category: 'business',
          event_label: type,
        };
        if (value !== undefined) conversionConfig.value = value;
        
        window.gtag('event', 'conversion', conversionConfig);
      }
    },
    trackPageView: (url: string, title?: string) => {
      trackPageView(url, title);
    },
  };
}