'use client'

import { ContactForm } from '../forms/ContactForm'
import { useContactForm } from '../../src/hooks/useContactForm'
import type { ContactFormData } from '../../types'

interface ContactSectionProps {
  onSubmit?: (data: ContactFormData) => Promise<boolean>
  className?: string
}

export function ContactSection({ onSubmit, className }: ContactSectionProps) {
  const { submitForm } = useContactForm();

  const handleSubmit = onSubmit || submitForm;

  return (
    <section className={`py-24 scroll-mt-20 ${className || ''}`} id="contact">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <ContactForm onSubmit={handleSubmit} />
      </div>
    </section>
  )
}