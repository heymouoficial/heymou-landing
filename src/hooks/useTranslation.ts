import { useTranslations, useLocale } from 'next-intl';

import { Locale } from '@/i18n';

export function useTranslation() {
  const t = useTranslations();
  const locale = useLocale() as Locale;

  return {
    t,
    locale,
    isSpanish: locale === 'es',
    isEnglish: locale === 'en',
  };
}

// Specific hooks for different namespaces
export function useNavigationTranslation() {
  const t = useTranslations();
  const locale = useLocale() as Locale;

  return {
    t,
    locale,
    isSpanish: locale === 'es',
    isEnglish: locale === 'en',
  };
}

export function useCommonTranslation() {
  const t = useTranslations();
  const locale = useLocale() as Locale;

  return {
    t,
    locale,
    isSpanish: locale === 'es',
    isEnglish: locale === 'en',
  };
}