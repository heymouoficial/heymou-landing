import type { Metadata } from 'next';

import { SiteHeader } from '../../../components/layout/SiteHeader';
import SiteFooter from '../../../components/layout/SiteFooter';
import ElevenlabsChatbot from '../../../components/ui/ElevenlabsChatbot';
import HeroSection from '../../../components/sections/HeroSection';
import ServicesSection from '../../../components/sections/ServicesSection';
import SuccessStoriesSection from '../../../components/sections/SuccessStoriesSection';
import BlogSection from '../../../components/sections/BlogSection';
import { ContactCTA } from '../../../components/sections/ContactCTA';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isSpanish = locale === 'es';
  
  return {
    title: isSpanish 
      ? 'HeyMou | Tu Aliado Tecnológico - Del Sueño a la Realidad Digital'
      : 'HeyMou | Your Technology Ally - From Dream to Digital Reality',
    description: isSpanish
      ? 'HeyMou - Tu aliado tecnológico ideal. Transformo ideas ambiciosas en resultados tangibles. Estrategia, diseño y desarrollo que conecta con tu audiencia. +70 proyectos, +15 años de experiencia.'
      : 'HeyMou - Your ideal technology ally. I transform ambitious ideas into tangible results. Strategy, design and development that connects with your audience. +70 projects, +15 years of experience.',
    openGraph: {
      title: isSpanish 
        ? 'HeyMou | Tu Aliado Tecnológico'
        : 'HeyMou | Your Technology Ally',
      description: isSpanish
        ? 'Transformo ideas ambiciosas en resultados tangibles a través de la tecnología. Tu aliado tecnológico para estrategia, diseño y desarrollo.'
        : 'I transform ambitious ideas into tangible results through technology. Your technology ally for strategy, design and development.',
    },
  };
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main>
        <section id="inicio">
          <HeroSection />
        </section>
        <section id="servicios">
          <ServicesSection />
        </section>
        <section id="casos-exito">
          <SuccessStoriesSection />
        </section>
        <section id="blog">
          <BlogSection />
        </section>
        <section id="contacto">
          <ContactCTA />
        </section>
      </main>
      <SiteFooter />
      <ElevenlabsChatbot />
    </div>
  );
}