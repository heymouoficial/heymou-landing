import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import type { Metadata } from 'next';

import { locales, Locale } from '@/i18n';

import { generateSEOMetadata } from '../../../lib/seo-utils';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  
  return generateSEOMetadata({
    locale: locale as Locale,
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://heymou.com'}/${locale}`,
    type: 'website'
  });
}

export default async function LocaleLayout({
  children,
  params
}: Props) {
  const { locale } = await params;
  // Ensure that the incoming `locale` is valid
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}