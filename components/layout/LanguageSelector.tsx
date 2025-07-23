'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ChevronDownIcon } from 'lucide-react';

import { useTranslation } from '../../src/hooks/useTranslation';
import { locales } from '../../src/i18n';

// Language configuration with flags
const languageConfig = {
  es: {
    name: 'Español',
    flag: '🇪🇸',
    code: 'ES'
  },
  en: {
    name: 'English',
    flag: '🇺🇸',
    code: 'EN'
  }
};

export default function LanguageSelector() {
  const { locale } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLanguageChange = (newLocale: string) => {
    // Remove the current locale from the pathname
    const pathWithoutLocale = pathname.replace(`/${locale}`, '');
    // Navigate to the new locale
    router.push(`/${newLocale}${pathWithoutLocale}`);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLanguage = languageConfig[locale as keyof typeof languageConfig];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-2 bg-neutral-900 border border-neutral-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary hover:border-neutral-600 hover:bg-neutral-800 hover:shadow-sm transition-all duration-200 cursor-pointer min-w-[100px]"
        aria-label="Select language"
      >
        <div className="flex items-center gap-2">
          <span className="text-base leading-none">{currentLanguage.flag}</span>
          <span className="font-medium text-neutral-100">{currentLanguage.code}</span>
        </div>
        <ChevronDownIcon 
          className={`w-4 h-4 text-neutral-400 transition-transform duration-200 flex-shrink-0 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full mt-2 right-0 bg-neutral-900/95 backdrop-blur-sm border border-neutral-700 rounded-lg shadow-xl overflow-hidden z-50 min-w-[140px] animate-in fade-in-0 zoom-in-95 duration-200 origin-top-right">
          {locales.map((loc) => {
            const lang = languageConfig[loc as keyof typeof languageConfig];
            const isSelected = loc === locale;
            
            return (
              <button
                key={loc}
                onClick={() => handleLanguageChange(loc)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-all duration-150 ${
                  isSelected 
                    ? 'bg-primary text-white shadow-sm' 
                    : 'text-neutral-200 hover:bg-neutral-800 hover:text-white'
                }`}
              >
                <span className="text-base leading-none">{lang.flag}</span>
                <span className="font-medium">{lang.name}</span>
                {isSelected && (
                  <span className="ml-auto">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}