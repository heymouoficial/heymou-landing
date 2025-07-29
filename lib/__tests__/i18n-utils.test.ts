/**
 * @jest-environment jsdom
 */

import {
  isValidLocale,
  getDefaultLocale,
  getAlternateLocale,
  formatDate,
  formatNumber,
  formatCurrency,
  getReadingTimeText,
  getLocalizedPath,
  removeLocaleFromPath,
  getLocaleFromPath,
  generateAlternateLinks,
  getLocaleFromAcceptLanguage,
} from '../i18n-utils';

describe('i18n-utils', () => {
  describe('isValidLocale', () => {
    it('should return true for valid locales', () => {
      expect(isValidLocale('es')).toBe(true);
      expect(isValidLocale('en')).toBe(true);
    });

    it('should return false for invalid locales', () => {
      expect(isValidLocale('fr')).toBe(false);
      expect(isValidLocale('de')).toBe(false);
      expect(isValidLocale('')).toBe(false);
    });
  });

  describe('getDefaultLocale', () => {
    it('should return Spanish as default locale', () => {
      expect(getDefaultLocale()).toBe('es');
    });
  });

  describe('getAlternateLocale', () => {
    it('should return alternate locale', () => {
      expect(getAlternateLocale('es')).toBe('en');
      expect(getAlternateLocale('en')).toBe('es');
    });
  });

  describe('formatDate', () => {
    const testDate = new Date('2024-01-15');

    it('should format date in Spanish', () => {
      const formatted = formatDate(testDate, 'es');
      expect(formatted).toContain('enero');
      expect(formatted).toContain('2024');
    });

    it('should format date in English', () => {
      const formatted = formatDate(testDate, 'en');
      expect(formatted).toContain('January');
      expect(formatted).toContain('2024');
    });

    it('should handle string dates', () => {
      const formatted = formatDate('2024-01-15', 'en');
      expect(formatted).toContain('January');
    });
  });

  describe('formatNumber', () => {
    it('should format numbers according to locale', () => {
      expect(formatNumber(1234.56, 'es')).toBe('1.234,56');
      expect(formatNumber(1234.56, 'en')).toBe('1,234.56');
    });
  });

  describe('formatCurrency', () => {
    it('should format currency according to locale', () => {
      const esFormatted = formatCurrency(1234.56, 'es');
      const enFormatted = formatCurrency(1234.56, 'en');
      
      expect(esFormatted).toContain('1.234,56');
      expect(enFormatted).toContain('1,234.56');
    });
  });

  describe('getReadingTimeText', () => {
    it('should return Spanish reading time text', () => {
      expect(getReadingTimeText(5, 'es')).toBe('5 min de lectura');
    });

    it('should return English reading time text', () => {
      expect(getReadingTimeText(5, 'en')).toBe('5 min read');
    });
  });

  describe('getLocalizedPath', () => {
    it('should create localized paths', () => {
      expect(getLocalizedPath('/about', 'es')).toBe('/es/about');
      expect(getLocalizedPath('about', 'en')).toBe('/en/about');
      expect(getLocalizedPath('', 'es')).toBe('/es');
    });
  });

  describe('removeLocaleFromPath', () => {
    it('should remove locale from path', () => {
      expect(removeLocaleFromPath('/es/about')).toBe('/about');
      expect(removeLocaleFromPath('/en/services')).toBe('/services');
      expect(removeLocaleFromPath('/about')).toBe('/about');
    });
  });

  describe('getLocaleFromPath', () => {
    it('should extract locale from path', () => {
      expect(getLocaleFromPath('/es/about')).toBe('es');
      expect(getLocaleFromPath('/en/services')).toBe('en');
      expect(getLocaleFromPath('/about')).toBeNull();
    });
  });

  describe('generateAlternateLinks', () => {
    it('should generate alternate language links', () => {
      const links = generateAlternateLinks('/es/about');
      
      expect(links).toHaveLength(2);
      expect(links[0]).toEqual({ hrefLang: 'es', href: '/es/about' });
      expect(links[1]).toEqual({ hrefLang: 'en', href: '/en/about' });
    });
  });

  describe('getLocaleFromAcceptLanguage', () => {
    it('should return default locale for undefined input', () => {
      expect(getLocaleFromAcceptLanguage()).toBe('es');
    });

    it('should parse Accept-Language header correctly', () => {
      expect(getLocaleFromAcceptLanguage('en-US,en;q=0.9')).toBe('en');
      expect(getLocaleFromAcceptLanguage('es-ES,es;q=0.9')).toBe('es');
      expect(getLocaleFromAcceptLanguage('fr-FR,fr;q=0.9')).toBe('es'); // fallback
    });

    it('should handle quality values', () => {
      expect(getLocaleFromAcceptLanguage('fr;q=0.9,en;q=0.8,es;q=0.7')).toBe('en');
    });
  });
});