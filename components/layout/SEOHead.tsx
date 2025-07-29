import Head from 'next/head';

import { Locale } from '../../types';

export interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  locale: Locale;
  type?: 'website' | 'article' | 'profile' | 'service' | 'organization';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  siteName?: string;
  noIndex?: boolean;
  breadcrumbs?: Array<{ name: string; url: string }>;
  faqData?: Array<{ question: string; answer: string }>;
  serviceData?: {
    name: string;
    description: string;
    provider: string;
    areaServed: string;
    serviceType: string;
  };
}

export default function SEOHead({
  title,
  description,
  keywords = [],
  image,
  url,
  locale,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  siteName = 'HeyMou | Tu Aliado Tecnológico',
  noIndex = false,
  breadcrumbs = [],
  faqData = [],
  serviceData
}: SEOHeadProps) {
  // Default values based on locale
  const defaultTitle = locale === 'es' 
    ? 'HeyMou | Tu Aliado Tecnológico - Transformando Ideas en Realidad Digital'
    : 'HeyMou | Your Technology Ally - Transforming Ideas into Digital Reality';
    
  const defaultDescription = locale === 'es'
    ? 'HeyMou - Transformo ideas ambiciosas en resultados tangibles a través de la tecnología. Estrategia, diseño y desarrollo que conecta con tu audiencia. Tu aliado tecnológico ideal.'
    : 'HeyMou - I transform ambitious ideas into tangible results through technology. Strategy, design and development that connects with your audience. Your ideal technology ally.';

  const defaultKeywords = locale === 'es'
    ? ['HeyMou', 'Moises', 'Mou', 'aliado tecnológico', 'desarrollo web', 'automatización', 'estrategia digital', 'Next.js', 'BuildShip', 'diseño UX/UI', 'emprendedores']
    : ['HeyMou', 'Moises', 'Mou', 'technology ally', 'web development', 'automation', 'digital strategy', 'Next.js', 'BuildShip', 'UX/UI design', 'entrepreneurs'];

  const finalTitle = title ? `${title} | ${siteName}` : defaultTitle;
  const finalDescription = description || defaultDescription;
  const finalKeywords = [...defaultKeywords, ...keywords];
  const defaultImage = '/images/og-image.jpg'; // You'll need to add this image
  const finalImage = image || defaultImage;

  // Structured data for organization
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteName,
    description: finalDescription,
    url: url || (typeof window !== 'undefined' ? window.location.origin : ''),
    logo: `${typeof window !== 'undefined' ? window.location.origin : ''}/images/logo.png`,
    sameAs: [
      // Add your social media URLs here
      'https://linkedin.com/in/heymouoficial',
      'https://twitter.com/heymouoficial',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: ['Spanish', 'English']
    }
  };

  // Structured data for website
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    description: finalDescription,
    url: url || (typeof window !== 'undefined' ? window.location.origin : ''),
    inLanguage: locale,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${typeof window !== 'undefined' ? window.location.origin : ''}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };

  // Article schema for blog posts
  const articleSchema = type === 'article' ? {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: finalDescription,
    image: finalImage,
    author: {
      '@type': 'Person',
      name: author || 'HeyMou',
      url: typeof window !== 'undefined' ? window.location.origin : ''
    },
    publisher: {
      '@type': 'Organization',
      name: siteName,
      logo: {
        '@type': 'ImageObject',
        url: `${typeof window !== 'undefined' ? window.location.origin : ''}/logos/SVG/LogoheyMou.svg`
      }
    },
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url
    },
    inLanguage: locale
  } : null;

  // Service schema for service pages
  const serviceSchema = serviceData ? {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: serviceData.name,
    description: serviceData.description,
    provider: {
      '@type': 'Organization',
      name: serviceData.provider,
      url: typeof window !== 'undefined' ? window.location.origin : ''
    },
    areaServed: serviceData.areaServed,
    serviceType: serviceData.serviceType,
    availableLanguage: ['Spanish', 'English']
  } : null;

  // Breadcrumb schema
  const breadcrumbSchema = breadcrumbs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url
    }))
  } : null;

  // FAQ schema
  const faqSchema = faqData.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqData.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  } : null;

  // Person schema for about page
  const personSchema = type === 'profile' ? {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Moises (HeyMou)',
    alternateName: 'HeyMou',
    description: finalDescription,
    url: typeof window !== 'undefined' ? window.location.origin : '',
    image: finalImage,
    jobTitle: locale === 'es' ? 'Consultor Tecnológico FullStack' : 'FullStack Technology Consultant',
    worksFor: {
      '@type': 'Organization',
      name: siteName
    },
    knowsAbout: locale === 'es' 
      ? ['Desarrollo Web', 'Automatización', 'Estrategia Digital', 'Next.js', 'BuildShip', 'UX/UI Design']
      : ['Web Development', 'Automation', 'Digital Strategy', 'Next.js', 'BuildShip', 'UX/UI Design'],
    sameAs: [
      'https://linkedin.com/in/heymouoficial',
      'https://twitter.com/heymouoficial'
    ]
  } : null;

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords.join(', ')} />
      <meta name="author" content={author || siteName} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="robots" content={noIndex ? 'noindex, nofollow' : 'index, follow'} />
      <meta name="language" content={locale} />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={locale === 'es' ? 'es_ES' : 'en_US'} />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={finalImage} />
      <meta name="twitter:site" content="@aheymouoficial" />
      <meta name="twitter:creator" content="@heymouoficial" />
      
      {/* Article specific meta tags */}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === 'article' && author && (
        <meta property="article:author" content={author} />
      )}
      
      {/* Canonical URL */}
      {url && <link rel="canonical" href={url} />}
      
      {/* Alternate language versions */}
      <link rel="alternate" hrefLang="es" href={url?.replace('/en/', '/es/') || ''} />
      <link rel="alternate" hrefLang="en" href={url?.replace('/es/', '/en/') || ''} />
      <link rel="alternate" hrefLang="x-default" href={url?.replace(`/${locale}/`, '/es/') || ''} />
      
      {/* Favicon and App Icons */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />
      <meta name="theme-color" content="#1e3a8a" />
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      {articleSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
      )}
      {serviceSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
        />
      )}
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      {personSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      )}
    </Head>
  );
}