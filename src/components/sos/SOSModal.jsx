import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertTriangle, FiX, FiCheckCircle, FiMapPin, FiPhone } from 'react-icons/fi';
import { useSOS } from '../../context/SOSContext';
import { useGeolocation } from '../../hooks/useGeolocation';

const SOSModal = () => {
  const { sosModalOpen, closeSOSModal, sendSOSAlert, isSOSActive, resolveSOS, activeSOSData } = useSOS();
  const location = useGeolocation(true);
  const [countdown, setCountdown] = useState(3);
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  useEffect(() => {
    let timer;
    if (sosModalOpen && countdown > 0 && !isSOSActive && isBroadcasting) {
      timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
    } else if (countdown === 0 && isBroadcasting && !isSOSActive) {
      sendSOSAlert(location);
      setIsBroadcasting(false);
    }
    return () => clearInterval(timer);
  }, [sosModalOpen, countdown, isBroadcasting, isSOSActive]);

  const handleStartBroadcast = () => {
    setCountdown(3);
    setIsBroadcasting(true);
  };

  const handleCancelCountdown = () => {
    setIsBroadcasting(false);
    setCountdown(3);
  };

  if (!sosModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative max-w-md w-full glass-card p-6 sm:p-8 rounded-3xl border-2 border-pink-500/30 text-center shadow-2xl space-y-6"
        >
          {/* Close Button */}
          <button
            onClick={closeSOSModal}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/50"
          >
            <FiX className="w-5 h-5" />
          </button>

          {isSOSActive ? (
            /* Active SOS Status State */
            <div className="space-y-6">
              <div className="w-20 h-20 mx-auto bg-red-600/20 text-red-500 rounded-full flex items-center justify-center text-4xl animate-pulse ring-8 ring-red-500/20">
                <FiAlertTriangle />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-red-500 font-heading">🚨 SOS BROADCAST ACTIVE</h3>
                <p className="text-sm text-slate-300">
                  Distress signal has been sent. Emergency contacts and command center have received your live location.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 text-left space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2 text-pink-400 font-semibold">
                  <FiMapPin /> <span>Live Location Captured</span>
                </div>
                <p>{location.address || 'Dhaka, Bangladesh'}</p>
                <p className="text-[10px] text-slate-400">Lat: {location.latitude.toFixed(4)}, Lng: {location.longitude.toFixed(4)}</p>
              </div>

              <div className="flex flex-col gap-3">
                <a
                  href="tel:999"
                  className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm uppercase flex items-center justify-center gap-2 shadow-lg shadow-red-600/40"
                >
                  <FiPhone /> Call 999 Police Dispatch
                </a>
                <button
                  onClick={() => {
                    resolveSOS(activeSOSData?.id);
                    closeSOSModal();
                  }}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2"
                >
                  <FiCheckCircle /> Mark Myself Safe & Resolve
                </button>
              </div>
            </div>
          ) : isBroadcasting ? (
            /* Countdown Confirmation State */
            <div className="space-y-6">
              <div className="w-24 h-24 mx-auto rounded-full bg-pink-600 text-white flex items-center justify-center text-5xl font-black font-heading animate-ping">
                {countdown}
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-slate-100 font-heading">Broadcasting SOS in {countdown}s</h3>
                <p className="text-xs text-slate-400">
                  Tap cancel if this was an accidental trigger.
                </p>
              </div>

              <button
                onClick={handleCancelCountdown}
                className="w-full py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm uppercase tracking-wider"
              >
                Cancel Broadcast
              </button>
            </div>
          ) : (
            /* Initial Trigger State */
            <div className="space-y-6">
              <div className="w-20 h-20 mx-auto bg-pink-500/20 text-pink-500 rounded-full flex items-center justify-center text-4xl">
                <FiAlertTriangle />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-slate-100 font-heading">Confirm Emergency SOS</h3>
                <p className="text-xs text-slate-400">
                  This will transmit your live GPS location and alert all 5 emergency contacts immediately.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900/60 text-left text-xs space-y-1 text-slate-300">
                <p className="font-semibold text-pink-400 flex items-center gap-1.5"><FiMapPin /> Current GPS Coordinates:</p>
                <p>{location.address}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={closeSOSModal}
                  className="py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStartBroadcast}
                  className="py-3 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-pink-600/30"
                >
                  Trigger SOS
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SOSModal;
