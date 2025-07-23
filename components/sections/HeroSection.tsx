'use client';

import { motion, Variants } from 'framer-motion';
import { ChevronRightIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

import { Button } from '../ui/Button';
import { useTranslation } from '../../src/hooks/useTranslation';
import FlickeringGrid from '../ui/FlickeringGrid';

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

export default function HeroSection() {
  const { t, locale } = useTranslation();

  return (
    <section
      id="inicio"
      className="min-h-[90vh] h-auto flex items-center justify-center pt-32 pb-20 md:py-32 scroll-mt-0 relative overflow-hidden"
      style={{ scrollSnapAlign: 'start' }}
    >
      {/* Flickering Grid Background */}
      <FlickeringGrid 
        squareSize={4}
        gridGap={6}
        flickerChance={0.3}
        color="rgb(0, 89, 255)"
        maxOpacity={0.4}
        className="absolute inset-0"
      />
      
      {/* Gradient overlay to fade the flickering grid on the right side */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent from-0% via-black/20 via-0% to-black pointer-events-none z-[1]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center"
          {...animationConfig}
        >
          {/* Content - 60% */}
          <div className="lg:col-span-3 space-y-8">
            <motion.h1
              className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-transparent"
              custom={0}
              variants={itemVariants}
            >
              {t('hero.title')}
              <br />
              <span className="bg-gradient-to-b from-neutral-400 to-neutral-600 bg-clip-text text-transparent">{t('hero.titleHighlight')}</span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-muted-foreground max-w-2xl leading-snug"
              custom={1}
              variants={itemVariants}
            >
              {t('hero.subtitle')}
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 pt-8"
              custom={2}
              variants={itemVariants}
            >
              <Button
                size="lg"
                className="px-8 py-6 text-lg group"
                asChild
              >
                <Link href={`/${locale}/contacto`}>
                  {t('hero.ctaPrimary')}
                  <ChevronRightIcon className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-6 text-lg group hover:!bg-background hover:backdrop-blur-sm hover:border-primary/60 hover:shadow-lg transition-all duration-300"
                asChild
              >
                <Link href={`/${locale}/casos-exito`}>
                  {t('hero.ctaSecondary')}
                  <ChevronRightIcon className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
            </motion.div>

            {/* Divider and Features */}
            <motion.div
              className="pt-8"
              custom={3}
              variants={itemVariants}
            >
              <div className="w-full h-px bg-border mb-6"></div>

              {/* Features Stats */}
              <motion.div
                className="inline-flex items-center gap-4 bg-background/80 backdrop-blur-sm border border-foreground/10 px-6 py-3 rounded-full text-sm font-semibold text-foreground/90"
                custom={4}
                variants={itemVariants}
              >
                <span>{t('hero.stats.projects')}</span>
                <span className="text-border opacity-50">|</span>
                <span>{t('hero.stats.experience')}</span>
                <span className="text-border opacity-50">|</span>
                <span>{t('hero.stats.countries')}</span>
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
              alt={locale === 'es' ? 'Experto en Desarrollo Web y Estrategia Digital' : 'Expert in Web Development and Digital Strategy'}
              fill
              className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
              priority
              sizes="(max-width: 1024px) 100vw, 40vw"
            />

            {/* Floating Badges */}
            <div className="absolute top-4 right-4 z-20">
              <div className="bg-background/80 backdrop-blur-sm border border-foreground/10 px-3 py-1.5 rounded-md text-xs font-medium text-foreground/90 flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500"></span>
                </span>
                <span>
                  {locale === 'es' ? 'Disponible en un mes' : 'Available within one month'}
                </span>
              </div>
            </div>

            <div className="absolute bottom-4 left-4 z-20">
              <div className="bg-background/80 backdrop-blur-sm border border-foreground/10 px-3 py-1.5 rounded-md text-xs font-medium text-foreground/90">
                {locale === 'es' ? 'Respuesta inmediata' : 'Immediate response'}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}