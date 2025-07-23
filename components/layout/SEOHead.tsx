import Head from 'next/head';

import { Locale } from '../../types';

export interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  locale: Locale;
  type?: 'website' | 'article' | 'profile';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  siteName?: string;
  noIndex?: boolean;
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
  siteName = 'Aliado Tecnológico',
  noIndex = false
}: SEOHeadProps) {
  // Default values based on locale
  const defaultTitle = locale === 'es' 
    ? 'Aliado Tecnológico - Transformando Sueños en Realidad Digital'
    : 'Technology Ally - Transforming Dreams into Digital Reality';
    
  const defaultDescription = locale === 'es'
    ? 'Tu aliado tecnológico para materializar ideas ambiciosas. Desarrollo web, aplicaciones móviles y automatización. Del sueño a la realidad digital.'
    : 'Your technology ally to materialize ambitious ideas. Web development, mobile applications and automation. From dream to digital reality.';

  const defaultKeywords = locale === 'es'
    ? ['desarrollo web', 'aplicaciones móviles', 'automatización', 'aliado tecnológico', 'transformación digital', 'emprendimiento']
    : ['web development', 'mobile applications', 'automation', 'technology ally', 'digital transformation', 'entrepreneurship'];

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
      'https://linkedin.com/company/aliado-tecnologico',
      'https://twitter.com/aliado_tech',
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
      name: author || 'Aliado Tecnológico'
    },
    publisher: {
      '@type': 'Organization',
      name: siteName,
      logo: {
        '@type': 'ImageObject',
        url: `${typeof window !== 'undefined' ? window.location.origin : ''}/images/logo.png`
      }
    },
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url
    }
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
      <meta name="twitter:site" content="@aliado_tech" />
      <meta name="twitter:creator" content="@aliado_tech" />
      
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
    </Head>
  );
}