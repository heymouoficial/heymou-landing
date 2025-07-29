# Internationalization Implementation

## Overview

This document describes the complete internationalization (i18n) implementation for the HeyMou platform using `next-intl`. The system supports Spanish (es) and English (en) locales with automatic language detection and seamless switching.

## ✅ Implemented Features

### 1. Core Configuration

- **next-intl**: Installed and configured with Next.js 15+ App Router
- **Middleware**: Automatic locale detection and routing
- **TypeScript**: Full type safety for translations and locales

### 2. Translation Structure

```
locales/
├── es/
│   ├── common.json      # Shared translations (buttons, labels, etc.)
│   ├── navigation.json  # Navigation menu items
│   ├── homepage.json    # Homepage-specific content
│   └── services.json    # Services section content
└── en/
    ├── common.json
    ├── navigation.json
    ├── homepage.json
    └── services.json
```

### 3. Components

- **LanguageSelector**: Dropdown component for language switching
- **Enhanced useTranslation hook**: Locale switching and path utilities
- **Type-safe translations**: Full TypeScript support

### 4. Utility Functions

- **i18n-utils.ts**: Comprehensive utilities for:
  - Locale validation
  - Date/number/currency formatting
  - Path localization
  - Accept-Language header parsing

### 5. Routing & URLs

- **Locale prefixes**: `/es/` and `/en/` URL structure
- **Automatic detection**: Browser language preference detection
- **Fallback**: Spanish (es) as default locale

## 🚀 Usage Examples

### Basic Translation

```tsx
import { useTranslation } from '@/hooks/useTranslation';

function MyComponent() {
  const { t, locale } = useTranslation();
  
  return (
    <div>
      <h1>{t('hero.title')}</h1>
      <p>Current locale: {locale}</p>
    </div>
  );
}
```

### Language Switching

```tsx
import { LanguageSelector } from '@/components/layout/LanguageSelector';

function Header() {
  return (
    <header>
      <nav>
        {/* Other nav items */}
        <LanguageSelector variant="compact" />
      </nav>
    </header>
  );
}
```

### Localized Paths

```tsx
import { useTranslation } from '@/hooks/useTranslation';

function Navigation() {
  const { getLocalizedPath, locale } = useTranslation();
  
  return (
    <Link href={getLocalizedPath('/about')}>
      About
    </Link>
  );
}
```

### Date/Number Formatting

```tsx
import { formatDate, formatCurrency } from '@/lib/i18n-utils';

function BlogPost({ date, price, locale }) {
  return (
    <div>
      <time>{formatDate(date, locale)}</time>
      <span>{formatCurrency(price, locale)}</span>
    </div>
  );
}
```

## 📁 File Structure

```
src/
├── i18n.ts                    # Main i18n configuration
├── middleware.ts              # Locale routing middleware
├── hooks/
│   └── useTranslation.ts      # Enhanced translation hook
├── components/
│   └── layout/
│       └── LanguageSelector.tsx # Language switching component
├── lib/
│   └── i18n-utils.ts          # Utility functions
└── types/
    └── i18n.ts                # TypeScript definitions

locales/
├── es/                        # Spanish translations
└── en/                        # English translations
```

## 🔧 Configuration Files

### next.config.ts
```typescript
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');
export default withNextIntl(nextConfig);
```

### middleware.ts
```typescript
import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['es', 'en'],
  defaultLocale: 'es',
  localePrefix: 'always',
  localeDetection: true,
});
```

## 🌐 Supported Locales

| Locale | Language | Default | Status |
|--------|----------|---------|--------|
| `es`   | Spanish  | ✅ Yes  | ✅ Active |
| `en`   | English  | ❌ No   | ✅ Active |

## 📋 Translation Keys Structure

### Common Keys
- `loading`, `error`, `success`
- `submit`, `cancel`, `close`
- `readMore`, `contactUs`, `learnMore`
- Navigation items
- SEO metadata

### Homepage Keys
- `hero.title`, `hero.subtitle`
- `hero.ctaPrimary`, `hero.ctaSecondary`
- Statistics and metrics

### Services Keys
- Service descriptions and features
- Call-to-action buttons
- Value propositions

## 🧪 Testing

Run the verification script to ensure all components are properly configured:

```bash
node scripts/verify-i18n.js
```

## 🚀 Deployment Considerations

1. **Static Generation**: Translation files are bundled at build time
2. **SEO**: Proper hreflang tags and localized meta data
3. **Performance**: Optimized bundle splitting by locale
4. **Caching**: Static translations with ISR support

## 📈 Future Enhancements

- [ ] Add more locales (French, Portuguese, etc.)
- [ ] Implement translation management system
- [ ] Add pluralization rules
- [ ] Rich text formatting support
- [ ] Translation validation tools

## 🔍 Troubleshooting

### Common Issues

1. **Missing translations**: Check translation files exist and keys match
2. **Locale not detected**: Verify middleware configuration
3. **TypeScript errors**: Ensure all imports use correct paths
4. **Build failures**: Run type-check before building

### Debug Commands

```bash
# Type checking
npm run type-check

# Build verification
npm run build

# Translation verification
node scripts/verify-i18n.js
```

## 📚 Resources

- [next-intl Documentation](https://next-intl-docs.vercel.app/)
- [Next.js Internationalization](https://nextjs.org/docs/app/building-your-application/routing/internationalization)
- [ICU Message Format](https://formatjs.io/docs/core-concepts/icu-syntax/)

---

**Status**: ✅ Complete and fully functional
**Last Updated**: 2024-07-24
**Version**: 1.0.0