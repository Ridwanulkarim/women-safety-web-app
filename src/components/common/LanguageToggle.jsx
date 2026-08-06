import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { FiGlobe } from 'react-icons/fi';

const LanguageToggle = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      type="button"
      aria-label="Toggle language"
      className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 transition flex items-center gap-1.5 font-mono text-xs font-extrabold cursor-pointer active:scale-95 shadow-xs"
      title="Switch Language / ভাষা পরিবর্তন করুন"
    >
      <FiGlobe className="w-4 h-4 text-rose-600 dark:text-rose-400" />
      <span>{language === 'en' ? 'ENGLISH' : 'বাংলা'}</span>
    </button>
  );
};

export default LanguageToggle;
