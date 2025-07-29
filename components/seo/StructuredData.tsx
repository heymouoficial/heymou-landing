'use client';

import { useEffect } from 'react';

import { Locale } from '../../types';
import { generateStructuredData } from '../../lib/seo-utils';

interface StructuredDataProps {
  locale: Locale;
  type?: 'website' | 'article' | 'profile';
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
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
}

export default function StructuredData({
  locale,
  type = 'website',
  title,
  description,
  url,
  image,
  publishedTime,
  modifiedTime,
  author,
  breadcrumbs,
  faqData,
  serviceData,
  reviewData,
  businessHours
}: StructuredDataProps) {
  useEffect(() => {
    // Generate structured data
    const schemas = generateStructuredData({
      locale,
      type,
      title,
      description,
      url,
      image,
      publishedTime,
      modifiedTime,
      author,
      breadcrumbs,
      faqData,
      serviceData,
      reviewData,
      businessHours
    });

    // Remove existing structured data scripts
    const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
    existingScripts.forEach(script => {
      if (script.getAttribute('data-structured-data') === 'true') {
        script.remove();
      }
    });

    // Add new structured data scripts
    schemas.forEach((schema, index) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-structured-data', 'true');
      script.setAttribute('data-schema-index', index.toString());
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    });

    // Cleanup on unmount
    return () => {
      const scripts = document.querySelectorAll('script[data-structured-data="true"]');
      scripts.forEach(script => script.remove());
    };
  }, [
    locale,
    type,
    title,
    description,
    url,
    image,
    publishedTime,
    modifiedTime,
    author,
    breadcrumbs,
    faqData,
    serviceData,
    reviewData,
    businessHours
  ]);

  // This component doesn't render anything visible
  return null;
}