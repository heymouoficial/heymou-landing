import { Locale, locales } from '@/i18n';

/**
 * Validates if a locale is supported
 */
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

/**
 * Gets the default locale
 */
export function getDefaultLocale(): Locale {
  return 'es';
}

/**
 * Gets the opposite locale (for language switching)
 */
export function getAlternateLocale(currentLocale: Locale): Locale {
  return currentLocale === 'es' ? 'en' : 'es';
}

/**
 * Formats a date according to the locale
 */
export function formatDate(date: Date | string, locale: Locale): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  return new Intl.DateTimeFormat(locale === 'es' ? 'es-ES' : 'en-US', options).format(dateObj);
}

/**
 * Formats a number according to the locale
 */
export function formatNumber(number: number, locale: Locale): string {
  return new Intl.NumberFormat(locale === 'es' ? 'es-ES' : 'en-US').format(number);
}

/**
 * Formats currency according to the locale
 */
export function formatCurrency(amount: number, locale: Locale, currency: string = 'USD'): string {
  return new Intl.NumberFormat(locale === 'es' ? 'es-ES' : 'en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Gets the reading time text based on locale
 */
export function getReadingTimeText(minutes: number, locale: Locale): string {
  if (locale === 'es') {
    return `${minutes} min de lectura`;
  }
  return `${minutes} min read`;
}

/**
 * Gets localized path for a given route
 */
export function getLocalizedPath(path: string, locale: Locale): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // If path is empty (root), just return locale
  if (!cleanPath) {
    return `/${locale}`;
  }
  
  return `/${locale}/${cleanPath}`;
}

/**
 * Removes locale from path
 */
export function removeLocaleFromPath(path: string): string {
  const segments = path.split('/').filter(Boolean);
  
  // If first segment is a locale, remove it
  if (segments.length > 0 && segments[0] && isValidLocale(segments[0])) {
    segments.shift();
  }
  
  return '/' + segments.join('/');
}

/**
 * Gets locale from path
 */
export function getLocaleFromPath(path: string): Locale | null {
  const segments = path.split('/').filter(Boolean);
  
  if (segments.length > 0 && segments[0] && isValidLocale(segments[0])) {
    return segments[0] as Locale;
  }
  
  return null;
}

/**
 * Generates alternate language links for SEO
 */
export function generateAlternateLinks(currentPath: string) {
  const pathWithoutLocale = removeLocaleFromPath(currentPath);
  
  return locales.map(locale => ({
    hrefLang: locale,
    href: getLocalizedPath(pathWithoutLocale, locale),
  }));
}

/**
 * Gets the appropriate locale based on Accept-Language header
 */
export function getLocaleFromAcceptLanguage(acceptLanguage?: string): Locale {
  if (!acceptLanguage) {
    return getDefaultLocale();
  }

  // Parse Accept-Language header
  const languages = acceptLanguage
    .split(',')
    .map(lang => {
      const [code, q = '1'] = lang.trim().split(';q=');
      return { code: code?.toLowerCase() || '', quality: parseFloat(q) };
    })
    .filter(lang => lang.code) // Filter out empty codes
    .sort((a, b) => b.quality - a.quality);

  // Find the first supported language
  for (const { code } of languages) {
    // Check exact match
    if (isValidLocale(code)) {
      return code as Locale;
    }
    
    // Check language prefix (e.g., 'en-US' -> 'en')
    const prefix = code.split('-')[0];
    if (prefix && isValidLocale(prefix)) {
      return prefix as Locale;
    }
  }

  return getDefaultLocale();
}

/**
 * Type-safe translation key helper
 */
export type TranslationKey = string;

/**
 * Helper to create type-safe translation keys
 */
export function createTranslationKey(key: string): TranslationKey {
  return key;
}