// Conversion tracking utilities
import { trackEvent, trackConversion, trackFormSubmission } from './gtag';

export interface ConversionData {
  type: 'contact_form' | 'newsletter_signup' | 'service_inquiry' | 'download' | 'phone_call';
  value?: number;
  currency?: string;
  formName?: string;
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
  additionalData?: Record<string, string | number | boolean>;
}

export interface FormConversionData extends ConversionData {
  formName: string;
  formFields: Record<string, string | number | boolean>;
  completionTime: number;
  validationErrors?: string[];
  abandonedAt?: string;
}

// Track form conversion
export function trackFormConversion(data: FormConversionData) {
  const { type, formName, formFields, completionTime, value, additionalData } = data;

  // Track in Google Analytics
  trackFormSubmission(formName, true);
  trackConversion(type, value);

  // Track detailed form analytics
  trackEvent('form_conversion', 'conversion', formName, value, {
    form_name: formName,
    completion_time: completionTime,
    field_count: Object.keys(formFields).length,
    ...additionalData,
  });

  // Track specific form fields for optimization
  Object.entries(formFields).forEach(([fieldName, fieldValue]) => {
    if (fieldValue && typeof fieldValue === 'string' && fieldValue.length > 0) {
      trackEvent('form_field_completed', 'engagement', `${formName}_${fieldName}`);
    }
  });

  // Send conversion data to internal API
  sendConversionToAPI({
    ...data,
    timestamp: Date.now(),
    url: typeof window !== 'undefined' ? window.location.href : '',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    sessionId: getSessionId(),
  });
}

// Track form abandonment
export function trackFormAbandonment(
  formName: string,
  abandonedAt: string,
  completedFields: string[],
  timeSpent: number
) {
  trackEvent('form_abandon', 'engagement', formName, timeSpent, {
    form_name: formName,
    abandoned_at: abandonedAt,
    completed_fields: completedFields.join(','),
    completion_rate: (completedFields.length / getTotalFormFields(formName)) * 100,
  });
}

// Track form validation errors
export function trackFormValidationError(
  formName: string,
  fieldName: string,
  errorType: string
) {
  trackEvent('form_validation_error', 'engagement', `${formName}_${fieldName}`, undefined, {
    form_name: formName,
    field_name: fieldName,
    error_type: errorType,
  });
}

// Track form field focus time
export function trackFormFieldFocusTime(
  formName: string,
  fieldName: string,
  focusTime: number
) {
  if (focusTime > 1000) { // Only track if focused for more than 1 second
    trackEvent('form_field_focus_time', 'engagement', `${formName}_${fieldName}`, focusTime);
  }
}

// Track micro-conversions (steps toward main conversion)
export function trackMicroConversion(
  type: 'email_entered' | 'phone_entered' | 'service_selected' | 'budget_selected' | 'timeline_selected',
  formName: string,
  value?: string
) {
  const params: Record<string, string | number | boolean> = {
    form_name: formName,
    micro_conversion_type: type,
  };
  
  if (value) params.value = value;

  trackEvent('micro_conversion', 'engagement', `${formName}_${type}`, undefined, params);
}

// Track conversion funnel steps
export function trackFunnelStep(
  funnelName: string,
  stepName: string,
  stepNumber: number,
  additionalData?: Record<string, string | number | boolean>
) {
  trackEvent('funnel_step', 'conversion', `${funnelName}_${stepName}`, stepNumber, {
    funnel_name: funnelName,
    step_name: stepName,
    step_number: stepNumber,
    ...additionalData,
  });
}

// Track lead quality indicators
export function trackLeadQuality(
  formName: string,
  qualityScore: number,
  indicators: {
    hasCompany: boolean;
    hasBudget: boolean;
    hasTimeline: boolean;
    hasSpecificService: boolean;
    messageLength: number;
  }
) {
  trackEvent('lead_quality', 'conversion', formName, qualityScore, {
    form_name: formName,
    quality_score: qualityScore,
    has_company: indicators.hasCompany,
    has_budget: indicators.hasBudget,
    has_timeline: indicators.hasTimeline,
    has_specific_service: indicators.hasSpecificService,
    message_length: indicators.messageLength,
  });
}

