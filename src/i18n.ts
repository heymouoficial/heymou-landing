import { getRequestConfig } from 'next-intl/server';

// Can be imported from a shared config
export const locales = ['es', 'en'] as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // Ensure that a valid locale is used
  if (!locale || !locales.includes(locale as Locale)) {
    locale = 'es';
  }

  return {
    locale,
    messages: {
      // Load all translation namespaces
      ...(await import(`../locales/${locale}/common.json`)).default,
      ...(await import(`../locales/${locale}/navigation.json`)).default,
      ...(await import(`../locales/${locale}/homepage.json`)).default,
      ...(await import(`../locales/${locale}/services.json`)).default,
      // Additional namespaces can be added as needed
      // ...(await import(`../locales/${locale}/blog.json`)).default,
      // ...(await import(`../locales/${locale}/contact.json`)).default,
    },
  };
});