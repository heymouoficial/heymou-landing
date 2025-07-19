"use client"

import { ArrowRightIcon, ChevronRightIcon, GithubIcon, InstagramIcon, TwitterIcon, CalendarIcon } from "lucide-react"
import { TiktokIcon } from "@/components/ui/icons"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FadeIn } from "@/components/animation/FadeIn"
import { SiteHeader } from "@/components/site-header"
import { LogoCarousel } from "@/components/logo-carousel"
import { ManifestoSection } from "@/components/manifesto-section"
import { ExpertiseSection } from "@/components/expertise-section"
import { CaseStudiesSection } from "@/components/case-studies-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { ContactForm } from "@/components/forms/ContactForm"
import { Variants } from 'framer-motion'

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20, 
    filter: 'blur(5px)' 
  },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0)',
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 20,
      delay: 0.2 + (i * 0.1)
    }
  })
};

// Animation configuration
const animationConfig = {
  initial: 'hidden',
  whileInView: 'visible',
  viewport: { once: true, margin: '-100px' },
  variants: containerVariants
};

export default function Home() {
  // Removed unused scrollToSection and sections ref as they're not being used
  // and were causing TypeScript warnings

  return (
    <div className="min-h-screen bg-black text-foreground">
      <SiteHeader />
      {/* Hero Section */}
      <section 
        id="inicio" 
        className="min-h-[90vh] h-auto flex items-center justify-center py-20 md:py-32 scroll-mt-0 relative"
        style={{ scrollSnapAlign: 'start' }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center"
            {...animationConfig}
          >
            {/* Content - 60% */}
            <div className="lg:col-span-3 space-y-8">
              <motion.h1 
                className="text-5xl md:text-7xl font-bold tracking-tight"
                custom={0}
                variants={itemVariants}
              >
                Claridad en la
                <br />
                <span className="text-muted-foreground">Complejidad Digital</span>
              </motion.h1>
              
              <motion.p 
                className="text-xl md:text-2xl text-muted-foreground max-w-2xl leading-relaxed"
                custom={1}
                variants={itemVariants}
              >
                Transformo ideas complejas en soluciones digitales claras y efectivas.
                Estrategia, diseño y desarrollo que conecta con tu audiencia.
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 pt-8"
                custom={2}
                variants={itemVariants}
              >
                <Button 
                  size="lg" 
                  className="px-8 py-6 text-lg group relative overflow-hidden transition-all duration-300 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 hover:shadow-lg hover:shadow-primary/20"
                  asChild
                >
                  <a href="#contacto">
                    <span className="relative z-10 flex items-center justify-center">
                      Trabajemos Juntos
                      <ChevronRightIcon className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -skew-x-12 -translate-x-full group-hover:translate-x-full"></span>
                  </a>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="px-8 py-6 text-lg group relative overflow-hidden border-foreground/20 hover:border-primary/30 hover:bg-foreground/5 transition-all duration-300"
                  asChild
                >
                  <a href="#proyectos">
                    <span className="relative z-10 flex items-center justify-center">
                      Ver Mi Trabajo
                      <ArrowRightIcon className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -skew-x-12 -translate-x-full group-hover:translate-x-full"></span>
                  </a>
                </Button>
              </motion.div>
              
              {/* Divider and Features */}
              <motion.div 
                className="pt-8"
                custom={3}
                variants={itemVariants}
              >
                <div className="w-full h-px bg-border mb-6"></div>
                
                {/* Features Naked */}
                <motion.div 
                  className="flex justify-between items-center w-full max-w-md text-base text-muted-foreground font-semibold"
                  custom={4}
                  variants={itemVariants}
                >
                  <span>+80 Proyectos</span>
                  <span className="text-border opacity-50">|</span>
                  <span>+18 Años</span>
                  <span className="text-border opacity-50">|</span>
                  <span>4 Países</span>
                </motion.div>
              </motion.div>
            </div>
            
            {/* Photo - 40% */}
            <motion.div 
              className="relative w-full h-72 md:h-[28rem] lg:h-[32rem] lg:col-span-2 rounded-lg overflow-hidden group"
              custom={1}
              variants={itemVariants}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10 pointer-events-none"></div>
              <div className="absolute inset-0 bg-gradient-to-l from-black/40 via-transparent to-transparent z-10 pointer-events-none"></div>
              <Image
                src="/images/HeyMouHome.webp"
                alt="Mou - Experto en Desarrollo Web y Estrategia Digital"
                fill
                className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              
              {/* Floating Badges - Simplified and refined */}
              <div className="absolute top-4 right-4 z-20">
                <div className="bg-background/80 backdrop-blur-sm border border-foreground/10 px-3 py-1.5 rounded-md text-xs font-medium text-foreground/90 flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500"></span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CalendarIcon className="h-3.5 w-3.5" />
                    Disponible en un mes
                  </span>
                </div>
              </div>
              
              <div className="absolute bottom-4 left-4 z-20">
                <div className="bg-background/80 backdrop-blur-sm border border-foreground/10 px-3 py-1.5 rounded-md text-xs font-medium text-foreground/90">
                  Respuesta inmediata
                </div>
              </div>
              
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Logo Carousel */}
      <section 
        id="clientes" 
        className="py-16 bg-background scroll-mt-20"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.2 }}
          >
            <LogoCarousel />
          </motion.div>
        </div>
      </section>

      {/* Manifiesto Section */}
      <section id="manifiesto" className="scroll-mt-20">
        <ManifestoSection />
      </section>
      
      <section id="expertise" className="scroll-mt-20">
        <ExpertiseSection />
      </section>
      
      <section id="casos" className="scroll-mt-20">
        <CaseStudiesSection />
      </section>
      
      <section id="testimonios" className="scroll-mt-20">
        <TestimonialsSection />
      </section>

      {/* Contact Section */}
      <section id="contacto" className="py-24 scroll-mt-20">
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <FadeIn delay={0.1}>
              <div className="inline-block bg-foreground/5 text-foreground/80 text-sm font-medium px-4 py-1.5 rounded-full mb-4">
                Conectemos
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                Hablemos de negocios
              </h2>
              <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                ¿Tienes una idea audaz que necesita claridad y estructura? Hablemos sobre cómo transformarla en realidad.
              </p>
            </FadeIn>
          </div>
          
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <div className="grid md:grid-cols-2 gap-12" id="formulario">
              <div className="text-left">
                <h3 className="text-2xl font-semibold mb-6">Conectemos</h3>
                <p className="text-lg text-muted-foreground mb-8">
                  ¿Tienes una idea audaz que necesita claridad y estructura? Hablemos sobre cómo transformarla en realidad.
                </p>
                
                <div className="space-y-4 text-left">
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-muted-foreground">hi@heymou.com</p>
                  </div>
                  <div>
                    <p className="font-medium">Respuesta</p>
                    <p className="text-muted-foreground">&lt; 24 horas</p>
                  </div>
                </div>
              </div>
              
              <motion.div 
                className="w-full"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, type: 'spring' }}
              >
                <ContactForm />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-background">
        <hr className="border-t border-border w-screen -ml-4" />
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16" style={{ maxWidth: '1240px' }}>
          <div className="flex flex-col md:flex-row md:justify-between md:items-start space-y-8 md:space-y-0">
            {/* Mobile Layout */}
            <>
              <FadeIn delay={0.1} className="w-full md:hidden">
                <div className="flex flex-col space-y-2">
                  <span className="font-bold text-xl">HeyMou</span>
                  <p className="text-sm text-muted-foreground">
                    Claridad en la Complejidad Digital
                  </p>
                </div>
              </FadeIn>

              <div className="w-full md:hidden">
                <FadeIn delay={0.2} className="w-full">
                  <div className="flex justify-start space-x-6 py-4">
                    <SocialLink href="https://github.com/heymouoficial" icon={GithubIcon} />
                    <SocialLink href="https://instagram.com/heymouoficial" icon={InstagramIcon} />
                    <SocialLink href="https://tiktok.com/@heymouoficial" icon={TiktokIcon} title="TikTok" />
                    <SocialLink href="https://twitter.com/heymouoficial" icon={TwitterIcon} />
                  </div>
                </FadeIn>

                <FadeIn delay={0.3} className="w-full">
                  <p className="text-sm text-muted-foreground pt-4 border-t border-border">
                    &copy; {new Date().getFullYear()} HeyMou. Hecho con ❤️ cuántico, por mi mismo.
                  </p>
                </FadeIn>
              </div>
            </>

            {/* Desktop/Tablet Layout - 50/50 */}
            <>
              {/* Left Side - Branding */}
              <div className="hidden md:flex md:flex-col md:w-1/2">
                <FadeIn delay={0.1}>
                  <div className="flex flex-col space-y-2">
                    <span className="font-bold text-xl">HeyMou</span>
                    <p className="text-sm text-muted-foreground">
                      Claridad en la Complejidad Digital
                    </p>
                  </div>
                </FadeIn>
              </div>
              
              {/* Right Side - Social Links and Copyright */}
              <div className="hidden md:flex md:flex-col md:items-end md:w-1/2 space-y-6">
                <FadeIn delay={0.2} className="w-full">
                  <div className="flex justify-end space-x-6 py-4">
                    <SocialLink href="https://github.com/heymouoficial" icon={GithubIcon} />
                    <SocialLink href="https://instagram.com/heymouoficial" icon={InstagramIcon} />
                    <SocialLink href="https://tiktok.com/@heymouoficial" icon={TiktokIcon} title="TikTok" />
                    <SocialLink href="https://twitter.com/heymouoficial" icon={TwitterIcon} />
                  </div>
                </FadeIn>

                <FadeIn delay={0.3} className="w-full">
                  <p className="text-sm text-muted-foreground pt-4 border-t border-border text-right">
                    &copy; {new Date().getFullYear()} HeyMou. Hecho con ❤️ cuántico, por mi mismo.
                  </p>
                </FadeIn>
              </div>
            </>
          </div>
        </div>
      </footer>
      
    </div>
  );
}

// Social Link Component
function SocialLink({ 
  href, 
  icon: Icon, 
  title 
}: { 
  href: string; 
  icon: React.ComponentType<{ className?: string }>;
  title?: string;
}) {
  // Safely extract domain for aria-label
  const domain = (() => {
    try {
      const url = new URL(href);
      return url.hostname.replace('www.', '');
    } catch {
      return 'external link';
    }
  })();

  return (
    <Link 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className="text-muted-foreground hover:text-foreground transition-colors"
      aria-label={title ? `Visit our ${title} profile` : `Visit our ${domain} profile`}
    >
      <Icon className="h-5 w-5" />
    </Link>
  );
}
