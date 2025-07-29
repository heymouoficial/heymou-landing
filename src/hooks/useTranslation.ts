import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';

import { Locale, locales } from '@/i18n';

/**
 * Main translation hook with enhanced functionality
 */
export function useTranslation(namespace?: string) {
  const t = useTranslations(namespace);
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: Locale) => {
    // Remove current locale from pathname and add new one
    const pathWithoutLocale = pathname.replace(`/${locale}`, '');
    const newPath = `/${newLocale}${pathWithoutLocale}`;
    router.push(newPath);
  };

  const getLocalizedPath = (path: string, targetLocale?: Locale) => {
    const targetLoc = targetLocale || locale;
    return `/${targetLoc}${path.startsWith('/') ? path : `/${path}`}`;
  };

  return {
    t,
    locale,
    isSpanish: locale === 'es',
    isEnglish: locale === 'en',
    switchLocale,
    getLocalizedPath,
    availableLocales: locales,
  };
}

/**
 * Navigation-specific translation hook
 */
export function useNavigationTranslation() {
  return useTranslation();
}

/**
 * Common translations hook
 */
export function useCommonTranslation() {
  return useTranslation();
}

/**
 * Hero section translations hook
 */
export function useHeroTranslation() {
  return useTranslation();
}

/**
 * Services section translations hook
 */
export function useServicesTranslation() {
  return useTranslation();
}

/**
 * Blog section translations hook
 */
export function useBlogTranslation() {
  return useTranslation();
}

/**
 * Contact form translations hook
 */
export function useContactTranslation() {
  return useTranslation();
}

/**
 * SEO translations hook
 */
export function useSEOTranslation() {
  return useTranslation();
}