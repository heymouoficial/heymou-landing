// Google Analytics 4 integration
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-N47CGV5F2N';

// Initialize Google Analytics (now handled by GoogleAnalytics component)
export const initGA = () => {
  if (!GA_TRACKING_ID || typeof window === 'undefined') return;

  // gtag is already loaded by the GoogleAnalytics component
  // Just ensure dataLayer exists
  window.dataLayer = window.dataLayer || [];
  
  if (!window.gtag) {
    window.gtag = function gtag(
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      config?: Record<string, string | number | boolean>
    ) {
      window.dataLayer.push([command, targetId, config]);
    };
  }
};

// Track page views
export const trackPageView = (url: string, title?: string) => {
  if (!GA_TRACKING_ID || typeof window === 'undefined' || !window.gtag) return;

  window.gtag('config', GA_TRACKING_ID, {
    page_title: title || document.title,
    page_location: url,
  });
};

// Track custom events
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number,
  customParameters?: Record<string, string | number | boolean>
) => {
  if (!GA_TRACKING_ID || typeof window === 'undefined' || !window.gtag) return;

  const params: Record<string, string | number | boolean> = {
    event_category: category,
  };
  
  if (label !== undefined) params.event_label = label;
  if (value !== undefined) params.value = value;
  if (customParameters) Object.assign(params, customParameters);

  window.gtag('event', action, params);
};

// Track form submissions
export const trackFormSubmission = (
  formName: string,
  success: boolean,
  errorMessage?: string
) => {
  const params: Record<string, string | number | boolean> = {
    form_name: formName,
  };
  
  if (errorMessage) params.error_message = errorMessage;

  trackEvent(
    success ? 'form_submit_success' : 'form_submit_error',
    'engagement',
    formName,
    success ? 1 : 0,
    params
  );
};

// Track user interactions
export const trackUserInteraction = (
  element: string,
  action: string,
  section?: string
) => {
  const params: Record<string, string | number | boolean> = {
    element_name: element,
  };
  
  if (section) params.page_section = section;

  trackEvent(action, 'user_interaction', element, undefined, params);
};

// Track conversions
export const trackConversion = (
  conversionType: 'contact_form' | 'newsletter_signup' | 'service_inquiry' | 'download' | 'phone_call',
  value?: number
) => {
  trackEvent('conversion', 'business', conversionType, value, {
    conversion_type: conversionType,
  });
};

// Track scroll depth
export const trackScrollDepth = (percentage: number) => {
  trackEvent('scroll', 'engagement', `${percentage}%`, percentage);
};

// Track file downloads
export const trackDownload = (fileName: string, fileType: string) => {
  trackEvent('file_download', 'engagement', fileName, undefined, {
    file_name: fileName,
    file_type: fileType,
  });
};

// Track external link clicks
export const trackExternalLink = (url: string, linkText?: string) => {
  const params: Record<string, string | number | boolean> = {
    link_url: url,
  };
  
  if (linkText) params.link_text = linkText;

  trackEvent('click', 'external_link', url, undefined, params);
};

// Privacy-focused alternative using Plausible Analytics
export const PLAUSIBLE_DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

export const initPlausible = () => {
  if (!PLAUSIBLE_DOMAIN || typeof window === 'undefined') return;

  const script = document.createElement('script');
  script.defer = true;
  script.src = 'https://plausible.io/js/script.js';
  script.setAttribute('data-domain', PLAUSIBLE_DOMAIN);
  document.head.appendChild(script);
};

export const trackPlausibleEvent = (
  eventName: string,
  props?: Record<string, string | number>
) => {
  if (!PLAUSIBLE_DOMAIN || typeof window === 'undefined' || !window.plausible) return;

  window.plausible(eventName, { props });
};

// Declare global types
declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      config?: Record<string, string | number | boolean>
    ) => void;
    plausible?: (eventName: string, options?: { props?: Record<string, string | number> }) => void;
  }
}