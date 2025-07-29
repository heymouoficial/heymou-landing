'use client';

import { useEffect } from 'react';

import { Locale } from '../../types';
import { generateSEOMetadata, generateCanonicalUrl, generateAlternateUrls } from '../../lib/seo-utils';

interface UseSEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  locale: Locale;
  path?: string;
  type?: 'website' | 'article' | 'profile';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  noIndex?: boolean;
}

export function useSEO({
  title,
  description,
  keywords = [],
  image,
  locale,
  path = '',
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  noIndex = false
}: UseSEOProps) {
  useEffect(() => {
    // Update document title
    if (title) {
      document.title = title.includes('HeyMou') ? title : `${title} | HeyMou`;
    }

    // Update meta description
    if (description) {
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', description);
    }

    // Update meta keywords
    if (keywords.length > 0) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', keywords.join(', '));
    }

    // Update canonical URL
    const canonicalUrl = generateCanonicalUrl(path, locale);
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    // Update alternate language URLs
    const alternateUrls = generateAlternateUrls(path);
    
    // Remove existing alternate links
    const existingAlternates = document.querySelectorAll('link[rel="alternate"][hreflang]');
    existingAlternates.forEach(link => link.remove());

    // Add new alternate links
    Object.entries(alternateUrls).forEach(([lang, url]) => {
      const alternateLink = document.createElement('link');
      alternateLink.setAttribute('rel', 'alternate');
      alternateLink.setAttribute('hreflang', lang);
      alternateLink.setAttribute('href', url);
      document.head.appendChild(alternateLink);
    });

    // Update Open Graph meta tags
    const ogTags = [
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: image },
      { property: 'og:url', content: canonicalUrl },
      { property: 'og:type', content: type },
      { property: 'og:locale', content: locale === 'es' ? 'es_ES' : 'en_US' }
    ];

    ogTags.forEach(({ property, content }) => {
      if (content) {
        let ogTag = document.querySelector(`meta[property="${property}"]`);
        if (!ogTag) {
          ogTag = document.createElement('meta');
          ogTag.setAttribute('property', property);
          document.head.appendChild(ogTag);
        }
        ogTag.setAttribute('content', content);
      }
    });

    // Update Twitter Card meta tags
    const twitterTags = [
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image },
      { name: 'twitter:creator', content: '@heymouoficial' }
    ];

    twitterTags.forEach(({ name, content }) => {
      if (content) {
        let twitterTag = document.querySelector(`meta[name="${name}"]`);
        if (!twitterTag) {
          twitterTag = document.createElement('meta');
          twitterTag.setAttribute('name', name);
          document.head.appendChild(twitterTag);
        }
        twitterTag.setAttribute('content', content);
      }
    });

    // Update robots meta tag
    let robotsTag = document.querySelector('meta[name="robots"]');
    if (!robotsTag) {
      robotsTag = document.createElement('meta');
      robotsTag.setAttribute('name', 'robots');
      document.head.appendChild(robotsTag);
    }
    robotsTag.setAttribute('content', noIndex ? 'noindex, nofollow' : 'index, follow');

    // Update article-specific meta tags
    if (type === 'article') {
      if (publishedTime) {
        let publishedTag = document.querySelector('meta[property="article:published_time"]');
        if (!publishedTag) {
          publishedTag = document.createElement('meta');
          publishedTag.setAttribute('property', 'article:published_time');
          document.head.appendChild(publishedTag);
        }
        publishedTag.setAttribute('content', publishedTime);
      }

      if (modifiedTime) {
        let modifiedTag = document.querySelector('meta[property="article:modified_time"]');
        if (!modifiedTag) {
          modifiedTag = document.createElement('meta');
          modifiedTag.setAttribute('property', 'article:modified_time');
          document.head.appendChild(modifiedTag);
        }
        modifiedTag.setAttribute('content', modifiedTime);
      }

      if (author) {
        let authorTag = document.querySelector('meta[property="article:author"]');
        if (!authorTag) {
          authorTag = document.createElement('meta');
          authorTag.setAttribute('property', 'article:author');
          document.head.appendChild(authorTag);
        }
        authorTag.setAttribute('content', author);
      }
    }
  }, [
    title,
    description,
    keywords,
    image,
    locale,
    path,
    type,
    publishedTime,
    modifiedTime,
    author,
    noIndex
  ]);

  // Generate metadata object for Next.js
  const metadata = generateSEOMetadata({
    title,
    description,
    keywords,
    image,
    url: generateCanonicalUrl(path, locale),
    locale,
    type,
    publishedTime,
    modifiedTime,
    author,
    noIndex
  });

  return {
    metadata,
    canonicalUrl: generateCanonicalUrl(path, locale),
    alternateUrls: generateAlternateUrls(path)
  };
}