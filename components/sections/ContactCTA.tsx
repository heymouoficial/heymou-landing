'use client';

import { motion } from 'framer-motion';
import { Mail, Calendar, MessageCircle } from 'lucide-react';

import { useTranslation } from '../../src/hooks/useTranslation';
import { Button } from '../ui/Button';

export function ContactCTA() {
  const { locale } = useTranslation();

  return (
    <section id="contacto" className="py-24 scroll-mt-20">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Badge */}
          <motion.div
            className="inline-block bg-foreground/5 text-foreground/80 text-sm font-medium px-4 py-1.5 rounded-full mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            {locale === 'es' ? '¿Listo para empezar?' : 'Ready to get started?'}
          </motion.div>

          {/* Title */}
          <motion.h2
            className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            {locale === 'es' 
              ? 'Transformemos tu idea en realidad digital'
              : 'Let\'s transform your idea into digital reality'
            }
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            {locale === 'es'
              ? 'Cuéntame sobre tu proyecto y descubre cómo puedo ayudarte a materializarlo. Respuesta garantizada en menos de 24 horas.'
              : 'Tell me about your project and discover how I can help you materialize it. Response guaranteed in less than 24 hours.'
            }
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            {/* Primary CTA - Email */}
            <Button
              size="lg"
              className="px-8 py-6 text-lg group"
              asChild
            >
              <a href="mailto:hi@heymou.com" className="flex items-center">
                <Mail className="mr-3 h-5 w-5" />
                {locale === 'es' ? 'Escríbeme a hi@heymou.com' : 'Email me at hi@heymou.com'}
              </a>
            </Button>

            {/* Secondary CTA - Calendar */}
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-6 text-lg group"
              asChild
            >
              <a 
                href="https://calendly.com/heymou" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center"
              >
                <Calendar className="mr-3 h-5 w-5" />
                {locale === 'es' ? 'Agenda una consulta gratuita' : 'Schedule a free consultation'}
              </a>
            </Button>
          </motion.div>

          {/* Contact Info Cards */}
          <motion.div
            className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            {/* Email Card */}
            <div className="bg-background/50 border border-border rounded-lg p-6 text-center hover:bg-background/80 transition-colors">
              <Mail className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">
                {locale === 'es' ? 'Email Directo' : 'Direct Email'}
              </h3>
              <p className="text-muted-foreground text-sm mb-3">
                {locale === 'es' 
                  ? 'Respuesta en menos de 24 horas'
                  : 'Response in less than 24 hours'
                }
              </p>
              <a 
                href="mailto:hi@heymou.com" 
                className="text-primary hover:underline font-medium"
              >
                hi@heymou.com
              </a>
            </div>

            {/* Calendar Card */}
            <div className="bg-background/50 border border-border rounded-lg p-6 text-center hover:bg-background/80 transition-colors">
              <Calendar className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">
                {locale === 'es' ? 'Consulta Gratuita' : 'Free Consultation'}
              </h3>
              <p className="text-muted-foreground text-sm mb-3">
                {locale === 'es' 
                  ? '30 minutos para hablar de tu proyecto'
                  : '30 minutes to discuss your project'
                }
              </p>
              <a 
                href="https://calendly.com/heymou" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                {locale === 'es' ? 'Agendar ahora' : 'Schedule now'}
              </a>
            </div>

            {/* Chat Card */}
            <div className="bg-background/50 border border-border rounded-lg p-6 text-center hover:bg-background/80 transition-colors">
              <MessageCircle className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">
                {locale === 'es' ? 'Chat Inteligente' : 'Smart Chat'}
              </h3>
              <p className="text-muted-foreground text-sm mb-3">
                {locale === 'es' 
                  ? 'Pregúntame lo que necesites'
                  : 'Ask me anything you need'
                }
              </p>
              <span className="text-primary font-medium">
                {locale === 'es' ? 'Disponible 24/7' : 'Available 24/7'}
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}