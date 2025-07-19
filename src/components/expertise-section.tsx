"use client"

import { Compass, Palette, Code } from "lucide-react"
import { motion } from "framer-motion"
import React from "react"

type ExpertiseItemType = {
  icon: React.ReactNode
  title: string
  description: string
  points: string[]
}

const expertiseItems: ExpertiseItemType[] = [
  {
    icon: <Compass className="w-6 h-6" />,
    title: "Consultoría Estratégica",
    description: "Análisis profundo, visión clara, roadmaps ejecutables. Transformo complejidad en estrategia accionable.",
    points: [
      "Arquitectura de sistemas",
      "Estrategia tecnológica",
      "Optimización de procesos"
    ]
  },
  {
    icon: <Palette className="w-6 h-6" />,
    title: "Diseño de Producto",
    description: "UX/UI minimalista, funcional y humano. Interfaces que comunican claridad y propósito.",
    points: [
      "Diseño de experiencias",
      "Prototipado rápido",
      "Sistemas de diseño"
    ]
  },
  {
    icon: <Code className="w-6 h-6" />,
    title: "Implementación Técnica",
    description: "Desarrollo full-stack, integraciones complejas, automatización inteligente.",
    points: [
      "Desarrollo web/mobile",
      "Integraciones API",
      "Automatización de flujos"
    ]
  }
]

function ExpertiseCard({ item, index }: { item: ExpertiseItemType; index: number }) {
  return (
    <motion.div
      className="group relative p-8 rounded-2xl border border-white/5 bg-gradient-to-br from-white/5 to-transparent hover:from-white/10 transition-all duration-300 overflow-hidden h-full flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="relative z-10 flex flex-col flex-grow">
        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary/20 transition-colors flex-shrink-0">
          {item.icon}
        </div>
        <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
        <p className="text-muted-foreground leading-relaxed mb-6">
          {item.description}
        </p>
        <ul className="text-muted-foreground space-y-2 mt-auto">
          {item.points.map((point, i) => (
            <li key={i} className="flex items-start">
              <span className="text-primary mr-3 mt-1">•</span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  )
}

export function ExpertiseSection() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-block bg-foreground/5 text-foreground/80 text-sm font-medium px-4 py-1.5 rounded-full mb-4">
            Mis Servicios
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Expertise
          </h2>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Desde la concepción estratégica hasta la implementación técnica, cubro cada fase del ciclo de vida de tu producto digital.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {expertiseItems.map((item, index) => (
            <ExpertiseCard key={index} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
