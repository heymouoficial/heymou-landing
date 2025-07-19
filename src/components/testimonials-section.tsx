"use client"

import { motion } from "framer-motion"

import React from "react"

const testimonials = [
  {
    name: "Marcos Utrera",
    title: "Presidente, Mini Universo",
    quote: "En estos 3 años, la visión estratégica de Mou ha sido clave para la expansión de Mini Universo. Un verdadero socio de negocio."
  },
  {
    name: "Rafael Boghtchumian",
    title: "Armeni & AutoMVD",
    quote: "Más que un consultor, Mou es un pilar en mis emprendimientos. Su capacidad para ejecutar la visión de Armeni y AutoMVD ha sido fundamental durante estos 5 años."
  },
  {
    name: "Roxana Della Croce",
    title: "Camino El Portal del Alma & NOPA",
    quote: "La sinergia con Mou es única. Durante 5 años, ha traducido nuestras ideas más complejas en soluciones digitales claras y con alma."
  },
  {
    name: "Nicolas Mallo",
    title: "NOPA",
    quote: "Mou es un profesional dedicado con pasión en su trabajo, nuestra experiencia desde el inicio fue excelente."
  },  
  {
    name: "Runa Quantum",
    title: "Directora Artística, Biohacking Cuántico",
    quote: "Nuestra colaboración trasciende lo profesional. Como socia, veo de primera mano cómo Mou convierte conceptos abstractos en realidades funcionales y estéticas."
  },
  {
    name: "Mauro Cavallo",
    title: "Co Fundador, Tatua Company",
    quote: "Mou tiene una capacidad única para alinear la visión holística de un proyecto con una estrategia de negocio sólida. Su consultoría ha sido vital para Tatua."
  },
  {
    name: "Gabriel Sthormes",
    title: "Entretormentas.com",
    quote: "Desde que Mou se encarga del soporte de Entretormentas.com, nuestra plataforma es más robusta y rápida. Su proactividad es un gran diferenciador."
  },
  {
    name: "Carmelo Petti",
    title: "Consultor de Negocios",
    quote: "Llevamos más de una década colaborando. La creatividad y el criterio de Mou para abordar proyectos, incluso en sus fases más tempranas, son excepcionales."
  },
  {
    name: "Raymond Azar",
    title: "Analista Político | Creador de contenido",
    quote: "En un sector tan cambiante, contar con un consultor como Mou es una ventaja competitiva. Dos años de colaboración y resultados tangibles."
  },
]

function TestimonialCard({ testimonial, index }: { testimonial: (typeof testimonials)[0]; index: number }) {
  return (
    <motion.div
      className="group relative p-8 rounded-2xl border border-white/5 bg-gradient-to-br from-white/5 to-transparent hover:from-white/10 transition-all duration-300 overflow-hidden h-full flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="relative z-10 flex flex-col flex-grow">
        <p className="text-muted-foreground leading-relaxed mb-6 flex-grow">“{testimonial.quote}”</p>
        <div className="mt-auto pt-6 border-t border-white/10">
          <p className="font-semibold">{testimonial.name}</p>
          <p className="text-sm text-muted-foreground">{testimonial.title}</p>
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  )
}

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-block bg-foreground/5 text-foreground/80 text-sm font-medium px-4 py-1.5 rounded-full mb-4">
            Voces de Confianza
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Testimonios
          </h2>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Lo que dicen mis clientes sobre nuestro trabajo juntos. Resultados, no solo promesas.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={testimonial.name} testimonial={testimonial} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
