import type { Metadata } from 'next';

import { SiteHeader } from '../../../../components/layout/SiteHeader';
import SiteFooter from '../../../../components/layout/SiteFooter';
import SuccessStoriesSection from '../../../../components/sections/SuccessStoriesSection';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isSpanish = locale === 'es';
  
  return {
    title: isSpanish 
      ? 'Casos de Éxito | HeyMou - Proyectos Reales, Resultados Tangibles'
      : 'Success Stories | HeyMou - Real Projects, Tangible Results',
    description: isSpanish
      ? 'Explora mis casos de éxito reales. Proyectos que han transformado negocios y generado resultados medibles para emprendedores visionarios.'
      : 'Explore my real success stories. Projects that have transformed businesses and generated measurable results for visionary entrepreneurs.',
  };
}

export default function CasosExitoPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="pt-20">
        <SuccessStoriesSection />
      </main>
      <SiteFooter />
    </div>
  );
}