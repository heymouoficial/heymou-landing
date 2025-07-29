'use client';

import { motion, Variants } from 'framer-motion';
import { Clock, ChevronRightIcon, BookOpen, Filter } from 'lucide-react';
import React, { useState } from 'react';
import Link from 'next/link';

import { GlowCard } from '../ui/spotlight-card';
import { useTranslation } from '../../src/hooks/useTranslation';
import { Button } from '../ui/Button';
import { BlogPost, BlogSectionData } from '../../types';

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

// Category colors mapping
const categoryColors = {
  strategy: 'bg-primary/10 text-primary border-primary/20',
  development: 'bg-primary/10 text-primary border-primary/20',
  automation: 'bg-primary/10 text-primary border-primary/20',
  design: 'bg-primary/10 text-primary border-primary/20',
  business: 'bg-primary/10 text-primary border-primary/20',
  all: 'bg-primary/10 text-primary border-primary/20'
};

// Blog card component
interface BlogCardProps {
  post: BlogPost;
  index: number;
  locale: string;
  readingTimeLabel: string;
}

function BlogCard({ post, index, locale, readingTimeLabel }: BlogCardProps) {
  // Map post titles to slugs
  const getSlugFromTitle = (title: string): string => {
    const slugMap: { [key: string]: string } = {
      '¿Por qué tu web necesita ser más que bonita?': 'por-que-tu-web-necesita-ser-mas-que-bonita',
      'Automatización: Tu mejor empleado que nunca duerme': 'automatizacion-tu-mejor-empleado',
      'BuildShip vs Zapier: ¿Cuál elegir para tu negocio?': 'buildship-vs-zapier-cual-elegir',
      'Next.js explicado para emprendedores': 'nextjs-explicado-para-emprendedores',
      'UX que vende: Diseño centrado en conversión': 'ux-que-vende-diseno-centrado-en-conversion',
      'MVP: Cómo lanzar sin morir en el intento': 'mvp-guia-emprendedores',
      'Why your website needs to be more than pretty?': 'why-your-website-needs-to-be-more-than-pretty',
      'Automation: Your best employee that never sleeps': 'automation-your-best-employee-that-never-sleeps',
      'BuildShip vs Zapier: Which to choose for your business?': 'buildship-vs-zapier-which-to-choose',
      'Next.js explained for entrepreneurs': 'nextjs-explained-for-entrepreneurs',
      'UX that sells: Conversion-centered design': 'ux-that-sells-conversion-centered-design',
      'MVP: How to launch without dying trying': 'mvp-guide-for-entrepreneurs'
    };
    return slugMap[title] || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  };

  const slug = getSlugFromTitle(post.title);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Link href={`/${locale}/blog/${slug}`} className="block h-full">
        <GlowCard
          customSize={true}
          className={`group relative h-full flex flex-col cursor-pointer transition-all duration-300 ${post.featured ? 'ring-2 ring-white/30' : ''}`}
        >
        <div className="relative z-10 flex flex-col flex-grow p-2">
          {/* Header with category and reading time */}
          <div className="flex items-center justify-between mb-4">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${categoryColors[post.category as keyof typeof categoryColors] || categoryColors.all
              }`}>
              {post.category}
            </span>

            <div className="flex items-center text-muted-foreground text-xs">
              <Clock className="w-3 h-3 mr-1" />
              <span>{post.readingTime} {readingTimeLabel}</span>
            </div>
          </div>

          {/* Featured star banner - positioned above the top left corner */}
          {post.featured && (
            <div className="absolute -top-5 -left-5 z-20">
              <div className="bg-[#0059FF] text-white px-3 py-1 rounded-tl-lg rounded-br-lg flex items-center gap-1 shadow-lg">
                <svg className="w-3 h-3 text-white fill-white" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span className="text-xs font-medium">Featured</span>
              </div>
            </div>
          )}

          {/* Content */}
          <h3 className="text-lg font-semibold mb-3 group-hover:text-primary transition-colors duration-300 line-clamp-2">
            {post.title}
          </h3>

          <p className="text-muted-foreground leading-relaxed mb-4 flex-grow line-clamp-3 text-sm">
            {post.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-4">
            {post.tags.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className="inline-block bg-foreground/5 text-foreground/70 text-xs px-2 py-1 rounded-md"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Footer with date and read more */}
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-foreground/10">
            <span className="text-xs text-muted-foreground" suppressHydrationWarning>
              {new Date(post.publishedAt).toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>

            <div className="flex items-center text-primary text-sm font-medium group-hover:translate-x-1 transition-transform duration-300">
              <span className="mr-1">{locale === 'es' ? 'Leer más' : 'Read more'}</span>
              <ChevronRightIcon className="w-4 h-4" />
            </div>
          </div>
        </div>
      </GlowCard>
      </Link>
    </motion.div>
  );
}

// Category filter component
interface CategoryFilterProps {
  categories: BlogSectionData['categories'];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  locale: string;
}

function CategoryFilter({ categories, activeCategory, onCategoryChange, locale }: CategoryFilterProps) {
  const categoryKeys = Object.keys(categories) as Array<keyof typeof categories>;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-8">
      <div className="flex items-center text-muted-foreground mr-2">
        <Filter className="w-4 h-4 mr-2" />
        <span className="text-sm font-medium">{locale === 'es' ? 'Filtrar:' : 'Filter:'}</span>
      </div>

      {categoryKeys.map((categoryKey) => (
        <button
          key={categoryKey}
          onClick={() => onCategoryChange(categoryKey)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 border ${activeCategory === categoryKey
            ? 'bg-primary text-primary-foreground border-primary'
            : 'bg-background/50 text-muted-foreground border-foreground/20 hover:bg-foreground/5 hover:text-foreground'
            }`}
        >
          {categories[categoryKey]}
        </button>
      ))}
    </div>
  );
}

