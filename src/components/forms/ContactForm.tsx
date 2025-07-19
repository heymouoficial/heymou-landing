'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { useLeadCapture } from '@/hooks/useLeadCapture'
import type { LeadFormData } from '@/types/buildship'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

export function ContactForm() {
  const [formData, setFormData] = useState<LeadFormData>({
    name: "",
    email: "",
    projectType: "",
    budget: "",
    message: "",
  })

  const { isLoading, isSuccess, error, submitLead, resetState } = useLeadCapture()

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: keyof LeadFormData) => (value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Simple validation
    if (!formData.name || !formData.email || !formData.message || !formData.projectType || !formData.budget) {
      // En un futuro, podríamos manejar un estado de error más granular aquí.
      alert("Por favor, completa todos los campos requeridos.");
      return;
    }
    const success = await submitLead(formData)
    if (success) {
      setFormData({ name: "", email: "", projectType: "", budget: "", message: "" })
    }
  }

  if (isSuccess) {
    return (
      <Card className="p-8 bg-card border-border flex flex-col items-center justify-center text-center">
        <h3 className="text-2xl font-bold mb-4">¡Gracias!</h3>
        <p className="text-muted-foreground mb-6">Tu mensaje ha sido enviado. Te responderé pronto.</p>
        <Button onClick={resetState}>Enviar otro mensaje</Button>
      </Card>
    )
  }

  return (
    <Card className="p-8 bg-card border-border">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">Nombre</label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Tu nombre"
              disabled={isLoading}
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="tu@email.com"
              disabled={isLoading}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="w-full">
            <label htmlFor="projectType" className="block text-sm font-medium mb-2">Tipo de Proyecto</label>
            <Select onValueChange={handleSelectChange("projectType")} value={formData.projectType} disabled={isLoading} required>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona una opción..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="consultoria">Consultoría Estratégica</SelectItem>
                <SelectItem value="diseno-producto">Diseño de Producto (UX/UI)</SelectItem>
                <SelectItem value="desarrollo-web">Desarrollo Web/App</SelectItem>
                <SelectItem value="automatizacion">Automatización y Flujos</SelectItem>
                <SelectItem value="otro">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full">
            <label htmlFor="budget" className="block text-sm font-medium mb-2">Presupuesto Estimado</label>
            <Select onValueChange={handleSelectChange("budget")} value={formData.budget} disabled={isLoading} required>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona un rango..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="600-1200">$600 - $1,200</SelectItem>
                <SelectItem value="1200-3500">$1,200 - $3,500</SelectItem>
                <SelectItem value="5000+">+$5,000</SelectItem>
                <SelectItem value="discutir">Prefiero discutirlo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="message" className="block text-sm font-medium mb-2">Tu Mensaje</label>
          <Textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            placeholder="Cuéntame sobre tu proyecto, tus objetivos y cómo crees que puedo ayudarte..."
            className="resize-none min-h-[120px]"
            disabled={isLoading}
            required
          />
        </div>

        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md sm:col-span-2">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <Button type="submit" className="w-full sm:col-span-2" disabled={isLoading}>
          {isLoading ? "Enviando..." : "Enviar Mensaje"}
        </Button>
        <div className="w-full mt-2">
          <p className="text-xs text-muted-foreground text-center leading-relaxed">
            Al enviar este formulario, aceptas nuestra <a href="/politica-privacidad" className="text-primary hover:underline">Política de Privacidad</a> y que me ponga en contacto contigo para responder a tu consulta. No compartiremos tu información con terceros.
          </p>
        </div>
      </form>
    </Card>
  )
}
