import React from 'react';
import { motion } from 'framer-motion';
import { FiAlertCircle } from 'react-icons/fi';
import { useSOS } from '../../context/SOSContext';

const SOSButton = ({ size = 'large', label = 'EMERGENCY SOS' }) => {
  const { openSOSModal, isSOSActive } = useSOS();

  const isLg = size === 'large';

  return (
    <div className="flex flex-col items-center justify-center">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={openSOSModal}
        className={`relative group rounded-full font-black text-white shadow-2xl flex flex-col items-center justify-center transition-all ${
          isLg ? 'w-48 h-48 sm:w-56 sm:h-56 text-xl' : 'w-24 h-24 text-sm'
        } ${
          isSOSActive
            ? 'bg-red-600 animate-pulse shadow-red-600/70 ring-8 ring-red-500/50'
            : 'bg-gradient-to-tr from-pink-600 via-pink-500 to-rose-600 shadow-pink-600/50 sos-pulse-button'
        }`}
      >
        <span className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition" />
        <FiAlertCircle className={`${isLg ? 'w-16 h-16 sm:w-20 sm:h-20' : 'w-8 h-8'} mb-1 animate-bounce`} />
        <span className="tracking-widest uppercase font-heading">{label}</span>
        {isLg && <span className="text-[10px] opacity-80 mt-1 font-sans">TAP FOR QUICK DISTRESS</span>}
      </motion.button>
    </div>
  );
};

export default SOSButton;
