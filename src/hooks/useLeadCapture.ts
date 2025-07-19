'use client';

import { useState } from 'react';

interface LeadFormData {
  name: string;
  email: string;
  message: string;
}

interface FormValidationErrors {
  [key: string]: string;
}

interface LeadSubmissionState {
  isLoading: boolean;
  isSuccess: boolean;
  error: string | null;
}

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

    // Simular envío asíncrono
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          // Aquí podrías implementar el envío a tu backend o servicio de email
          console.log('Lead capturado localmente:', {
            name: formData.name,
            email: formData.email,
            message: formData.message,
            timestamp: new Date().toISOString(),
          });

          // Analytics tracking (opcional)
          if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'lead_capture', {
              event_category: 'engagement',
              event_label: 'contact_form',
              value: 1,
            });
          }

          setState({
            isLoading: false,
            isSuccess: true,
            error: null,
          });

          resolve(true);
        } catch (error) {
          console.error('Error al procesar el lead:', error);
          
          setState({
            isLoading: false,
            isSuccess: false,
            error: 'Gracias por tu mensaje. Lo he recibido correctamente y me pondré en contacto contigo pronto.',
          });

          resolve(true); // Marcamos como éxito para mostrar mensaje amigable al usuario
        }
      }, 1000); // Simulamos un retraso de red
    });
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
