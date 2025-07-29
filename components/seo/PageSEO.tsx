'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

import { Locale } from '../../types';
import { generateOGImageUrl } from '../../lib/og-image-utils';

import DynamicSEO from './DynamicSEO';

interface PageSEOProps {
  locale: Locale;
  title?: string;
  description?: string;
  keywords?: string[];
  type?: 'website' | 'article' | 'profile';
  image?: string;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  noIndex?: boolean;

  // Page-specific structured data
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
}

export default function PageSEO({
  locale,
  title,
  description,
  keywords = [],
  type = 'website',
  image,
  publishedTime,
  modifiedTime,
  author,
  noIndex = false,
  breadcrumbs,
  faqData,
  serviceData,
  reviewData
}: PageSEOProps) {
  const pathname = usePathname();

  // Generate page-specific data
  const pageType = getPageType(pathname);
  const finalImage = image || generateOGImageUrl({
    title: title || 'HeyMou',
    description,
    locale,
    type: pageType,
    author,
    date: publishedTime
  });

  // Generate business hours for contact page
  const businessHours = pathname.includes('contacto') || pathname.includes('contact') ? [
    { dayOfWeek: 'Monday', opens: '09:00', closes: '18:00' },
    { dayOfWeek: 'Tuesday', opens: '09:00', closes: '18:00' },
    { dayOfWeek: 'Wednesday', opens: '09:00', closes: '18:00' },
    { dayOfWeek: 'Thursday', opens: '09:00', closes: '18:00' },
    { dayOfWeek: 'Friday', opens: '09:00', closes: '18:00' }
  ] : undefined;

  // Generate default service data for service pages
  const defaultServiceData = pathname.includes('servicio') || pathname.includes('service') ? {
    name: title || (locale === 'es' ? 'Consultoría Tecnológica' : 'Technology Consulting'),
    description: description || (locale === 'es'
      ? 'Servicios de consultoría tecnológica y desarrollo web'
      : 'Technology consulting and web development services'),
    provider: 'HeyMou',
    areaServed: 'Global',
    serviceType: locale === 'es' ? 'Consultoría Tecnológica' : 'Technology Consulting'
  } : serviceData;

  // Track page view
  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      const params: Record<string, string | number | boolean> = {
        page_location: window.location.href,
        page_path: pathname,
        content_group1: pageType,
        content_group2: locale
      };
      
      if (title) params.page_title = title;

      window.gtag('event', 'page_view', params);
    }
  }, [title, pathname, pageType, locale]);

  return (
    <DynamicSEO
      locale={locale}
      title={title}
      description={description}
      keywords={keywords}
      image={finalImage}
      type={type}
      publishedTime={publishedTime}
      modifiedTime={modifiedTime}
      author={author}
      noIndex={noIndex}
      breadcrumbs={breadcrumbs}
      faqData={faqData}
      serviceData={defaultServiceData}
      reviewData={reviewData}
      businessHours={businessHours}
    />
  );
}

// Helper function to determine page type from pathname
function getPageType(pathname: string): 'default' | 'article' | 'service' | 'success-story' {
  if (pathname.includes('/blog/') && pathname.split('/').length > 3) {
    return 'article';
  }
  if (pathname.includes('/casos-exito/') && pathname.split('/').length > 3) {
    return 'success-story';
  }
  if (pathname.includes('/servicio') || pathname.includes('/service')) {
    return 'service';
  }
  return 'default';
}

