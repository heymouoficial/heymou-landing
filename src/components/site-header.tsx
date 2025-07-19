"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Menu, X, ArrowRight } from "lucide-react"

const scrollToSection = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
};

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  const MobileMenu = () => (
    <div className={cn(
      "fixed inset-0 z-[9999] md:hidden",
      isMenuOpen ? "block" : "hidden"
    )}>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setIsMenuOpen(false)}
      />
      
      {/* Drawer */}
      <div className={cn(
        "fixed top-0 right-0 h-full w-4/5 max-w-sm bg-background shadow-2xl",
        "flex flex-col pt-20 px-6 overflow-y-auto transition-transform duration-300 ease-in-out",
        isMenuOpen ? "translate-x-0" : "translate-x-full"
      )}>
        {/* Close Button */}
        <button
          onClick={() => setIsMenuOpen(false)}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-foreground/10 transition-colors"
          aria-label="Cerrar menú"
        >
          <X className="h-6 w-6" />
        </button>
        
        {/* Navigation Links */}
        <nav className="flex-1 flex flex-col space-y-6 py-8">
          <button 
            onClick={() => {
              setIsMenuOpen(false);
              scrollToSection('manifiesto');
            }}
            className="text-xl font-medium text-foreground/90 hover:text-foreground transition-colors cursor-pointer py-3 px-4 rounded-lg hover:bg-foreground/5 text-left"
          >
            Manifiesto
          </button>
          <button 
            onClick={() => {
              setIsMenuOpen(false);
              scrollToSection('expertise');
            }}
            className="text-xl font-medium text-foreground/90 hover:text-foreground transition-colors cursor-pointer py-3 px-4 rounded-lg hover:bg-foreground/5 text-left"
          >
            Expertise
          </button>
          <button 
            onClick={() => {
              setIsMenuOpen(false);
              scrollToSection('casos');
            }}
            className="text-xl font-medium text-foreground/90 hover:text-foreground transition-colors cursor-pointer py-3 px-4 rounded-lg hover:bg-foreground/5 text-left"
          >
            Casos de estudio
          </button>
          <button 
            onClick={() => {
              setIsMenuOpen(false);
              scrollToSection('testimonios');
            }}
            className="text-xl font-medium text-foreground/90 hover:text-foreground transition-colors cursor-pointer py-3 px-4 rounded-lg hover:bg-foreground/5 text-left"
          >
            Testimonios
          </button>
        </nav>
        
        {/* CTA Button */}
        <div className="pb-8 pt-4">
          <Button 
            variant="default" 
            size="lg"
            className="w-full group relative overflow-hidden transition-all duration-300 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            onClick={() => {
              setIsMenuOpen(false);
              scrollToSection('contacto');
            }}
          >
            <span className="relative z-10 flex items-center justify-center w-full">
              Comencemos hoy
              <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:scale-110" />
            </span>
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
        <div className="container flex items-center justify-between h-20 px-6 mx-auto">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold">
            HeyMou
          </Link>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('manifiesto')} 
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors cursor-pointer"
            >
              Manifiesto
            </button>
            <button 
              onClick={() => scrollToSection('expertise')} 
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors cursor-pointer"
            >
              Expertise
            </button>
            <button 
              onClick={() => scrollToSection('casos')} 
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors cursor-pointer"
            >
              Casos de estudio
            </button>
            <button 
              onClick={() => scrollToSection('testimonios')} 
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors cursor-pointer"
            >
              Testimonios
            </button>
          </nav>

          {/* CTA - Hidden on mobile */}
          <div className="hidden md:block">
            <Button 
              variant="default" 
              className="group relative overflow-hidden transition-all duration-300 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 hover:shadow-lg hover:shadow-primary/20"
              onClick={() => scrollToSection('contacto')}
            >
              <span className="relative z-10 flex items-center">
                Comencemos hoy
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:scale-110" />
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -skew-x-12 -translate-x-full group-hover:translate-x-full"></span>
            </Button>
          </div>
        </div>
      </header>
      
      {/* Mobile Menu Portal */}
      {mounted && createPortal(
        <MobileMenu />,
        document.body
      )}
    </>
  )
}
