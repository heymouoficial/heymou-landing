'use client';

import { useState } from 'react';
import { buildshipClient, formatLeadData } from '@/lib/buildship';
import type { LeadFormData, LeadSubmissionState, FormValidationErrors } from '@/types/buildship';

export function useLeadCapture() {
  const [state, setState] = useState<LeadSubmissionState>({
    isLoading: false,
    isSuccess: false,
    error: null,
  });

  const validateForm = (data: LeadFormData): FormValidationErrors => {
    const errors: FormValidationErrors = {};

    // Validación nombre
    if (!data.name.trim()) {
      errors.name = 'El nombre es requerido';
    } else if (data.name.trim().length < 2) {
      errors.name = 'El nombre debe tener al menos 2 caracteres';
    }

    // Validación email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email.trim()) {
      errors.email = 'El email es requerido';
    } else if (!emailRegex.test(data.email.trim())) {
      errors.email = 'Por favor ingresa un email válido';
    }

    // Validación mensaje
    if (!data.message.trim()) {
      errors.message = 'El mensaje es requerido';
    } else if (data.message.trim().length < 10) {
      errors.message = 'El mensaje debe tener al menos 10 caracteres';
    }

    return errors;
  };

  const submitLead = async (formData: LeadFormData): Promise<boolean> => {
    // Validar formulario
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setState({
        isLoading: false,
        isSuccess: false,
        error: Object.values(validationErrors)[0] || 'Error de validación',
      });
      return false;
    }

    setState({
      isLoading: true,
      isSuccess: false,
      error: null,
    });

    try {
      // Formatear datos para BuildShip
      const leadData = formatLeadData(
        formData.name,
        formData.email,
        formData.message,
        'landing_page'
      );

      // Enviar a BuildShip webhook
      const response = await buildshipClient.captureLeadWebhook(leadData);

      if (response.success) {
        setState({
          isLoading: false,
          isSuccess: true,
          error: null,
        });

        // Analytics tracking (opcional)
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'lead_capture', {
            event_category: 'engagement',
            event_label: 'contact_form',
            value: 1,
          });
        }

        return true;
      } else {
        throw new Error(response.error || 'Error al enviar el mensaje');
      }
    } catch (error) {
      console.error('Error submitting lead:', error);
      
      setState({
        isLoading: false,
        isSuccess: false,
        error: error instanceof Error ? error.message : 'Error inesperado. Por favor intenta nuevamente.',
      });

      return false;
    }
  };

  const resetState = () => {
    setState({
      isLoading: false,
      isSuccess: false,
      error: null,
    });
  };

  return {
    ...state,
    submitLead,
    resetState,
    validateForm,
  };
}
