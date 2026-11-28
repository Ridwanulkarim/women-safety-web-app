import React from 'react';
import { FiShield } from 'react-icons/fi';

/**
 * Flat monochrome/crimson brand mark pairing a solid crimson square mark with the SafeHaven wordmark.
 */
const BrandMark = ({ name = 'SafeHaven', subtitle = null, inverted = false }) => {
  return (
    <div className="flex items-center gap-2.5 min-w-0">
      <div className="w-8 h-8 rounded-lg bg-[#e11d48] text-white flex items-center justify-center shrink-0">
        <FiShield className="w-4 h-4 dispatch-icon" />
      </div>
      <div className="min-w-0">
        <span
          className={`text-base font-semibold tracking-[-0.01em] block leading-tight truncate ${
            inverted ? 'text-[#ededed]' : 'text-[#171717] dark:text-[#ededed]'
          }`}
        >
          {name}
        </span>
        {subtitle && (
          <span
            className={`text-xs block leading-tight truncate ${
              inverted ? 'text-[#a1a1a6]' : 'text-[#737373] dark:text-[#85858b]'
            }`}
          >
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
};

export default BrandMark;
