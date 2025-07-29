'use client';

import { useState } from 'react';

import type { ContactFormData } from '../../types';
import type { BuildShipResponse, ContactSubmissionResponse } from '../../types/buildship';

interface UseContactFormReturn {
  submitForm: (data: ContactFormData) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
  isSuccess: boolean;
  reset: () => void;
}

export function useContactForm(): UseContactFormReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const submitForm = async (formData: ContactFormData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      // Get current locale from URL
      const currentPath = window.location.pathname;
      const locale = currentPath.startsWith('/en') ? 'en' : 'es';

      // Prepare form data with locale
      const submissionData: ContactFormData = {
        ...formData,
        locale,
      };

      // Submit to BuildShip proxy endpoint
      const response = await fetch('/api/buildship/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      const result: BuildShipResponse<ContactSubmissionResponse> = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to submit contact form');
      }

      setIsSuccess(true);
      setIsLoading(false);

      // Track successful submission
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'form_submit', {
          event_category: 'Contact',
          event_label: formData.projectType,
          value: 1,
        });
      }

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      setIsLoading(false);
      setIsSuccess(false);

      // Track failed submission
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'form_error', {
          event_category: 'Contact',
          event_label: errorMessage,
        });
      }

      return false;
    }
  };

  const reset = () => {
    setIsLoading(false);
    setError(null);
    setIsSuccess(false);
  };

  return {
    submitForm,
    isLoading,
    error,
    isSuccess,
    reset,
  };
}