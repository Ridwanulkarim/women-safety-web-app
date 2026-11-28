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
      className="h-9 px-3 rounded-lg bg-[#f4f4f5] dark:bg-[#232325] text-[#171717] dark:text-[#ededed] border border-zinc-900/10 dark:border-white/10 hover:border-zinc-900/20 dark:hover:border-white/20 flex items-center gap-2 text-xs font-medium cursor-pointer transition-colors duration-150"
      title="Switch language"
    >
      <FiGlobe className="w-4 h-4 text-[#525252] dark:text-[#a1a1a6] shrink-0 dispatch-icon" />
      <span className="hidden sm:inline">{language === 'en' ? 'English' : 'বাংলা'}</span>
      <span className="inline sm:hidden">{language === 'en' ? 'EN' : 'BN'}</span>
    </button>
  );
};

export default LanguageToggle;