// Send conversion data to API
async function sendConversionToAPI(conversionData: FormConversionData & { 
  timestamp: number; 
  url: string; 
  userAgent: string; 
  sessionId: string; 
}) {
  try {
    await fetch('/api/analytics/conversions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(conversionData),
    });
  } catch {
    // Silently fail
  }
}

// Get session ID for tracking
function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  
  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
}

// Helper to get total form fields (for completion rate calculation)
function getTotalFormFields(formName: string): number {
  const formFieldCounts: Record<string, number> = {
    contact_form: 6, // name, email, company, service, message, budget
    newsletter_signup: 2, // email, name
    service_inquiry: 4, // name, email, service, message
  };
  
  return formFieldCounts[formName] || 5;
}

// Enhanced form tracking hook
export function useFormTracking(formName: string) {
  const startTime = Date.now();
  const fieldFocusTimes: Record<string, number> = {};
  const completedFields: Set<string> = new Set();

  const trackFieldFocus = (fieldName: string) => {
    fieldFocusTimes[fieldName] = Date.now();
    trackEvent('form_field_focus', 'engagement', `${formName}_${fieldName}`);
  };

  const trackFieldBlur = (fieldName: string, value: string | number | boolean) => {
    const focusTime = fieldFocusTimes[fieldName];
    if (focusTime) {
      const timeSpent = Date.now() - focusTime;
      trackFormFieldFocusTime(formName, fieldName, timeSpent);
    }

    // Track field completion
    if (value && String(value).trim().length > 0) {
      completedFields.add(fieldName);
      trackMicroConversion('email_entered', formName, fieldName);
    }
  };

  const trackFieldError = (fieldName: string, errorType: string) => {
    trackFormValidationError(formName, fieldName, errorType);
  };

  const trackFormSubmit = (formData: Record<string, string | number | boolean>, success: boolean, errorMessage?: string) => {
    const completionTime = Date.now() - startTime;
    
    if (success) {
      // Calculate lead quality score
      const qualityScore = calculateLeadQuality(formData);
      
      trackFormConversion({
        type: 'contact_form',
        formName,
        formFields: formData,
        completionTime,
        value: qualityScore,
      });

      trackLeadQuality(formName, qualityScore, {
        hasCompany: !!formData.company,
        hasBudget: !!formData.budget,
        hasTimeline: !!formData.timeline,
        hasSpecificService: !!formData.service,
        messageLength: typeof formData.message === 'string' ? formData.message.length : 0,
      });
    } else {
      trackFormSubmission(formName, false, errorMessage);
    }
  };

  const trackFormAbandon = (currentField: string) => {
    const timeSpent = Date.now() - startTime;
    trackFormAbandonment(formName, currentField, Array.from(completedFields), timeSpent);
  };

  return {
    trackFieldFocus,
    trackFieldBlur,
    trackFieldError,
    trackFormSubmit,
    trackFormAbandon,
  };
}

// Calculate lead quality score based on form data
function calculateLeadQuality(formData: Record<string, string | number | boolean>): number {
  let score = 0;
  
  // Base score for completing the form
  score += 20;
  
  // Company information
  if (formData.company && typeof formData.company === 'string' && formData.company.trim().length > 0) {
    score += 15;
  }
  
  // Budget information
  if (formData.budget && formData.budget !== 'not_sure') {
    score += 20;
  }
  
  // Timeline information
  if (formData.timeline && formData.timeline !== 'not_sure') {
    score += 15;
  }
  
  // Specific service selection
  if (formData.service && formData.service !== 'general') {
    score += 10;
  }
  
  // Message quality
  if (formData.message && typeof formData.message === 'string') {
    const messageLength = formData.message.length;
    if (messageLength > 50) score += 10;
    if (messageLength > 150) score += 10;
  }
  
  // Email domain quality (business vs personal)
  if (formData.email && typeof formData.email === 'string') {
    const businessDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
    const domain = formData.email.split('@')[1];
    if (domain && !businessDomains.includes(domain.toLowerCase())) {
      score += 10;
    }
  }
  
  return Math.min(score, 100);
}