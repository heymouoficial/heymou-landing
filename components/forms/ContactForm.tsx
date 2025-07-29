'use client'

import { useState } from 'react'

import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Card } from '../ui/Card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select'
import { Textarea } from '../ui/Textarea'
import { useCommonTranslation } from '../../src/hooks/useTranslation'
import type { ContactFormData } from '../../types'

interface ContactFormProps {
  onSubmit?: (data: ContactFormData) => Promise<boolean>
  className?: string
}

interface FormState {
  isLoading: boolean
  isSuccess: boolean
  error: string | null
}

export function ContactForm({ onSubmit, className }: ContactFormProps) {
  const { t, locale } = useCommonTranslation()
  
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    company: '',
    projectType: 'web',
    message: '',
    budget: '',
    timeline: ''
  })

  const [formState, setFormState] = useState<FormState>({
    isLoading: false,
    isSuccess: false,
    error: null
  })

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.name.trim()) {
      errors.name = t('contactForm.validation.required')
    }

    if (!formData.email.trim()) {
      errors.email = t('contactForm.validation.required')
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = t('contactForm.validation.email')
    }

    if (!formData.message.trim()) {
      errors.message = t('contactForm.validation.required')
    } else if (formData.message.trim().length < 10) {
      errors.message = t('contactForm.validation.minLength', { min: 10 })
    }

    if (!formData.projectType) {
      errors.projectType = t('contactForm.validation.required')
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSelectChange = (name: keyof ContactFormData) => (value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear validation error when user selects
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setFormState({ isLoading: true, isSuccess: false, error: null })

    try {
      let success = true
      
      // Add locale to form data
      const submissionData: ContactFormData = {
        ...formData,
        locale,
      };
      
      if (onSubmit) {
        success = await onSubmit(submissionData)
      } else {
        // Default submission logic - simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000))
        // eslint-disable-next-line no-console
        console.log('Form submitted:', submissionData)
      }

      if (success) {
        setFormState({ isLoading: false, isSuccess: true, error: null })
        setFormData({
          name: '',
          email: '',
          company: '',
          projectType: 'web',
          message: '',
          budget: '',
          timeline: ''
        })
      } else {
        setFormState({ 
          isLoading: false, 
          isSuccess: false, 
          error: t('contactForm.states.error') 
        })
      }
    } catch {
      setFormState({ 
        isLoading: false, 
        isSuccess: false, 
        error: t('contactForm.states.error') 
      })
    }
  }

  const resetForm = () => {
    setFormState({ isLoading: false, isSuccess: false, error: null })
    setValidationErrors({})
  }

  if (formState.isSuccess) {
    return (
      <Card className={`p-8 bg-card border-border flex flex-col items-center justify-center text-center ${className || ''}`}>
        <div className="mb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold mb-2">{t('contactForm.states.success.title')}</h3>
          <p className="text-muted-foreground">{t('contactForm.states.success.description')}</p>
        </div>
        <Button onClick={resetForm} variant="outline">
          {t('contactForm.states.success.button')}
        </Button>
      </Card>
    )
  }

  return (
    <Card className={`p-8 bg-card border-border ${className || ''}`}>
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold mb-4">{t('contactForm.title')}</h2>
        <p className="text-muted-foreground text-lg">{t('contactForm.subtitle')}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              {t('contactForm.fields.name.label')}
            </label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              placeholder={t('contactForm.fields.name.placeholder')}
              disabled={formState.isLoading}
              className={validationErrors.name ? 'border-destructive' : ''}
              required
            />
            {validationErrors.name && (
              <p className="text-sm text-destructive mt-1">{validationErrors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              {t('contactForm.fields.email.label')}
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder={t('contactForm.fields.email.placeholder')}
              disabled={formState.isLoading}
              className={validationErrors.email ? 'border-destructive' : ''}
              required
            />
            {validationErrors.email && (
              <p className="text-sm text-destructive mt-1">{validationErrors.email}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="company" className="block text-sm font-medium mb-2">
            {t('contactForm.fields.company.label')}
          </label>
          <Input
            id="company"
            name="company"
            type="text"
            value={formData.company}
            onChange={handleInputChange}
            placeholder={t('contactForm.fields.company.placeholder')}
            disabled={formState.isLoading}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label htmlFor="projectType" className="block text-sm font-medium mb-2">
              {t('contactForm.fields.projectType.label')}
            </label>
            <Select 
              onValueChange={handleSelectChange('projectType')} 
              value={formData.projectType} 
              disabled={formState.isLoading}
            >
              <SelectTrigger className={`w-full ${validationErrors.projectType ? 'border-destructive' : ''}`}>
                <SelectValue placeholder={t('contactForm.fields.projectType.placeholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="web">{t('contactForm.fields.projectType.options.web')}</SelectItem>
                <SelectItem value="mobile">{t('contactForm.fields.projectType.options.mobile')}</SelectItem>
                <SelectItem value="automation">{t('contactForm.fields.projectType.options.automation')}</SelectItem>
                <SelectItem value="consulting">{t('contactForm.fields.projectType.options.consulting')}</SelectItem>
              </SelectContent>
            </Select>
            {validationErrors.projectType && (
              <p className="text-sm text-destructive mt-1">{validationErrors.projectType}</p>
            )}
          </div>

          <div>
            <label htmlFor="budget" className="block text-sm font-medium mb-2">
              {t('contactForm.fields.budget.label')}
            </label>
            <Select 
              onValueChange={handleSelectChange('budget')} 
              value={formData.budget} 
              disabled={formState.isLoading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t('contactForm.fields.budget.placeholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1000-3000">{t('contactForm.fields.budget.options.1000-3000')}</SelectItem>
                <SelectItem value="3000-7000">{t('contactForm.fields.budget.options.3000-7000')}</SelectItem>
                <SelectItem value="7000-15000">{t('contactForm.fields.budget.options.7000-15000')}</SelectItem>
                <SelectItem value="15000+">{t('contactForm.fields.budget.options.15000+')}</SelectItem>
                <SelectItem value="discuss">{t('contactForm.fields.budget.options.discuss')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label htmlFor="timeline" className="block text-sm font-medium mb-2">
              {t('contactForm.fields.timeline.label')}
            </label>
            <Select 
              onValueChange={handleSelectChange('timeline')} 
              value={formData.timeline} 
              disabled={formState.isLoading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t('contactForm.fields.timeline.placeholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asap">{t('contactForm.fields.timeline.options.asap')}</SelectItem>
                <SelectItem value="1-3months">{t('contactForm.fields.timeline.options.1-3months')}</SelectItem>
                <SelectItem value="3-6months">{t('contactForm.fields.timeline.options.3-6months')}</SelectItem>
                <SelectItem value="6months+">{t('contactForm.fields.timeline.options.6months+')}</SelectItem>
                <SelectItem value="flexible">{t('contactForm.fields.timeline.options.flexible')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-2">
            {t('contactForm.fields.message.label')}
          </label>
          <Textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            placeholder={t('contactForm.fields.message.placeholder')}
            className={`resize-none min-h-[120px] ${validationErrors.message ? 'border-destructive' : ''}`}
            disabled={formState.isLoading}
            required
          />
          {validationErrors.message && (
            <p className="text-sm text-destructive mt-1">{validationErrors.message}</p>
          )}
        </div>

        {formState.error && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md">
            <p className="text-sm text-destructive">{formState.error}</p>
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full" 
          disabled={formState.isLoading}
        >
          {formState.isLoading ? t('contactForm.states.loading') : t('contactForm.states.idle')}
        </Button>

        <div className="text-center">
          <p className="text-xs text-muted-foreground leading-relaxed">
            {t('contactForm.privacy')}
          </p>
        </div>
      </form>
    </Card>
  )
}