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
      ? 'Política de Privacidad | HeyMou'
      : 'Privacy Policy | HeyMou',
    description: isSpanish
      ? 'Política de privacidad de HeyMou. Conoce cómo protegemos y manejamos tu información personal.'
      : 'HeyMou privacy policy. Learn how we protect and handle your personal information.',
  };
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  const isSpanish = locale === 'es';

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-4 pt-32 pb-16">
        <div className="prose prose-invert max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">
            {isSpanish ? 'Política de Privacidad' : 'Privacy Policy'}
          </h1>
          
          <p className="text-gray-400 mb-8">
            {isSpanish 
              ? 'Última actualización: Enero 2025'
              : 'Last updated: January 2025'
            }
          </p>

          {isSpanish ? (
            <>
              <h2 className="text-2xl font-semibold mt-8 mb-4">1. Información que Recopilamos</h2>
              <p className="mb-4">
                En HeyMou, recopilamos únicamente la información necesaria para brindarte el mejor servicio:
              </p>
              <ul className="list-disc pl-6 mb-6">
                <li>Información de contacto (nombre, email, teléfono)</li>
                <li>Información del proyecto que compartes con nosotros</li>
                <li>Datos de navegación para mejorar la experiencia del sitio</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-8 mb-4">2. Cómo Usamos tu Información</h2>
              <p className="mb-4">
                Utilizamos tu información para:
              </p>
              <ul className="list-disc pl-6 mb-6">
                <li>Responder a tus consultas y proporcionar cotizaciones</li>
                <li>Comunicarnos contigo sobre tu proyecto</li>
                <li>Mejorar nuestros servicios y experiencia del usuario</li>
                <li>Enviar actualizaciones relevantes (solo si das tu consentimiento)</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-8 mb-4">3. Protección de Datos</h2>
              <p className="mb-6">
                Implementamos medidas de seguridad técnicas y organizativas para proteger tu información personal contra acceso no autorizado, alteración, divulgación o destrucción.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">4. Compartir Información</h2>
              <p className="mb-6">
                No vendemos, intercambiamos ni transferimos tu información personal a terceros sin tu consentimiento, excepto cuando sea necesario para proporcionar nuestros servicios o cuando la ley lo requiera.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">5. Tus Derechos</h2>
              <p className="mb-4">
                Tienes derecho a:
              </p>
              <ul className="list-disc pl-6 mb-6">
                <li>Acceder a tu información personal</li>
                <li>Rectificar datos incorrectos</li>
                <li>Solicitar la eliminación de tus datos</li>
                <li>Oponerte al procesamiento de tus datos</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-8 mb-4">6. Contacto</h2>
              <p className="mb-6">
                Si tienes preguntas sobre esta política de privacidad, puedes contactarnos en: hello@heymou.com
              </p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
              <p className="mb-4">
                At HeyMou, we collect only the information necessary to provide you with the best service:
              </p>
              <ul className="list-disc pl-6 mb-6">
                <li>Contact information (name, email, phone)</li>
                <li>Project information you share with us</li>
                <li>Navigation data to improve site experience</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-8 mb-4">2. How We Use Your Information</h2>
              <p className="mb-4">
                We use your information to:
              </p>
              <ul className="list-disc pl-6 mb-6">
                <li>Respond to your inquiries and provide quotes</li>
                <li>Communicate with you about your project</li>
                <li>Improve our services and user experience</li>
                <li>Send relevant updates (only with your consent)</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-8 mb-4">3. Data Protection</h2>
              <p className="mb-6">
                We implement technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">4. Information Sharing</h2>
              <p className="mb-6">
                We do not sell, trade, or transfer your personal information to third parties without your consent, except when necessary to provide our services or when required by law.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">5. Your Rights</h2>
              <p className="mb-4">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 mb-6">
                <li>Access your personal information</li>
                <li>Rectify incorrect data</li>
                <li>Request deletion of your data</li>
                <li>Object to data processing</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-8 mb-4">6. Contact</h2>
              <p className="mb-6">
                If you have questions about this privacy policy, you can contact us at: hello@heymou.com
              </p>
            </>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}