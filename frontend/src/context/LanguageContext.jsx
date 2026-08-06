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

  const t = (key) => {
    const parts = key.split('.');
    let current = translations[language];
    for (const part of parts) {
      if (current && current[part] !== undefined) {
        current = current[part];
      } else {
        // Fallback to English
        let fallback = translations['en'];
        for (const p of parts) {
          if (fallback && fallback[p] !== undefined) {
            fallback = fallback[p];
          } else {
            return key;
          }
        }
        return fallback;
      }
    }
    return current;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
