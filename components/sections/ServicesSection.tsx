'use client';

import { motion, Variants } from 'framer-motion';
import { Compass, Palette, Code, ChevronRightIcon } from 'lucide-react';
import React from 'react';

import { useTranslation } from '../../src/hooks/useTranslation';
import { Button } from '../ui/Button';
import { Component as GlassIcon } from '../ui/glass-icons';
import { GlowCard } from '../ui/spotlight-card';

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="h-full"
    >
      <GlowCard 
        customSize={true}
        className="group relative h-full flex flex-col transition-all duration-300"
      >
        <div className="relative z-10 flex flex-col flex-grow p-4">
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
      </GlowCard>
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
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-4">
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
            className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-foreground"
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
          <div>
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
          </div>
        </motion.div>
      </div>
    </section>
  );
}