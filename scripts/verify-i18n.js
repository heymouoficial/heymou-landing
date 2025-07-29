#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const LOCALES_DIR = path.join(__dirname, '../locales');
const SUPPORTED_LOCALES = ['es', 'en'];

console.log('🌍 Verifying internationalization setup...\n');

let hasErrors = false;

// Function to print colored output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  reset: '\x1b[0m'
};

const printStatus = (message) => console.log(`${colors.green}✓${colors.reset} ${message}`);
const printError = (message) => {
  console.log(`${colors.red}✗${colors.reset} ${message}`);
  hasErrors = true;
};
const printWarning = (message) => console.log(`${colors.yellow}⚠${colors.reset} ${message}`);

// Check if locales directory exists
if (!fs.existsSync(LOCALES_DIR)) {
  printError('Locales directory not found');
  process.exit(1);
}

// Get all translation files for each locale
const getTranslationFiles = (locale) => {
  const localeDir = path.join(LOCALES_DIR, locale);
  if (!fs.existsSync(localeDir)) {
    return [];
  }
  return fs.readdirSync(localeDir).filter(file => file.endsWith('.json'));
};

// Load translation file
const loadTranslations = (locale, file) => {
  try {
    const filePath = path.join(LOCALES_DIR, locale, file);
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    printError(`Failed to load ${locale}/${file}: ${error.message}`);
    return null;
  }
};

// Get all translation keys recursively
const getTranslationKeys = (obj, prefix = '') => {
  const keys = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null) {
      keys.push(...getTranslationKeys(value, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
};

// Check if all locales have the same translation files
printStatus('Checking translation file consistency...');
const baseLocale = SUPPORTED_LOCALES[0];
const baseFiles = getTranslationFiles(baseLocale);

for (const locale of SUPPORTED_LOCALES.slice(1)) {
  const localeFiles = getTranslationFiles(locale);
  
  // Check for missing files
  for (const file of baseFiles) {
    if (!localeFiles.includes(file)) {
      printError(`Missing translation file: ${locale}/${file}`);
    }
  }
  
  // Check for extra files
  for (const file of localeFiles) {
    if (!baseFiles.includes(file)) {
      printWarning(`Extra translation file: ${locale}/${file}`);
    }
  }
}

// Check translation key consistency
printStatus('Checking translation key consistency...');
for (const file of baseFiles) {
  const baseTranslations = loadTranslations(baseLocale, file);
  if (!baseTranslations) continue;
  
  const baseKeys = getTranslationKeys(baseTranslations);
  
  for (const locale of SUPPORTED_LOCALES.slice(1)) {
    const translations = loadTranslations(locale, file);
    if (!translations) continue;
    
    const keys = getTranslationKeys(translations);
    
    // Check for missing keys
    for (const key of baseKeys) {
      if (!keys.includes(key)) {
        printError(`Missing translation key in ${locale}/${file}: ${key}`);
      }
    }
    
    // Check for extra keys
    for (const key of keys) {
      if (!baseKeys.includes(key)) {
        printWarning(`Extra translation key in ${locale}/${file}: ${key}`);
      }
    }
  }
}

// Check for empty translations
printStatus('Checking for empty translations...');
for (const locale of SUPPORTED_LOCALES) {
  for (const file of getTranslationFiles(locale)) {
    const translations = loadTranslations(locale, file);
    if (!translations) continue;
    
    const keys = getTranslationKeys(translations);
    for (const key of keys) {
      const value = key.split('.').reduce((obj, k) => obj?.[k], translations);
      if (!value || value.trim() === '') {
        printWarning(`Empty translation in ${locale}/${file}: ${key}`);
      }
    }
  }
}

// Check for placeholder consistency
printStatus('Checking placeholder consistency...');
for (const file of baseFiles) {
  const baseTranslations = loadTranslations(baseLocale, file);
  if (!baseTranslations) continue;
  
  const baseKeys = getTranslationKeys(baseTranslations);
  
  for (const key of baseKeys) {
    const baseValue = key.split('.').reduce((obj, k) => obj?.[k], baseTranslations);
    if (!baseValue) continue;
    
    const basePlaceholders = (baseValue.match(/\{[^}]+\}/g) || []).sort();
    
    for (const locale of SUPPORTED_LOCALES.slice(1)) {
      const translations = loadTranslations(locale, file);
      if (!translations) continue;
      
      const value = key.split('.').reduce((obj, k) => obj?.[k], translations);
      if (!value) continue;
      
      const placeholders = (value.match(/\{[^}]+\}/g) || []).sort();
      
      if (JSON.stringify(basePlaceholders) !== JSON.stringify(placeholders)) {
        printError(`Placeholder mismatch in ${locale}/${file} for key ${key}`);
        console.log(`  Base (${baseLocale}): ${basePlaceholders.join(', ')}`);
        console.log(`  ${locale}: ${placeholders.join(', ')}`);
      }
    }
  }
}

console.log('\n' + '='.repeat(50));
if (hasErrors) {
  printError('Internationalization verification failed!');
  console.log('\nPlease fix the errors above before deploying.');
  process.exit(1);
} else {
  printStatus('🎉 Internationalization verification passed!');
  console.log('\nAll translation files are consistent and ready for deployment.');
}