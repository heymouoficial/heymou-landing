import type { Metadata } from 'next';
import { SpeedInsights } from '@vercel/speed-insights/next';

import '../../lib/security'; // Validate environment on startup

import './globals.css';
import WebVitals from '../../components/analytics/WebVitals';
import SmartPreloader from '../../components/performance/SmartPreloader';
import PerformanceMonitor from '../../components/performance/PerformanceMonitor';


export const metadata: Metadata = {
  title: 'HeyMou | Tu Aliado Tecnológico - Transformando Ideas en Realidad Digital',
  description: 'HeyMou - Transformo ideas ambiciosas en resultados tangibles a través de la tecnología. Estrategia, diseño y desarrollo que conecta con tu audiencia. Tu aliado tecnológico ideal.',
  keywords: ['HeyMou', 'Moises', 'Mou', 'aliado tecnológico', 'desarrollo web', 'automatización', 'estrategia digital', 'Next.js', 'BuildShip', 'diseño UX/UI', 'emprendedores'],
  authors: [{ name: 'HeyMou' }],
  creator: 'HeyMou',
  publisher: 'HeyMou',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://heymou.com'),
  openGraph: {
    title: 'HeyMou | Tu Aliado Tecnológico - Transformando Ideas en Realidad Digital',
    description: 'Transformo ideas ambiciosas en resultados tangibles a través de la tecnología. Estrategia, diseño y desarrollo que conecta con tu audiencia.',
    url: 'https://heymou.com',
    siteName: 'HeyMou | Tu Aliado Tecnológico',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'HeyMou - Tu Aliado Tecnológico',
      }
    ],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HeyMou | Tu Aliado Tecnológico',
    description: 'Transformo ideas ambiciosas en resultados tangibles a través de la tecnología.',
    creator: '@heymouoficial',
    images: ['/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        
        {/* Favicon and app icons */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/svg+xml" href="/logos/SVG/Favicon.svg" />
        <link rel="apple-touch-icon" sizes="180x180" href="/logos/SVG/Favicon.svg" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#14232d" />
        
        {/* Performance hints */}
        <meta httpEquiv="x-dns-prefetch-control" content="on" />
      </head>
      <body
        className="antialiased"
      >
        <WebVitals />
        <SmartPreloader />
        <PerformanceMonitor />
        <SpeedInsights />
        {children}
      </body>
    </html>
  );
}
