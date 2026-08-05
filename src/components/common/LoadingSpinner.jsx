import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ size = 'medium', message = 'Loading SafeHaven...' }) => {
  const dimensions = size === 'small' ? 'w-6 h-6' : size === 'large' ? 'w-16 h-16' : 'w-10 h-10';

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-4">
      <motion.div
        className={`${dimensions} border-4 border-pink-500/20 border-t-pink-600 rounded-full`}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
      />
      {message && (
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
