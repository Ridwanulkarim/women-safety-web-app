import React from 'react';
import { Link } from 'react-router-dom';
import { FiAlertOctagon, FiHome } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext';

const NotFound = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full surface-panel p-8 text-center space-y-5">
        <div className="w-10 h-10 mx-auto rounded-lg bg-[#e11d48]/10 text-[#e11d48] flex items-center justify-center">
          <FiAlertOctagon className="w-5 h-5 dispatch-icon" />
        </div>
        <div className="space-y-2">
          <span className="font-mono tabular-nums text-xs text-[#737373] dark:text-[#85858b] block">
            {isBn ? 'ত্রুটি ৪০৪' : 'Error 404'}
          </span>
          <h1 className="text-xl font-medium text-[#171717] dark:text-[#ededed]">
            {isBn ? 'পৃষ্ঠাটি খুঁজে পাওয়া যায়নি' : 'Page not found'}
          </h1>
          <p className="text-sm text-[#525252] dark:text-[#a1a1a6]">
            {isBn
              ? 'আপনার অনুরোধ করা পৃষ্ঠাটি পাওয়া যায়নি অথবা স্থানান্তরিত হয়েছে।'
              : 'The page you requested does not exist or has been moved.'}
          </p>
        </div>

        <Link to="/" className="btn-solid h-11 px-5 text-sm inline-flex">
          <FiHome className="w-4 h-4 dispatch-icon" /> {isBn ? 'হোম পেজে ফিরুন' : 'Return home'}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
