'use client';

import { useEffect, useRef } from 'react';

import { trackEvent, trackScrollDepth, trackUserInteraction } from '../../lib/gtag';

interface EventTrackerProps {
  children: React.ReactNode;
}

export default function EventTracker({ children }: EventTrackerProps) {
  const scrollDepthRef = useRef<Set<number>>(new Set());
  const lastScrollTime = useRef<number>(0);

  useEffect(() => {
    // Track scroll depth
    const handleScroll = () => {
      const now = Date.now();
      // Throttle scroll events to every 100ms
      if (now - lastScrollTime.current < 100) return;
      lastScrollTime.current = now;

      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = Math.round((scrollTop / documentHeight) * 100);

      // Track scroll milestones
      const milestones = [25, 50, 75, 90, 100];
      milestones.forEach(milestone => {
        if (scrollPercentage >= milestone && !scrollDepthRef.current.has(milestone)) {
          scrollDepthRef.current.add(milestone);
          trackScrollDepth(milestone);
        }
      });
    };

    // Track time on page
    const startTime = Date.now();
    const trackTimeOnPage = () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      trackEvent('time_on_page', 'engagement', window.location.pathname, timeSpent);
    };

    // Track clicks on important elements
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Track button clicks
      if (target.tagName === 'BUTTON' || target.closest('button')) {
        const button = target.tagName === 'BUTTON' ? target : target.closest('button');
        const buttonText = button?.textContent?.trim() || 'Unknown Button';
        const section = button?.closest('section')?.id || 'unknown';
        trackUserInteraction(buttonText, 'click', section);
      }

      // Track link clicks
      if (target.tagName === 'A' || target.closest('a')) {
        const link = target.tagName === 'A' ? target as HTMLAnchorElement : target.closest('a');
        const href = link?.href;
        const linkText = link?.textContent?.trim() || 'Unknown Link';
        
        if (href) {
          // Check if external link
          if (href.startsWith('http') && !href.includes(window.location.hostname)) {
            trackEvent('click', 'external_link', href, undefined, {
              link_text: linkText,
            });
          } else {
            trackUserInteraction(linkText, 'internal_link_click');
          }
        }
      }

      // Track CTA clicks
      if (target.classList.contains('cta') || target.closest('.cta')) {
        const ctaElement = target.classList.contains('cta') ? target : target.closest('.cta');
        const ctaText = ctaElement?.textContent?.trim() || 'CTA';
        trackEvent('cta_click', 'conversion', ctaText);
      }
    };

    // Track form interactions
    const handleFormInteraction = (event: Event) => {
      const target = event.target as HTMLElement;
      const form = target.closest('form');
      
      if (form) {
        const formName = form.getAttribute('name') || form.id || 'unnamed_form';
        
        if (event.type === 'focus') {
          trackEvent('form_field_focus', 'engagement', `${formName}_${target.tagName.toLowerCase()}`);
        } else if (event.type === 'blur') {
          trackEvent('form_field_blur', 'engagement', `${formName}_${target.tagName.toLowerCase()}`);
        }
      }
    };

    // Add event listeners
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('beforeunload', trackTimeOnPage);
    document.addEventListener('click', handleClick);
    document.addEventListener('focus', handleFormInteraction, true);
    document.addEventListener('blur', handleFormInteraction, true);

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('beforeunload', trackTimeOnPage);
      document.removeEventListener('click', handleClick);
      document.removeEventListener('focus', handleFormInteraction, true);
      document.removeEventListener('blur', handleFormInteraction, true);
    };
  }, []);

  return <>{children}</>;
}

// Hook for manual event tracking
export function useEventTracker() {
  const trackCustomEvent = (
    action: string,
    category: string,
    label?: string,
    value?: number,
    customParameters?: Record<string, string | number | boolean>
  ) => {
    trackEvent(action, category, label, value, customParameters);
  };

  const trackInteraction = (element: string, action: string, section?: string) => {
    trackUserInteraction(element, action, section);
  };

  const trackFormEvent = (formName: string, eventType: 'start' | 'complete' | 'abandon', field?: string) => {
    const params: Record<string, string | number | boolean> = {
      form_name: formName,
    };
    
    if (field) params.field_name = field;

    trackEvent(`form_${eventType}`, 'engagement', formName, undefined, params);
  };

  return {
    trackCustomEvent,
    trackInteraction,
    trackFormEvent,
  };
}