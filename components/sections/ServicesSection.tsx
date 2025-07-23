'use client';

import { motion, Variants } from 'framer-motion';
import { Compass, Palette, Code, ChevronRightIcon } from 'lucide-react';
import React from 'react';

import { useTranslation } from '../../src/hooks/useTranslation';
import { Button } from '../ui/Button';
import { Component as GlassIcon } from '../ui/glass-icons';

// Service icons mapping
const serviceIcons = {
  0: Compass,
  1: Palette,
  2: Code,
};

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
    y: 30,
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
      delay: 0.1 + (i * 0.1)
    }
  })
};

// Service item type
interface ServiceItem {
  title: string;
  description: string;
  points: string[];
}

// Services data type
interface ServicesData {
  badge: string;
  title: string;
  subtitle: string;
  items: ServiceItem[];
}

// Service card component
interface ServiceCardProps {
  service: ServiceItem;
  index: number;
}

function ServiceCard({ service, index }: ServiceCardProps) {
  const IconComponent = serviceIcons[index as keyof typeof serviceIcons] || Compass;
  const cardRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const syncPointer = (e: PointerEvent) => {
      const { clientX: x, clientY: y } = e;

      if (cardRef.current) {
        cardRef.current.style.setProperty('--x', x.toFixed(2));
        cardRef.current.style.setProperty('--xp', (x / window.innerWidth).toFixed(2));
        cardRef.current.style.setProperty('--y', y.toFixed(2));
        cardRef.current.style.setProperty('--yp', (y / window.innerHeight).toFixed(2));
      }
    };

    document.addEventListener('pointermove', syncPointer);
    return () => document.removeEventListener('pointermove', syncPointer);
  }, []);

  const spotlightStyles = {
    '--base': 220,
    '--spread': 200,
    '--radius': '16',
    '--border': '1',
    '--backdrop': 'rgba(255, 255, 255, 0.05)',
    '--backup-border': 'rgba(255, 255, 255, 0.1)',
    '--size': '300',
    '--spotlight-size': 'calc(var(--size, 300) * 1px)',
    '--hue': 'calc(var(--base) + (var(--xp, 0) * var(--spread, 0)))',
    backgroundImage: `radial-gradient(
      var(--spotlight-size) var(--spotlight-size) at
      calc(var(--x, 0) * 1px)
      calc(var(--y, 0) * 1px),
      rgba(0, 89, 255, 0.15), transparent
    )`,
    backgroundColor: 'var(--backdrop)',
    backgroundSize: '100% 100%',
    backgroundPosition: '50% 50%',
    backgroundAttachment: 'fixed',
    border: '1px solid var(--backup-border)',
    position: 'relative' as const,
    touchAction: 'none' as const,
  } as React.CSSProperties;

  return (
    <motion.div
      ref={cardRef}
      data-spotlight
      style={spotlightStyles}
      className="group relative p-8 rounded-2xl bg-gradient-to-br from-white/5 to-transparent hover:from-white/10 transition-all duration-300 overflow-hidden h-full flex flex-col hover:shadow-lg hover:shadow-primary/10"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="relative z-10 flex flex-col flex-grow">
        {/* Glass Icon */}
        <div className="mb-6 flex justify-center px-4 py-4 overflow-visible">
          <GlassIcon
            items={[{
              icon: <IconComponent className="w-6 h-6 text-white" />,
              color: "blue",
            }]}
            className="!grid-cols-1 !gap-0 !py-0 !overflow-visible"
          />
        </div>

        {/* Content */}
        <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors duration-300">
          {service.title}
        </h3>

        <p className="text-muted-foreground leading-relaxed mb-6 flex-grow">
          {service.description}
        </p>

        {/* Points list */}
        <ul className="text-muted-foreground space-y-2 mt-auto">
          {service.points.map((point, i) => (
            <li
              key={i}
              className="flex items-start group-hover:text-foreground transition-colors duration-300"
            >
              <span className="text-primary mr-3 mt-1">•</span>
              <span className="text-sm">{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Enhanced spotlight border effect */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(
            300px 300px at
            calc(var(--x, 0) * 1px)
            calc(var(--y, 0) * 1px),
            rgba(0, 89, 255, 0.3), transparent 70%
          )`,
          backgroundAttachment: 'fixed',
        }}
      />
    </motion.div>
  );
}

export default function ServicesSection() {
  const { t } = useTranslation();

  // Get services data using dot notation for nested messages
  const servicesData: ServicesData = {
    badge: t('servicesSection.badge'),
    title: t('servicesSection.title'),
    subtitle: t('servicesSection.subtitle'),
    items: [
      {
        title: t('servicesSection.items.0.title'),
        description: t('servicesSection.items.0.description'),
        points: [
          t('servicesSection.items.0.points.0'),
          t('servicesSection.items.0.points.1'),
          t('servicesSection.items.0.points.2')
        ]
      },
      {
        title: t('servicesSection.items.1.title'),
        description: t('servicesSection.items.1.description'),
        points: [
          t('servicesSection.items.1.points.0'),
          t('servicesSection.items.1.points.1'),
          t('servicesSection.items.1.points.2')
        ]
      },
      {
        title: t('servicesSection.items.2.title'),
        description: t('servicesSection.items.2.description'),
        points: [
          t('servicesSection.items.2.points.0'),
          t('servicesSection.items.2.points.1'),
          t('servicesSection.items.2.points.2')
        ]
      }
    ]
  };

  return (
    <section
      id="servicios"
      className="py-24 scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
        >
          <motion.div
            className="inline-block bg-foreground/5 text-foreground/80 text-sm font-medium px-4 py-1.5 rounded-full mb-4"
            custom={0}
            variants={itemVariants}
          >
            {servicesData.badge}
          </motion.div>

          <motion.h2
            className="text-4xl md:text-5xl font-bold tracking-tight mb-6"
            custom={1}
            variants={itemVariants}
          >
            {servicesData.title}
          </motion.h2>

          <motion.p
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            custom={2}
            variants={itemVariants}
          >
            {servicesData.subtitle}
          </motion.p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
        >
          {servicesData.items.map((service: ServiceItem, index: number) => (
            <ServiceCard
              key={index}
              service={service}
              index={index}
            />
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, type: 'spring' }}
        >
          <p className="text-muted-foreground mb-6 text-lg">
            {t('servicesSection.cta.question')}
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              size="lg"
              className="px-8 py-4 group"
              asChild
            >
              <a href="#contacto">
                {t('servicesSection.cta.button')}
                <ChevronRightIcon className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}