import { Locale } from '@/i18n';

/**
 * Translation namespace types
 */
export type TranslationNamespace = 
  | 'common'
  | 'navigation' 
  | 'homepage'
  | 'services'
  | 'blog'
  | 'contact';

/**
 * Language information interface
 */
export interface LanguageInfo {
  code: Locale;
  name: string;
  nativeName: string;
  flag: string;
  direction: 'ltr' | 'rtl';
}

/**
 * Translation function type
 */
export type TranslationFunction = (key: string, params?: Record<string, any>) => string;

/**
 * Localized content interface
 */
export interface LocalizedContent {
  [key: string]: string | LocalizedContent;
}

/**
 * SEO metadata interface
 */
export interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string[];
  openGraph?: {
    title: string;
    description: string;
    image?: string;
  };
}

/**
 * Localized route interface
 */
export type LocalizedRoute = {
  [key in Locale]: string;
};

/**
 * Translation context interface
 */
export interface TranslationContext {
  locale: Locale;
  t: TranslationFunction;
  isSpanish: boolean;
  isEnglish: boolean;
  switchLocale: (locale: Locale) => void;
  getLocalizedPath: (path: string, locale?: Locale) => string;
  availableLocales: readonly Locale[];
}

/**
 * Blog post interface with localization
 */
export interface LocalizedBlogPost {
  id: string;
  slug: string;
  locale: Locale;
  title: string;
  description: string;
  content: string;
  category: string;
  tags: string[];
  readingTime: number;
  publishedAt: string;
  featured: boolean;
  author?: {
    name: string;
    avatar?: string;
  };
  seo?: SEOMetadata;
}

/**
 * Success story interface with localization
 */
export interface LocalizedSuccessStory {
  id: string;
  slug: string;
  locale: Locale;
  title: string;
  description: string;
  clientName: string;
  industry: string;
  location: string;
  status: 'live' | 'development' | 'upcoming';
  challenge: string;
  solution: string;
  results: string[];
  testimonial?: {
    quote: string;
    author: string;
    position: string;
  };
  duration: string;
  technologies: string[];
  imageUrl?: string;
  seo?: SEOMetadata;
}

/**
 * Contact form data interface
 */
export interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  projectType: 'web' | 'mobile' | 'automation' | 'consulting';
  budget?: string;
  timeline?: string;
  message: string;
  locale: Locale;
}

/**
 * Navigation item interface
 */
export interface NavigationItem {
  key: string;
  label: string;
  href: string;
  isExternal?: boolean;
}

/**
 * Localized navigation interface
 */
export type LocalizedNavigation = {
  [key in Locale]: NavigationItem[];
};