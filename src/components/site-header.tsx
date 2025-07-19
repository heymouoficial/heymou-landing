"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SiteHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
      <div className="container flex items-center justify-between h-20 px-6 mx-auto">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold">
          HeyMou
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/manifiesto" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
            Manifiesto
          </Link>
          <Link href="/expertise" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
            Expertise
          </Link>
          <Link href="/proceso" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
            Proceso
          </Link>
          <Link href="/casos" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
            Casos de estudio
          </Link>
        </nav>

        {/* CTA */}
        <Button 
          asChild 
          variant="default" 
          className="group relative overflow-hidden transition-all duration-300 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 hover:shadow-lg hover:shadow-primary/20"
        >
          <Link href="/contacto" className="relative z-10">
            Comencemos hoy
            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:scale-110" />
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -skew-x-12 -translate-x-full group-hover:translate-x-full"></span>
          </Link>
        </Button>
      </div>
    </header>
  )
}
