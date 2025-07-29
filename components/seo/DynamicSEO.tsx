'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

import { Locale } from '../../types';
import { useSEO } from '../../src/hooks/useSEO';

import StructuredData from './StructuredData';

interface DynamicSEOProps {
  locale: Locale;
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  type?: 'website' | 'article' | 'profile';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  noIndex?: boolean;
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

export default function DynamicSEO({
  locale,
  title,
  description,
  keywords = [],
  image,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  noIndex = false,
  breadcrumbs,
  faqData,
  serviceData,
  reviewData,
  businessHours
}: DynamicSEOProps) {
  const pathname = usePathname();
  
  // Use the SEO hook to manage meta tags
  const { canonicalUrl } = useSEO({
    title,
    description,
    keywords,
    image,
    locale,
    path: pathname,
    type,
    publishedTime,
    modifiedTime,
    author,
    noIndex
  });

  // Track page views for analytics
  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      const configData: Record<string, string | number | boolean> = {
        page_location: canonicalUrl,
        page_path: pathname
      };
      if (title) configData.page_title = title;
      
      window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '', configData);
    }
  }, [title, canonicalUrl, pathname]);

  return (
    <>
      {/* Structured Data Component */}
      <StructuredData
        locale={locale}
        type={type}
        title={title}
        description={description}
        url={canonicalUrl}
        image={image}
        publishedTime={publishedTime}
        modifiedTime={modifiedTime}
        author={author}
        breadcrumbs={breadcrumbs}
        faqData={faqData}
        serviceData={serviceData}
        reviewData={reviewData}
        businessHours={businessHours}
      />
    </>
  );
}

