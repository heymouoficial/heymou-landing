"use client"

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Menu, X, ArrowRight } from 'lucide-react'

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


  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  const MobileMenu = () => (
    <motion.div 
      className="fixed inset-0 z-[9999] md:hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: isMenuOpen ? 1 : 0 }}
      transition={{ 
        duration: 0.2,
        delay: isMenuOpen ? 0 : 0.2
      }}
      style={{ 
        pointerEvents: isMenuOpen ? 'auto' : 'none',
        display: isMenuOpen ? 'block' : 'none'
      }}
    >
      {/* Backdrop */}
      <motion.div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setIsMenuOpen(false)}
        initial={{ opacity: 0 }}
        animate={{ opacity: isMenuOpen ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />
      
      {/* Drawer */}
      <motion.div 
        className="fixed top-0 right-0 h-full w-4/5 max-w-sm bg-background shadow-2xl flex flex-col pt-20 px-6 overflow-y-auto"
        initial={{ x: '100%' }}
        animate={{ 
          x: isMenuOpen ? '0%' : '100%',
          transition: {
            type: 'spring',
            stiffness: 300,
            damping: 30,
            delay: isMenuOpen ? 0.2 : 0
          }
        }}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsMenuOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-accent transition-colors"
          aria-label="Cerrar menú"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-6 py-8">
          {[
            { name: 'Inicio', href: '#inicio' },
            { name: 'Manifiesto', href: '#manifiesto' },
            { name: 'Expertise', href: '#expertise' },
            { name: 'Casos de Estudio', href: '#casos' },
            { name: 'Testimonios', href: '#testimonios' },
            { name: 'Contacto', href: '#contacto' },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => {
                e.preventDefault()
                setIsMenuOpen(false)
                scrollToSection(item.href.substring(1))
              }}
              className="block text-2xl font-medium hover:text-primary transition-colors py-3 px-4 rounded-lg hover:bg-foreground/5"
            >
              {item.name}
            </a>
          ))}
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
      </motion.div>
    </motion.div>
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