export default function BlogSection() {
  const { locale } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('all');

  // Static blog data to avoid translation issues
  const blogData: BlogSectionData = {
    badge: locale === 'es' ? 'Tips Tecnológicos Exprés' : 'Express Tech Tips',
    title: locale === 'es' ? 'Desmitificando la Tecnología' : 'Demystifying Technology',
    subtitle: locale === 'es'
      ? 'Conocimiento práctico y accesible para emprendedores que quieren entender la tecnología sin perderse en tecnicismos. Te explico lo complejo de forma simple.'
      : 'Practical and accessible knowledge for entrepreneurs who want to understand technology without getting lost in technicalities. I explain the complex in simple terms.',
    categories: {
      all: locale === 'es' ? 'Todos' : 'All',
      strategy: locale === 'es' ? 'Estrategia' : 'Strategy',
      development: locale === 'es' ? 'Desarrollo' : 'Development',
      automation: locale === 'es' ? 'Automatización' : 'Automation',
      design: locale === 'es' ? 'Diseño' : 'Design',
      business: locale === 'es' ? 'Negocio' : 'Business'
    },
    readingTime: locale === 'es' ? 'min de lectura' : 'min read',
    posts: locale === 'es' ? [
      {
        id: '1',
        title: '¿Por qué tu web necesita ser más que bonita?',
        description: 'Descubre por qué una web exitosa va más allá del diseño visual y cómo la estrategia tecnológica puede transformar tu negocio.',
        category: 'strategy',
        readingTime: 5,
        publishedAt: '2025-07-15',
        featured: true,
        tags: ['estrategia', 'web', 'negocio']
      },
      {
        id: '2',
        title: 'Automatización: Tu mejor empleado que nunca duerme',
        description: 'Cómo la automatización puede liberar tu tiempo para enfocarte en lo que realmente importa en tu emprendimiento.',
        category: 'automation',
        readingTime: 7,
        publishedAt: '2025-07-10',
        featured: true,
        tags: ['automatización', 'productividad', 'emprendimiento']
      },
      {
        id: '3',
        title: 'BuildShip vs Zapier: ¿Cuál elegir para tu negocio?',
        description: 'Comparación práctica entre las principales herramientas de automatización y cuál se adapta mejor a tu proyecto.',
        category: 'automation',
        readingTime: 6,
        publishedAt: '2025-07-05',
        featured: false,
        tags: ['buildship', 'zapier', 'herramientas']
      },
      {
        id: '4',
        title: 'Next.js explicado para emprendedores',
        description: 'Qué es Next.js y por qué podría ser la mejor decisión tecnológica para tu startup, explicado sin tecnicismos.',
        category: 'development',
        readingTime: 8,
        publishedAt: '2024-12-20',
        featured: true,
        tags: ['nextjs', 'desarrollo', 'startup']
      },
      {
        id: '5',
        title: 'UX que vende: Diseño centrado en conversión',
        description: 'Los principios de diseño UX que realmente importan para convertir visitantes en clientes pagadores.',
        category: 'design',
        readingTime: 6,
        publishedAt: '2024-12-15',
        featured: false,
        tags: ['ux', 'conversión', 'diseño']
      },
      {
        id: '6',
        title: 'MVP: Cómo lanzar sin morir en el intento',
        description: 'La estrategia para crear tu Producto Mínimo Viable sin gastar una fortuna ni perder años de desarrollo.',
        category: 'business',
        readingTime: 9,
        publishedAt: '2024-12-10',
        featured: false,
        tags: ['mvp', 'startup', 'estrategia']
      }
    ] : [
      {
        id: '1',
        title: 'Why your website needs to be more than pretty?',
        description: 'Discover why a successful website goes beyond visual design and how technology strategy can transform your business.',
        category: 'strategy',
        readingTime: 5,
        publishedAt: '2025-07-15',
        featured: true,
        tags: ['strategy', 'web', 'business']
      },
      {
        id: '2',
        title: 'Automation: Your best employee that never sleeps',
        description: 'How automation can free up your time to focus on what really matters in your entrepreneurship.',
        category: 'automation',
        readingTime: 7,
        publishedAt: '2025-07-10',
        featured: true,
        tags: ['automation', 'productivity', 'entrepreneurship']
      },
      {
        id: '3',
        title: 'BuildShip vs Zapier: Which to choose for your business?',
        description: 'Practical comparison between the main automation tools and which one best fits your project.',
        category: 'automation',
        readingTime: 6,
        publishedAt: '2025-07-05',
        featured: false,
        tags: ['buildship', 'zapier', 'tools']
      },
      {
        id: '4',
        title: 'Next.js explained for entrepreneurs',
        description: 'What Next.js is and why it could be the best technological decision for your startup, explained without technicalities.',
        category: 'development',
        readingTime: 8,
        publishedAt: '2024-12-20',
        featured: true,
        tags: ['nextjs', 'development', 'startup']
      },
      {
        id: '5',
        title: 'UX that sells: Conversion-centered design',
        description: 'The UX design principles that really matter to convert visitors into paying customers.',
        category: 'design',
        readingTime: 6,
        publishedAt: '2024-12-15',
        featured: false,
        tags: ['ux', 'conversion', 'design']
      },
      {
        id: '6',
        title: 'MVP: How to launch without dying trying',
        description: 'The strategy to create your Minimum Viable Product without spending a fortune or losing years of development.',
        category: 'business',
        readingTime: 9,
        publishedAt: '2024-12-10',
        featured: false,
        tags: ['mvp', 'startup', 'strategy']
      }
    ],
    cta: {
      question: locale === 'es' ? '¿Quieres más consejos tecnológicos personalizados?' : 'Want more personalized tech advice?',
      button: locale === 'es' ? 'Hablemos de tu proyecto' : "Let's talk about your project"
    }
  };

  // Filter posts based on active category
  const filteredPosts = activeCategory === 'all'
    ? blogData.posts
    : blogData.posts.filter(post => post.category === activeCategory);

  return (
    <section
      id="blog"
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
            {blogData.badge}
          </motion.div>

          <motion.h2
            className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-foreground"
            custom={1}
            variants={itemVariants}
          >
            {blogData.title}
          </motion.h2>

          <motion.p
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            custom={2}
            variants={itemVariants}
          >
            {blogData.subtitle}
          </motion.p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          className="flex justify-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <CategoryFilter
            categories={blogData.categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            locale={locale}
          />
        </motion.div>

        {/* Blog Posts Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
          key={activeCategory} // Re-animate when category changes
        >
          {filteredPosts.map((post: BlogPost, index: number) => (
            <BlogCard
              key={post.id}
              post={post}
              index={index}
              locale={locale}
              readingTimeLabel={blogData.readingTime}
            />
          ))}
        </motion.div>

        {/* Empty state */}
        {filteredPosts.length === 0 && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              {locale === 'es' ? 'No hay artículos en esta categoría' : 'No articles in this category'}
            </h3>
            <p className="text-muted-foreground">
              {locale === 'es'
                ? 'Prueba seleccionando otra categoría o vuelve pronto para más contenido.'
                : 'Try selecting another category or come back soon for more content.'}
            </p>
          </motion.div>
        )}

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, type: 'spring' }}
        >
          <p className="text-muted-foreground mb-6 text-lg">
            {blogData.cta.question}
          </p>
          <div>
            <Button
              size="lg"
              className="px-8 py-4 group"
              asChild
            >
              <Link href={`/${locale}/contacto`}>
                {blogData.cta.button}
                <ChevronRightIcon className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}