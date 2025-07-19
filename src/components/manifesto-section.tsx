"use client"

import { Sparkles, Eye, Code, Heart, Zap, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import React from "react"

type ManifestoItemType = {
  icon: React.ReactNode
  title: string
  description: string
}

const manifestoItems: ManifestoItemType[] = [
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: "Innovación Constante",
    description: "Busco estar siempre a la vanguardia tecnológica, adoptando las últimas tendencias y herramientas para ofrecer soluciones de punta."
  },
  {
    icon: <Eye className="w-6 h-6" />,
    title: "Transparencia Radical",
    description: "Creo en la comunicación clara y honesta. Mi proceso es abierto y te mantendré informado en cada paso del camino."
  },
  {
    icon: <Code className="w-6 h-6" />,
    title: "Código Limpio",
    description: "Me comprometo a escribir código limpio, mantenible y bien documentado que perdure en el tiempo."
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: "Pasión por el Detalle",
    description: "Cada píxel, cada interacción y cada línea de código recibe mi atención meticulosa."
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Rendimiento",
    description: "Optimizo cada aspecto para ofrecer experiencias rápidas, fluidas y eficientes."
  }
]

function ManifestoCard({ item, index }: { item: ManifestoItemType; index: number }) {
  return (
    <motion.div
      className="group relative p-8 rounded-2xl border border-white/5 bg-gradient-to-br from-white/5 to-transparent hover:from-white/10 transition-all duration-300 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >


      <div className="relative z-10">
        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary/20 transition-colors">
          {item.icon}
        </div>
        <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
        <p className="text-muted-foreground leading-relaxed">
          {item.description}
        </p>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  )
}

export function ManifestoSection() {
  return (
    <section className="relative py-24 bg-background overflow-hidden">
      {/* Background texture and gradient */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,black_80%)]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-block bg-foreground/5 text-foreground/80 text-sm font-medium px-4 py-1.5 rounded-full mb-4">
            El Manifiesto
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Claridad en la Complejidad Digital
          </h2>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Creo en la simplicidad elegante, la innovación práctica y las soluciones que
            realmente importan para ti y tu negocio.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {manifestoItems.map((item, index) => (
            <ManifestoCard key={index} item={item} index={index} />
          ))}
        </div>

        <div className="text-center mt-16">
          <Link href="#contacto" scroll={false}>
            <motion.div
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 transition-all group text-lg font-medium cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Trabajemos juntos
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.div>
          </Link>
        </div>
      </div>
    </section>
  )
}
