import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslation from './locales/en.json';
import bnTranslation from './locales/bn.json';

const resources = {
  en: {
    translation: enTranslation
  },
  bn: {
    translation: bnTranslation
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'safehaven_i18n_lang',
      caches: ['localStorage']
    },
    interpolation: {
      escapeValue: false // React handles XSS security automatically
    }
  });

export default i18n;
