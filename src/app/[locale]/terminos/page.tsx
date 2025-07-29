import type { Metadata } from 'next';

import { SiteHeader } from '../../../../components/layout/SiteHeader';
import SiteFooter from '../../../../components/layout/SiteFooter';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isSpanish = locale === 'es';
  
  return {
    title: isSpanish 
      ? 'Términos de Servicio | HeyMou'
      : 'Terms of Service | HeyMou',
    description: isSpanish
      ? 'Términos y condiciones de servicio de HeyMou. Conoce las condiciones de uso de nuestros servicios.'
      : 'HeyMou terms and conditions of service. Learn about the terms of use of our services.',
  };
}

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  const isSpanish = locale === 'es';

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <div className="prose prose-invert max-w-none">
          <h1 className="text-4xl font-bold mb-8">
            {isSpanish ? 'Términos de Servicio' : 'Terms of Service'}
          </h1>
          
          <p className="text-gray-400 mb-8">
            {isSpanish 
              ? 'Última actualización: Enero 2025'
              : 'Last updated: January 2025'
            }
          </p>

          {isSpanish ? (
            <>
              <h2 className="text-2xl font-semibold mt-8 mb-4">1. Aceptación de Términos</h2>
              <p className="mb-6">
                Al acceder y utilizar los servicios de HeyMou, aceptas estar sujeto a estos términos de servicio y a todas las leyes y regulaciones aplicables.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">2. Descripción de Servicios</h2>
              <p className="mb-4">
                HeyMou ofrece servicios de consultoría tecnológica, desarrollo web, automatización y estrategia digital, incluyendo:
              </p>
              <ul className="list-disc pl-6 mb-6">
                <li>Desarrollo de aplicaciones web y móviles</li>
                <li>Automatización de procesos empresariales</li>
                <li>Consultoría en estrategia digital</li>
                <li>Diseño UX/UI</li>
                <li>Integración de sistemas</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-8 mb-4">3. Responsabilidades del Cliente</h2>
              <p className="mb-4">
                Como cliente, te comprometes a:
              </p>
              <ul className="list-disc pl-6 mb-6">
                <li>Proporcionar información precisa y completa</li>
                <li>Colaborar activamente en el desarrollo del proyecto</li>
                <li>Realizar los pagos según los términos acordados</li>
                <li>Respetar los derechos de propiedad intelectual</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-8 mb-4">4. Propiedad Intelectual</h2>
              <p className="mb-6">
                Los derechos de propiedad intelectual del trabajo desarrollado se transferirán al cliente una vez completado el pago total, salvo que se acuerde lo contrario por escrito.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">5. Limitación de Responsabilidad</h2>
              <p className="mb-6">
                HeyMou no será responsable por daños indirectos, incidentales, especiales o consecuentes que resulten del uso de nuestros servicios.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">6. Modificaciones</h2>
              <p className="mb-6">
                Nos reservamos el derecho de modificar estos términos en cualquier momento. Las modificaciones entrarán en vigor inmediatamente después de su publicación.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">7. Contacto</h2>
              <p className="mb-6">
                Para preguntas sobre estos términos, contacta: hello@heymou.com
              </p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
              <p className="mb-6">
                By accessing and using HeyMou services, you agree to be bound by these terms of service and all applicable laws and regulations.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">2. Service Description</h2>
              <p className="mb-4">
                HeyMou offers technology consulting, web development, automation, and digital strategy services, including:
              </p>
              <ul className="list-disc pl-6 mb-6">
                <li>Web and mobile application development</li>
                <li>Business process automation</li>
                <li>Digital strategy consulting</li>
                <li>UX/UI design</li>
                <li>System integration</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-8 mb-4">3. Client Responsibilities</h2>
              <p className="mb-4">
                As a client, you agree to:
              </p>
              <ul className="list-disc pl-6 mb-6">
                <li>Provide accurate and complete information</li>
                <li>Actively collaborate in project development</li>
                <li>Make payments according to agreed terms</li>
                <li>Respect intellectual property rights</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-8 mb-4">4. Intellectual Property</h2>
              <p className="mb-6">
                Intellectual property rights for developed work will be transferred to the client upon full payment completion, unless otherwise agreed in writing.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">5. Limitation of Liability</h2>
              <p className="mb-6">
                HeyMou shall not be liable for indirect, incidental, special, or consequential damages resulting from the use of our services.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">6. Modifications</h2>
              <p className="mb-6">
                We reserve the right to modify these terms at any time. Modifications will take effect immediately upon posting.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">7. Contact</h2>
              <p className="mb-6">
                For questions about these terms, contact: hello@heymou.com
              </p>
            </>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}