'use client';

import { motion, Variants } from 'framer-motion';
import { ChevronRightIcon, Clock, Users, TrendingUp, Quote } from 'lucide-react';
import React from 'react';

import { useTranslation } from '../../src/hooks/useTranslation';
import { Button } from '../ui/Button';
import { GlowCard } from '../ui/spotlight-card';

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

// Success story item type
interface SuccessStoryItem {
    title: string;
    clientName: string;
    industry: string;
    location: string;
    status: 'live' | 'development' | 'upcoming';
    challenge: string;
    solution: string;
    results: string[];
    testimonial: {
        quote: string;
        author: string;
        position: string;
    };
    duration: string;
    technologies: string[];
    link?: string;
}

// Success stories data type
interface SuccessStoriesData {
    badge: string;
    title: string;
    subtitle: string;
    stories: SuccessStoryItem[];
    cta: {
        question: string;
        button: string;
    };
}

// Success story card component
interface SuccessStoryCardProps {
    story: SuccessStoryItem;
    index: number;
}

function SuccessStoryCard({ story, index }: SuccessStoryCardProps) {

    // Status badge configuration
    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'live':
                return {
                    label: 'En Línea',
                    color: 'bg-green-500/20 text-green-400 border-green-500/30',
                    dot: 'bg-green-500'
                };
            case 'development':
                return {
                    label: 'En Desarrollo',
                    color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
                    dot: 'bg-yellow-500'
                };
            case 'upcoming':
                return {
                    label: 'Próximo Lanzamiento',
                    color: 'bg-primary/20 text-primary border-primary/30',
                    dot: 'bg-primary'
                };
            default:
                return {
                    label: 'En Línea',
                    color: 'bg-green-500/20 text-green-400 border-green-500/30',
                    dot: 'bg-green-500'
                };
        }
    };

    const statusConfig = getStatusConfig(story.status);

    const CardContent = () => (
        <GlowCard
            customSize={true}
            className="group relative h-full flex flex-col transition-all duration-300 hover:scale-[1.02]"
        >
                <div className="relative z-10 flex flex-col flex-grow p-4">
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full border border-primary/20">
                                    {story.industry}
                                </span>
                                <span className={`text-xs font-medium px-2 py-1 rounded-full border ${statusConfig.color} flex items-center gap-1`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`}></span>
                                    {statusConfig.label}
                                </span>
                            </div>
                            <div className="flex items-center text-xs text-muted-foreground">
                                <Clock className="w-3 h-3 mr-1" />
                                {story.duration}
                            </div>
                        </div>

                        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors duration-300">
                            {story.title}
                        </h3>

                        <p className="text-sm text-muted-foreground mb-2">
                            <span className="font-medium text-foreground">{story.clientName}</span> • {story.location}
                        </p>
                    </div>

                    {/* Challenge & Solution */}
                    <div className="flex-grow space-y-4 mb-6">
                        <div>
                            <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center">
                                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                                Desafío
                            </h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {story.challenge}
                            </p>
                        </div>

                        <div>
                            <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center">
                                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                Solución
                            </h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {story.solution}
                            </p>
                        </div>
                    </div>

                    {/* Results */}
                    <div className="mb-6">
                        <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center">
                            <TrendingUp className="w-4 h-4 mr-2 text-primary" />
                            Resultados
                        </h4>
                        <div className="grid gap-2">
                            {story.results.map((result, i) => (
                                <div
                                    key={i}
                                    className="flex items-center text-sm bg-primary/5 rounded-lg p-2 border border-primary/10"
                                >
                                    <span className="text-primary mr-2">✓</span>
                                    <span className="text-foreground font-medium">{result}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Technologies */}
                    <div className="mb-6">
                        <div className="flex flex-wrap gap-1">
                            {story.technologies.map((tech, i) => (
                                <span
                                    key={i}
                                    className="text-xs bg-background/50 text-muted-foreground px-2 py-1 rounded border border-primary/20"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Testimonial */}
                    <div className="mt-auto">
                        <div className="bg-background/30 rounded-lg p-4 border border-primary/20">
                            <Quote className="w-4 h-4 text-primary mb-2" />
                            <blockquote className="text-sm text-foreground/90 italic leading-relaxed mb-3">
                                &ldquo;{story.testimonial.quote}&rdquo;
                            </blockquote>
                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mr-3">
                                    <Users className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-foreground">
                                        {story.testimonial.author}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {story.testimonial.position}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CTA Button - Only show if link exists and card is not already wrapped in link */}
                    {story.link && (
                        <div className="mt-6 pt-4 border-t border-primary/10">
                            <Button
                                size="sm"
                                className="w-full group py-3 px-4 h-auto text-sm font-medium transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
                            >
                                <span className="inline-flex items-center justify-center gap-2">
                                    <span>Visitar sitio web</span>
                                    <ChevronRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </span>
                            </Button>
                        </div>
                    )}
                </div>
            </GlowCard>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="h-full"
        >
            {story.link ? (
                <a
                    href={story.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block h-full"
                >
                    <CardContent />
                </a>
            ) : (
                <CardContent />
            )}
        </motion.div>
    );
}

export default function SuccessStoriesSection() {
    const { t, locale } = useTranslation();

    // Get success stories data using dot notation for nested messages
    const successStoriesData: SuccessStoriesData = {
        badge: t('successStoriesSection.badge'),
        title: t('successStoriesSection.title'),
        subtitle: t('successStoriesSection.subtitle'),
        stories: [
            {
                title: t('successStoriesSection.stories.0.title'),
                clientName: t('successStoriesSection.stories.0.clientName'),
                industry: t('successStoriesSection.stories.0.industry'),
                location: t('successStoriesSection.stories.0.location'),
                status: t('successStoriesSection.stories.0.status') as 'live' | 'development' | 'upcoming',
                challenge: t('successStoriesSection.stories.0.challenge'),
                solution: t('successStoriesSection.stories.0.solution'),
                results: [
                    t('successStoriesSection.stories.0.results.0'),
                    t('successStoriesSection.stories.0.results.1'),
                    t('successStoriesSection.stories.0.results.2')
                ],
                testimonial: {
                    quote: t('successStoriesSection.stories.0.testimonial.quote'),
                    author: t('successStoriesSection.stories.0.testimonial.author'),
                    position: t('successStoriesSection.stories.0.testimonial.position')
                },
                duration: t('successStoriesSection.stories.0.duration'),
                technologies: [
                    t('successStoriesSection.stories.0.technologies.0'),
                    t('successStoriesSection.stories.0.technologies.1'),
                    t('successStoriesSection.stories.0.technologies.2')
                ],
                link: 'https://caminoelportaldelalma.com'
            },
            {
                title: t('successStoriesSection.stories.1.title'),
                clientName: t('successStoriesSection.stories.1.clientName'),
                industry: t('successStoriesSection.stories.1.industry'),
                location: t('successStoriesSection.stories.1.location'),
                status: t('successStoriesSection.stories.1.status') as 'live' | 'development' | 'upcoming',
                challenge: t('successStoriesSection.stories.1.challenge'),
                solution: t('successStoriesSection.stories.1.solution'),
                results: [
                    t('successStoriesSection.stories.1.results.0'),
                    t('successStoriesSection.stories.1.results.1'),
                    t('successStoriesSection.stories.1.results.2')
                ],
                testimonial: {
                    quote: t('successStoriesSection.stories.1.testimonial.quote'),
                    author: t('successStoriesSection.stories.1.testimonial.author'),
                    position: t('successStoriesSection.stories.1.testimonial.position')
                },
                duration: t('successStoriesSection.stories.1.duration'),
                technologies: [
                    t('successStoriesSection.stories.1.technologies.0'),
                    t('successStoriesSection.stories.1.technologies.1'),
                    t('successStoriesSection.stories.1.technologies.2')
                ],
                link: 'https://nopasi.com'
            },
            {
                title: t('successStoriesSection.stories.2.title'),
                clientName: t('successStoriesSection.stories.2.clientName'),
                industry: t('successStoriesSection.stories.2.industry'),
                location: t('successStoriesSection.stories.2.location'),
                status: t('successStoriesSection.stories.2.status') as 'live' | 'development' | 'upcoming',
                challenge: t('successStoriesSection.stories.2.challenge'),
                solution: t('successStoriesSection.stories.2.solution'),
                results: [
                    t('successStoriesSection.stories.2.results.0'),
                    t('successStoriesSection.stories.2.results.1'),
                    t('successStoriesSection.stories.2.results.2')
                ],
                testimonial: {
                    quote: t('successStoriesSection.stories.2.testimonial.quote'),
                    author: t('successStoriesSection.stories.2.testimonial.author'),
                    position: t('successStoriesSection.stories.2.testimonial.position')
                },
                duration: t('successStoriesSection.stories.2.duration'),
                technologies: [
                    t('successStoriesSection.stories.2.technologies.0'),
                    t('successStoriesSection.stories.2.technologies.1'),
                    t('successStoriesSection.stories.2.technologies.2')
                ],
                link: 'https://miniuniverso.org'
            },
            {
                title: t('successStoriesSection.stories.3.title'),
                clientName: t('successStoriesSection.stories.3.clientName'),
                industry: t('successStoriesSection.stories.3.industry'),
                location: t('successStoriesSection.stories.3.location'),
                status: t('successStoriesSection.stories.3.status') as 'live' | 'development' | 'upcoming',
                challenge: t('successStoriesSection.stories.3.challenge'),
                solution: t('successStoriesSection.stories.3.solution'),
                results: [
                    t('successStoriesSection.stories.3.results.0'),
                    t('successStoriesSection.stories.3.results.1'),
                    t('successStoriesSection.stories.3.results.2')
                ],
                testimonial: {
                    quote: t('successStoriesSection.stories.3.testimonial.quote'),
                    author: t('successStoriesSection.stories.3.testimonial.author'),
                    position: t('successStoriesSection.stories.3.testimonial.position')
                },
                duration: t('successStoriesSection.stories.3.duration'),
                technologies: [
                    t('successStoriesSection.stories.3.technologies.0'),
                    t('successStoriesSection.stories.3.technologies.1'),
                    t('successStoriesSection.stories.3.technologies.2')
                ]
            },
            {
                title: t('successStoriesSection.stories.4.title'),
                clientName: t('successStoriesSection.stories.4.clientName'),
                industry: t('successStoriesSection.stories.4.industry'),
                location: t('successStoriesSection.stories.4.location'),
                status: t('successStoriesSection.stories.4.status') as 'live' | 'development' | 'upcoming',
                challenge: t('successStoriesSection.stories.4.challenge'),
                solution: t('successStoriesSection.stories.4.solution'),
                results: [
                    t('successStoriesSection.stories.4.results.0'),
                    t('successStoriesSection.stories.4.results.1'),
                    t('successStoriesSection.stories.4.results.2')
                ],
                testimonial: {
                    quote: t('successStoriesSection.stories.4.testimonial.quote'),
                    author: t('successStoriesSection.stories.4.testimonial.author'),
                    position: t('successStoriesSection.stories.4.testimonial.position')
                },
                duration: t('successStoriesSection.stories.4.duration'),
                technologies: [
                    t('successStoriesSection.stories.4.technologies.0'),
                    t('successStoriesSection.stories.4.technologies.1'),
                    t('successStoriesSection.stories.4.technologies.2')
                ]
            },
            {
                title: t('successStoriesSection.stories.5.title'),
                clientName: t('successStoriesSection.stories.5.clientName'),
                industry: t('successStoriesSection.stories.5.industry'),
                location: t('successStoriesSection.stories.5.location'),
                status: t('successStoriesSection.stories.5.status') as 'live' | 'development' | 'upcoming',
                challenge: t('successStoriesSection.stories.5.challenge'),
                solution: t('successStoriesSection.stories.5.solution'),
                results: [
                    t('successStoriesSection.stories.5.results.0'),
                    t('successStoriesSection.stories.5.results.1'),
                    t('successStoriesSection.stories.5.results.2')
                ],
                testimonial: {
                    quote: t('successStoriesSection.stories.5.testimonial.quote'),
                    author: t('successStoriesSection.stories.5.testimonial.author'),
                    position: t('successStoriesSection.stories.5.testimonial.position')
                },
                duration: t('successStoriesSection.stories.5.duration'),
                technologies: [
                    t('successStoriesSection.stories.5.technologies.0'),
                    t('successStoriesSection.stories.5.technologies.1'),
                    t('successStoriesSection.stories.5.technologies.2')
                ],
                link: 'https://biohackingcuantico.com'
            }
        ],
        cta: {
            question: t('successStoriesSection.cta.question'),
            button: t('successStoriesSection.cta.button')
        }
    };

    // All stories are displayed in a single grid

    return (
        <section
            id="casos-exito"
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
                        {successStoriesData.badge}
                    </motion.div>

                    <motion.h2
                        className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-foreground"
                        custom={1}
                        variants={itemVariants}
                    >
                        {successStoriesData.title}
                    </motion.h2>

                    <motion.p
                        className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
                        custom={2}
                        variants={itemVariants}
                    >
                        {successStoriesData.subtitle}
                    </motion.p>
                </motion.div>

                {/* Success Stories Grid - Show all stories in a single grid */}
                <motion.div
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-100px' }}
                    variants={containerVariants}
                >
                    {successStoriesData.stories.map((story: SuccessStoryItem, index: number) => (
                        <SuccessStoryCard
                            key={index}
                            story={story}
                            index={index}
                        />
                    ))}
                </motion.div>

                {/* Bottom CTA */}
                <motion.div
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6, type: 'spring' }}
                >
                    <p className="text-muted-foreground mb-6 text-lg">
                        {successStoriesData.cta.question}
                    </p>
                    <div>
                        <Button
                            size="lg"
                            className="px-8 py-4 group"
                            asChild
                        >
                            <a href={`/${locale}/contacto`}>
                                {successStoriesData.cta.button}
                                <ChevronRightIcon className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                            </a>
                        </Button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}