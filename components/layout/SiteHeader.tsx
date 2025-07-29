"use client"

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, ChevronRightIcon } from 'lucide-react'

import { Button } from "../ui/Button"
import { useTranslation } from '../../src/hooks/useTranslation'

import { LanguageSelector } from './LanguageSelector'

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
  const { t, locale } = useTranslation()
  
  useEffect(() => {
    setMounted(true)
  }, [])

  const navigation = [
    { name: t('home'), href: '#inicio', type: 'scroll' },
    { name: t('services'), href: '#servicios', type: 'scroll' },
    { name: t('portfolio'), href: '#casos-exito', type: 'scroll' },
    { name: 'Blog', href: '#blog', type: 'scroll' },
  ];

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
          {navigation.map((item) => (
            item.type === 'link' ? (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="block text-2xl font-medium hover:text-primary transition-colors py-3 px-4 rounded-lg hover:bg-foreground/5"
              >
                {item.name}
              </Link>
            ) : (
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
            )
          ))}
        </nav>
        
        {/* Language Selector */}
        <div className="pb-4">
          <LanguageSelector />
        </div>
        
        {/* CTA Button */}
        <div className="pb-8 pt-4">
          <Button 
            variant="default" 
            size="lg"
            className="w-full group"
            onClick={() => {
              setIsMenuOpen(false);
              scrollToSection('contacto');
            }}
          >
            {t('hero.ctaPrimary')}
            <ChevronRightIcon className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between h-20 px-4 sm:px-6 lg:px-8 xl:px-4">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center space-x-3">
            <Image 
              src="/logos/SVG/LogoheyMou.svg" 
              alt="HeyMou" 
              width={32}
              height={32}
              className="h-8 w-auto"
            />
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
              onClick={() => scrollToSection('servicios')} 
              className="text-sm font-medium text-white hover:text-white hover:bg-[#0059FF] px-3 py-2 rounded-md transition-all duration-300 cursor-pointer"
            >
              {t('services')}
            </button>
            <button 
              onClick={() => scrollToSection('casos-exito')} 
              className="text-sm font-medium text-white hover:text-white hover:bg-[#0059FF] px-3 py-2 rounded-md transition-all duration-300 cursor-pointer"
            >
              {t('portfolio')}
            </button>
            <button 
              onClick={() => scrollToSection('blog')} 
              className="text-sm font-medium text-white hover:text-white hover:bg-[#0059FF] px-3 py-2 rounded-md transition-all duration-300 cursor-pointer"
            >
              Blog
            </button>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSelector />
            <Button 
              variant="default" 
              className="group"
              onClick={() => scrollToSection('contacto')}
            >
              {t('hero.ctaPrimary')}
              <ChevronRightIcon className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
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