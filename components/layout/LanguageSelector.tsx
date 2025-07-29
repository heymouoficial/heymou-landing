'use client';

import { useState } from 'react';
import { ChevronDown, Globe } from 'lucide-react';

import { useTranslation } from '@/hooks/useTranslation';
import { Locale } from '@/i18n';

interface LanguageSelectorProps {
  className?: string;
  variant?: 'default' | 'compact';
}

export function LanguageSelector({ 
  className = '', 
  variant = 'default' 
}: LanguageSelectorProps) {
  const { t, locale, switchLocale, availableLocales } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const languages = {
    es: {
      code: 'es',
      name: t('spanish'),
      flag: '🇪🇸',
      nativeName: 'Español'
    },
    en: {
      code: 'en', 
      name: t('english'),
      flag: '🇺🇸',
      nativeName: 'English'
    }
  };

  const currentLanguage = languages[locale];

  const handleLanguageChange = (newLocale: Locale) => {
    switchLocale(newLocale);
    setIsOpen(false);
  };

  if (variant === 'compact') {
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          aria-label={t('language')}
        >
          <Globe className="h-4 w-4" />
          <span className="uppercase">{currentLanguage.code}</span>
          <ChevronDown className={`h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute right-0 top-full mt-2 z-50 min-w-[120px] bg-background border border-border rounded-md shadow-lg">
              {availableLocales.map((localeCode) => {
                const lang = languages[localeCode];
                return (
                  <button
                    key={localeCode}
                    onClick={() => handleLanguageChange(localeCode)}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors ${
                      locale === localeCode ? 'bg-muted text-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.nativeName}</span>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-background border border-border rounded-md hover:bg-muted transition-colors"
        aria-label={t('language')}
      >
        <Globe className="h-4 w-4" />
        <span>{currentLanguage.flag}</span>
        <span>{currentLanguage.name}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 z-50 min-w-[160px] bg-background border border-border rounded-md shadow-lg">
            {availableLocales.map((localeCode) => {
              const lang = languages[localeCode];
              return (
                <button
                  key={localeCode}
                  onClick={() => handleLanguageChange(localeCode)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted transition-colors ${
                    locale === localeCode ? 'bg-muted text-foreground' : 'text-muted-foreground'
                  }`}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{lang.nativeName}</span>
                    <span className="text-xs text-muted-foreground">{lang.name}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}