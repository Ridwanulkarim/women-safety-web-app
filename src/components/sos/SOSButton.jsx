import React from 'react';
import { FiAlertCircle } from 'react-icons/fi';
import { useSOS } from '../../context/SOSContext';
import { useLanguage } from '../../context/LanguageContext';

const SOSButton = ({ size = 'large', label }) => {
  const { openSOSModal, isSOSActive } = useSOS();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const defaultLabel = isBn ? 'জরুরি এসওএস' : 'Emergency SOS';
  const displayLabel = label || defaultLabel;
  const isLg = size === 'large';

  return (
    <div className="flex flex-col items-center justify-center">
      <button
        type="button"
        onClick={openSOSModal}
        className={`relative rounded-full font-medium text-white flex flex-col items-center justify-center cursor-pointer transition-[background-color,transform] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.97] border border-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] ${
          isLg ? 'w-44 h-44 sm:w-48 sm:h-48 text-base' : 'w-24 h-24 text-xs'
        } ${
          isSOSActive
            ? 'bg-[#b91c1c] ring-4 ring-[#dc2626]/30'
            : 'bg-[#dc2626] hover:bg-[#b91c1c] ring-4 ring-zinc-900/[0.06] dark:ring-white/[0.06]'
        }`}
      >
        <FiAlertCircle className={`${isLg ? 'w-10 h-10 mb-2' : 'w-6 h-6 mb-1'} dispatch-icon`} />
        <span className="font-medium tracking-[-0.01em]">{displayLabel}</span>
        {isLg && (
          <span className="text-xs text-white/80 mt-1 font-normal">
            {isBn ? 'পাঠাতে ট্যাপ করুন' : 'Tap to trigger'}
          </span>
        )}
      </button>
    </div>
  );
};

export default SOSButton;
