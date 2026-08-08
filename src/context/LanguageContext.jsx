import React, { createContext, useContext, useState, useEffect } from 'react';
import enTranslation from '../i18n/locales/en.json';
import bnTranslation from '../i18n/locales/bn.json';

const LanguageContext = createContext();

export const translations = {
  en: enTranslation,
  bn: bnTranslation
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('safehaven_i18n_lang') || localStorage.getItem('safehaven_lang');
    return saved ? saved : 'en';
  });

  useEffect(() => {
    localStorage.setItem('safehaven_i18n_lang', language);
    localStorage.setItem('safehaven_lang', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'bn' : 'en'));
  };

  /**
   * Bulletproof i18n resolution: Always returns a valid string, never an Object.
   */
  const t = (key) => {
    if (!key || typeof key !== 'string') return '';

    const parts = key.split('.');

    const resolvePath = (dict, pathArray) => {
      let current = dict;
      for (const p of pathArray) {
        if (current && typeof current === 'object' && current[p] !== undefined) {
          current = current[p];
        } else {
          return null;
        }
      }
      return typeof current === 'string' ? current : null;
    };

    // 1. Try exact path in active language
    let result = resolvePath(translations[language], parts);
    if (result) return result;

    // 2. Try exact path in English fallback
    result = resolvePath(translations['en'], parts);
    if (result) return result;

    // 3. Search top-level namespaces if flat key was passed (e.g. 'home' or 'brandName')
    const activeDict = translations[language] || {};
    for (const ns of Object.keys(activeDict)) {
      if (typeof activeDict[ns] === 'object' && activeDict[ns][key]) {
        const val = activeDict[ns][key];
        if (typeof val === 'string') return val;
      }
    }

    const fallbackDict = translations['en'] || {};
    for (const ns of Object.keys(fallbackDict)) {
      if (typeof fallbackDict[ns] === 'object' && fallbackDict[ns][key]) {
        const val = fallbackDict[ns][key];
        if (typeof val === 'string') return val;
      }
    }

    // 4. Fallback: Return formatted key string (never an object!)
    return parts[parts.length - 1] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
