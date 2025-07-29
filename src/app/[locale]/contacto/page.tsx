import type { Metadata } from 'next';

import { SiteHeader } from '../../../../components/layout/SiteHeader';
import SiteFooter from '../../../../components/layout/SiteFooter';
import { ContactCTA } from '../../../../components/sections/ContactCTA';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isSpanish = locale === 'es';
  
  return {
    title: isSpanish 
      ? 'Contacto | HeyMou - Transformemos tu Idea en Realidad'
      : 'Contact | HeyMou - Let\'s Transform Your Idea into Reality',
    description: isSpanish
      ? 'Cuéntame sobre tu proyecto. Respuesta garantizada en menos de 24 horas. Agenda una consulta gratuita o escríbeme directamente.'
      : 'Tell me about your project. Response guaranteed in less than 24 hours. Schedule a free consultation or email me directly.',
  };
}

export default function ContactoPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="pt-20">
        <ContactCTA />
      </main>
      <SiteFooter />
    </div>
  );
}