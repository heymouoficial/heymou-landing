import type { Metadata } from 'next';

import { SiteHeader } from '../../../../components/layout/SiteHeader';
import SiteFooter from '../../../../components/layout/SiteFooter';
import ServicesSection from '../../../../components/sections/ServicesSection';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isSpanish = locale === 'es';
  
  return {
    title: isSpanish 
      ? 'Servicios | HeyMou - Tu Aliado Tecnológico'
      : 'Services | HeyMou - Your Technology Ally',
    description: isSpanish
      ? 'Descubre mis servicios de estrategia digital, diseño UX/UI y desarrollo web. Transformo ideas ambiciosas en resultados tangibles.'
      : 'Discover my digital strategy, UX/UI design and web development services. I transform ambitious ideas into tangible results.',
  };
}

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="pt-20">
        <ServicesSection />
      </main>
      <SiteFooter />
    </div>
  );
}