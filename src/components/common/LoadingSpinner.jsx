import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ size = 'medium', message = 'Loading SafeHaven' }) => {
  const dimensions = size === 'small' ? 'w-5 h-5' : size === 'large' ? 'w-10 h-10' : 'w-7 h-7';

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-3">
      <motion.div
        className={`${dimensions} border-2 border-zinc-900/10 dark:border-white/15 border-t-[#e11d48] rounded-full`}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}
      />
      {message && (
        <p className="text-sm font-normal text-[#737373] dark:text-[#85858b]">
          {message}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
