import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { FiGlobe } from 'react-icons/fi';

const LanguageToggle = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      aria-label="Toggle language"
      className="px-2.5 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition flex items-center gap-1.5 font-mono text-xs font-bold"
      title="Switch Language / ভাষা পরিবর্তন"
    >
      <FiGlobe className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
      <span>{language === 'en' ? 'বাংলা' : 'EN'}</span>
    </button>
  );
};

export default LanguageToggle;
