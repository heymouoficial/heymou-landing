import { Metadata } from 'next';

import { Locale } from '../types';

interface SEOConfig {
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
  noIndex?: boolean;
}

const DEFAULT_SITE_NAME = 'HeyMou | Tu Aliado Tecnológico';
const DEFAULT_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://heymou.com';

// Generate metadata for pages
export function generateSEOMetadata({
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
  noIndex = false
}: SEOConfig): Metadata {
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

  const finalTitle = title ? `${title} | ${DEFAULT_SITE_NAME}` : defaultTitle;
  const finalDescription = description || defaultDescription;
  const finalKeywords = [...defaultKeywords, ...keywords];
  const finalImage = image || `${DEFAULT_SITE_URL}/images/og-image.jpg`;
  const finalUrl = url || DEFAULT_SITE_URL;

  return {
    title: finalTitle,
    description: finalDescription,
    keywords: finalKeywords,
    authors: [{ name: author || 'HeyMou' }],
    creator: 'HeyMou',
    publisher: 'HeyMou',
    
    openGraph: {
      title: finalTitle,
      description: finalDescription,
      url: finalUrl,
      siteName: DEFAULT_SITE_NAME,
      images: [
        {
          url: finalImage,
          width: 1200,
          height: 630,
          alt: finalTitle,
        }
      ],
      locale: locale === 'es' ? 'es_ES' : 'en_US',
      type: type,
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    
    twitter: {
      card: 'summary_large_image',
      title: finalTitle,
      description: finalDescription,
      images: [finalImage],
      creator: '@heymouoficial',
    },
    
    alternates: {
      canonical: finalUrl,
      languages: {
        'es': finalUrl.replace('/en/', '/es/'),
        'en': finalUrl.replace('/es/', '/en/'),
      },
    },
    
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    
    ...(type === 'article' && publishedTime && {
      other: {
        'article:published_time': publishedTime,
        'article:modified_time': modifiedTime || publishedTime,
        'article:author': author || 'HeyMou',
      }
    }),
  };
}

// Generate structured data for different page types
export function generateStructuredData(config: SEOConfig & { 
  breadcrumbs?: Array<{ name: string; url: string }>;
  faqData?: Array<{ question: string; answer: string }>;
  serviceData?: {
    name: string;
    description: string;
    provider: string;
    areaServed: string;
    serviceType: string;
    offers?: Array<{
      name: string;
      description: string;
      price?: string;
      currency?: string;
    }>;
  };
  reviewData?: {
    rating: number;
    reviewCount: number;
    reviews?: Array<{
      author: string;
      rating: number;
      reviewBody: string;
      datePublished: string;
    }>;
  };
  businessHours?: Array<{
    dayOfWeek: string;
    opens: string;
    closes: string;
  }>;
}) {
  const baseUrl = DEFAULT_SITE_URL;
  
  const schemas = [];

  // Organization schema with enhanced data
  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${baseUrl}/#organization`,
    name: DEFAULT_SITE_NAME,
    alternateName: 'HeyMou',
    description: config.description,
    url: baseUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${baseUrl}/logos/SVG/LogoheyMou.svg`,
      width: 200,
      height: 60
    },
    image: `${baseUrl}/images/og-image.jpg`,
    sameAs: [
      'https://linkedin.com/in/heymouoficial',
      'https://twitter.com/heymouoficial',
      'https://github.com/heymouoficial'
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        availableLanguage: ['Spanish', 'English'],
        email: 'hola@heymou.com'
      }
    ],
    founder: {
      '@type': 'Person',
      name: 'Moises (HeyMou)',
      jobTitle: config.locale === 'es' ? 'Consultor Tecnológico FullStack' : 'FullStack Technology Consultant'
    },
    foundingDate: '2024',
    areaServed: {
      '@type': 'Place',
      name: 'Global'
    },
    knowsAbout: config.locale === 'es' 
      ? ['Desarrollo Web', 'Automatización', 'Estrategia Digital', 'Next.js', 'BuildShip', 'UX/UI Design']
      : ['Web Development', 'Automation', 'Digital Strategy', 'Next.js', 'BuildShip', 'UX/UI Design'],
    ...(config.reviewData && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: config.reviewData.rating,
        reviewCount: config.reviewData.reviewCount,
        bestRating: 5,
        worstRating: 1
      }
    })
  });

  // Website schema
  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: DEFAULT_SITE_NAME,
    description: config.description,
    url: baseUrl,
    inLanguage: config.locale,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  });

  // Article schema for blog posts
  if (config.type === 'article') {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: config.title,
      description: config.description,
      image: config.image,
      author: {
        '@type': 'Person',
        name: config.author || 'HeyMou',
        url: baseUrl
      },
      publisher: {
        '@type': 'Organization',
        name: DEFAULT_SITE_NAME,
        logo: {
          '@type': 'ImageObject',
          url: `${baseUrl}/logos/SVG/LogoheyMou.svg`
        }
      },
      datePublished: config.publishedTime,
      dateModified: config.modifiedTime || config.publishedTime,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': config.url
      },
      inLanguage: config.locale
    });
  }

  // Service schema with enhanced data
  if (config.serviceData) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'Service',
      '@id': `${baseUrl}/#service`,
      name: config.serviceData.name,
      description: config.serviceData.description,
      provider: {
        '@type': 'Organization',
        '@id': `${baseUrl}/#organization`,
        name: config.serviceData.provider,
        url: baseUrl
      },
      areaServed: {
        '@type': 'Place',
        name: config.serviceData.areaServed
      },
      serviceType: config.serviceData.serviceType,
      availableLanguage: ['Spanish', 'English'],
      category: config.locale === 'es' ? 'Consultoría Tecnológica' : 'Technology Consulting',
      ...(config.serviceData.offers && {
        offers: config.serviceData.offers.map(offer => ({
          '@type': 'Offer',
          name: offer.name,
          description: offer.description,
          ...(offer.price && {
            price: offer.price,
            priceCurrency: offer.currency || 'USD'
          })
        }))
      }),
      ...(config.reviewData && {
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: config.reviewData.rating,
          reviewCount: config.reviewData.reviewCount
        }
      })
    });
  }

  // Person schema for profile pages
  if (config.type === 'profile') {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Moises (HeyMou)',
      alternateName: 'HeyMou',
      description: config.description,
      url: baseUrl,
      image: config.image,
      jobTitle: config.locale === 'es' ? 'Consultor Tecnológico FullStack' : 'FullStack Technology Consultant',
      worksFor: {
        '@type': 'Organization',
        name: DEFAULT_SITE_NAME
      },
      knowsAbout: config.locale === 'es' 
        ? ['Desarrollo Web', 'Automatización', 'Estrategia Digital', 'Next.js', 'BuildShip', 'UX/UI Design']
        : ['Web Development', 'Automation', 'Digital Strategy', 'Next.js', 'BuildShip', 'UX/UI Design'],
      sameAs: [
        'https://linkedin.com/in/heymouoficial',
        'https://twitter.com/heymouoficial'
      ]
    });
  }

  // Breadcrumb schema
  if (config.breadcrumbs && config.breadcrumbs.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: config.breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: crumb.url
      }))
    });
  }

  // FAQ schema
  if (config.faqData && config.faqData.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: config.faqData.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
      }))
    });
  }

  // Review schema
  if (config.reviewData?.reviews && config.reviewData.reviews.length > 0) {
    config.reviewData.reviews.forEach(review => {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: review.author
        },
        reviewRating: {
          '@type': 'Rating',
          ratingValue: review.rating,
          bestRating: 5,
          worstRating: 1
        },
        reviewBody: review.reviewBody,
        datePublished: review.datePublished,
        itemReviewed: {
          '@type': 'Service',
          '@id': `${baseUrl}/#service`
        }
      });
    });
  }

  // Local Business schema (if business hours provided)
  if (config.businessHours && config.businessHours.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      '@id': `${baseUrl}/#business`,
      name: DEFAULT_SITE_NAME,
      description: config.description,
      url: baseUrl,
      telephone: '+1-XXX-XXX-XXXX', // Update with actual phone
      email: 'hola@heymou.com',
      openingHoursSpecification: config.businessHours.map(hours => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: hours.dayOfWeek,
        opens: hours.opens,
        closes: hours.closes
      })),
      areaServed: {
        '@type': 'Place',
        name: 'Global'
      },
      priceRange: '$$'
    });
  }

  return schemas;
}

// Generate canonical URL
export function generateCanonicalUrl(path: string, locale: Locale): string {
  const baseUrl = DEFAULT_SITE_URL;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}/${locale}${cleanPath}`;
}

// Generate alternate language URLs
export function generateAlternateUrls(path: string): Record<string, string> {
  const baseUrl = DEFAULT_SITE_URL;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  return {
    'es': `${baseUrl}/es${cleanPath}`,
    'en': `${baseUrl}/en${cleanPath}`,
    'x-default': `${baseUrl}/es${cleanPath}`, // Default to Spanish
  };
}