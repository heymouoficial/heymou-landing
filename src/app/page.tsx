import { Button } from "@/components/ui/button"
import { ContactForm } from "@/components/forms/ContactForm"
import { ChatWidget } from "@/components/chat/ChatWidget"
import { Announcement } from "@/components/ui/announcement"
import { SiteHeader } from "@/components/site-header"
import { LogoCarousel } from "@/components/logo-carousel"
import { ManifestoSection } from "@/components/manifesto-section"
import { ExpertiseSection } from "@/components/expertise-section"
import { CaseStudiesSection } from "@/components/case-studies-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import Image from "next/image"
import { ChevronRight, ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-foreground">
      <SiteHeader />
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
            {/* Content - 60% */}
            <div className="lg:col-span-3 space-y-8">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                Claridad en la
                <br />
                <span className="text-muted-foreground">Complejidad Digital</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl leading-relaxed">
                Transformo ideas complejas en soluciones digitales claras y efectivas.
                Estrategia, diseño y desarrollo que conecta con tu audiencia.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-8">
                <Button 
                  size="lg" 
                  className="px-8 py-6 text-lg group relative overflow-hidden transition-all duration-300 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 hover:shadow-lg hover:shadow-primary/20"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    Trabajemos Juntos
                    <ChevronRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -skew-x-12 -translate-x-full group-hover:translate-x-full"></span>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="px-8 py-6 text-lg group relative overflow-hidden border-foreground/20 hover:border-primary/30 hover:bg-foreground/5 transition-all duration-300"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    Ver Mi Trabajo
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -skew-x-12 -translate-x-full group-hover:translate-x-full"></span>
                </Button>
              </div>
              
              {/* Divider Line */}
              <div className="pt-8">
                <div className="w-full h-px bg-border mb-6"></div>
                
                {/* Features Naked */}
                <div className="flex justify-between items-center w-full max-w-md text-base text-muted-foreground font-semibold">
                  <span>+80 Proyectos</span>
                  <span className="text-border opacity-50">|</span>
                  <span>+18 Años</span>
                  <span className="text-border opacity-50">|</span>
                  <span>4 Países</span>
                </div>
              </div>
            </div>
            
            {/* Image - 40% */}
            <div className="lg:col-span-2 relative">
              {/* Floating Announcements */}
              <Announcement 
                position="right-top" 
                showLed={true} 
                ledColor="red"
                className="transform rotate-2"
              >
                Disponible en un mes
              </Announcement>
              
              <Announcement 
                position="bottom" 
                showLed={true} 
                ledColor="green"
                className="transform -rotate-1"
              >
                Respuesta inmediata
              </Announcement>
              
              {/* Hero Image with Black Fade */}
              <div className="relative aspect-[4/5] overflow-hidden rounded-lg">
                <Image
                  src="/images/HeyMouHome.webp"
                  alt="HeyMou"
                  fill
                  className="object-cover"
                  priority
                />
                {/* Black fade overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-l from-black/30 via-transparent to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logo Carousel */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <LogoCarousel />
        </div>
      </section>

      {/* Manifiesto Section */}
      <ManifestoSection />
      <ExpertiseSection />
      <CaseStudiesSection />
      <TestimonialsSection />

      {/* Contact Section */}
      <section className="py-24 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-bold mb-16 text-center">
            Iniciar Conversación
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold mb-6">Conectemos</h3>
              <p className="text-lg text-muted-foreground mb-8">
                ¿Tienes una idea audaz que necesita claridad y estructura? Hablemos sobre cómo transformarla en realidad.
              </p>
              
              <div className="space-y-4">
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-muted-foreground">hello@heymou.com</p>
                </div>
                <div>
                  <p className="font-medium">Respuesta</p>
                  <p className="text-muted-foreground">&lt; 24 horas</p>
                </div>
              </div>
            </div>
            
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 lg:px-8 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <p className="text-2xl font-bold">HeyMou</p>
              <p className="text-muted-foreground mt-2">
                Claridad en la Complejidad Digital
              </p>
            </div>
            
            <div className="mt-8 md:mt-0">
              <p className="text-sm text-muted-foreground">
                &copy; 2024 HeyMou. Minimalismo brutalista en acción.
              </p>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Chatbot Widget */}
      <ChatWidget />
    </div>
  );
}
