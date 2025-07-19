"use client"

import { motion } from "framer-motion"
import React from "react"

const caseStudies = [
  {
    title: "Biohacking Cuántico",
    description: "Códice toroidal basado en un Libro y un Mazo Cuántico. En desarrollo en conjunto con Runa.",
    tags: ["En desarrollo", "Contenido Estratégico"],
    gridClass: "lg:col-span-2",
  },
  {
    title: "SmartCatalogue",
    description: "Solución ETL para sincronización de catálogos corporativos en WooCommerce.",
    tags: ["En pruebas (Privado)", "SaaS", "IA"],
    gridClass: "",
  },
  {
    title: "MercuariApp",
    description: "Herramienta financiera Freemium con IA para mercados con control cambiario.",
    tags: ["En pruebas (OpenSource)", "Fintech", "Dashboard"],
    gridClass: "",
  },
  {
    title: "Mini Universo",
    description: "Rebranding y estrategia de marca. Pendiente automatización de captación de franquicias.",
    tags: ["En automatización", "Branding"],
    gridClass: "",
  },
  {
    title: "Armeni",
    description: "Marca de ropa PrintOnDemand con ADN Armenio/Uruguayo. Enfocada en valor familiar y fe.",
    tags: ["En espera de lanzamiento", "E-commerce", "PrintOnDemand"],
    gridClass: "",
  },
  {
    title: "Tatua",
    description: "Marca de ropa PrintOnDemand con ADN Italo/Venezolano.",
    tags: ["En espera de lanzamiento", "E-commerce"],
    gridClass: "lg:col-span-2",
  },
  {
    title: "AutoMVD",
    description: "El AirBNB de la Compra y Venta de Carros en Montevideo.",
    tags: ["En etapa de ideación", "Marketplace"],
    gridClass: "",
  },
]

function CaseStudyCard({ study, index }: { study: (typeof caseStudies)[0]; index: number }) {
  return (
    <motion.div
      className={`group relative p-8 rounded-2xl border border-white/5 bg-gradient-to-br from-white/5 to-transparent hover:from-white/10 transition-all duration-300 overflow-hidden h-full flex flex-col ${study.gridClass}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="relative z-10 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold mb-3">{study.title}</h3>
        <p className="text-muted-foreground leading-relaxed mb-6 flex-grow">
          {study.description}
        </p>
        <div className="flex flex-wrap gap-2 mt-auto">
          {study.tags.map((tag) => (
            <span key={tag} className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  )
}

export function CaseStudiesSection() {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-block bg-foreground/5 text-foreground/80 text-sm font-medium px-4 py-1.5 rounded-full mb-4">
            Proyectos Destacados
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Casos de Estudio
          </h2>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Soluciones reales a problemas complejos. Una muestra de mi trabajo en estrategia, diseño y desarrollo.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {caseStudies.map((study, index) => (
            <CaseStudyCard key={study.title} study={study} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
