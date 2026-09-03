import React, { useState } from 'react';
import { FiPhoneCall, FiShield, FiAlertTriangle, FiActivity, FiVolume2 } from 'react-icons/fi';
import { EMERGENCY_NUMBERS } from '../../utils/constants';
import FakeCallModal from '../../components/safety/FakeCallModal';
import SirenAlarmButton from '../../components/safety/SirenAlarmButton';
import MedicalIDModal from '../../components/safety/MedicalIDModal';

const EmergencyHelp = () => {
  const [fakeCallOpen, setFakeCallOpen] = useState(false);
  const [medicalIdOpen, setMedicalIdOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 relative overflow-hidden">
      
      {/* Ambient background glow */}
      <div className="absolute top-0 right-1/3 w-80 h-80 bg-rose-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3 relative z-10">
        <span className="mono-tag mono-tag-rose">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 telemetry-dot"></span> Emergency Operations Desk
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-zinc-900 dark:text-white tracking-tight">
          Emergency Speed Dial & <span className="gradient-text-rose">Safety Utilities</span>
        </h1>
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
          Tap any hotline to call emergency dispatch immediately, or trigger instant deterrence tools.
        </p>
      </div>

      {/* Tactile Safety Quick Tools Banner */}
      <div className="glass-card-xl p-6 sm:p-8 border-rose-500/30 space-y-5 relative z-10">
        <div className="flex items-center justify-between border-b border-zinc-200/80 dark:border-zinc-800/80 pb-4">
          <div className="space-y-1">
            <h3 className="text-sm sm:text-base font-extrabold text-zinc-900 dark:text-white uppercase font-mono tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Instant Safety Deterrence Tools
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Tactile deterrence, acoustic alarms, and medical ID access</p>
          </div>
          <span className="mono-tag mono-tag-emerald py-1 text-[10px]">Active & Ready</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800/80 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-zinc-900 dark:text-white">Loud Acoustic Siren</h4>
              <p className="text-[11px] text-zinc-500">Maximum decibel alarm</p>
            </div>
            <SirenAlarmButton />
          </div>

          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800/80 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-zinc-900 dark:text-white">Fake Escape Call</h4>
              <p className="text-[11px] text-zinc-500">Realistic simulated caller</p>
            </div>
            <button
              onClick={() => setFakeCallOpen(true)}
              className="btn-solid text-xs !py-2 !px-3 font-mono shadow-sm"
            >
              <FiPhoneCall /> TRIGGER
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800/80 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-zinc-900 dark:text-white">Medical ID Card</h4>
              <p className="text-[11px] text-zinc-500">Blood group & allergies</p>
            </div>
            <button
              onClick={() => setMedicalIdOpen(true)}
              className="btn-danger text-xs !py-2 !px-3 font-mono shadow-md"
            >
              <FiActivity /> VIEW ID
            </button>
          </div>
        </div>
      </div>

      {/* Speed Dial Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {EMERGENCY_NUMBERS.map((num) => (
          <div key={num.id} className="product-card product-card-hover p-6 sm:p-7 space-y-5 text-center flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-rose-600 to-rose-700 text-white flex items-center justify-center text-2xl shadow-lg shadow-rose-600/30">
                <FiPhoneCall />
              </div>

              <div className="space-y-1.5">
                <span className="mono-tag mono-tag-zinc py-0.5">{num.category}</span>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white font-heading">{num.name}</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{num.description}</p>
              </div>
            </div>

            <a
              href={`tel:${num.number}`}
              className="w-full btn-danger py-3 text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-rose-600/20"
            >
              <FiPhoneCall /> Dial {num.number}
            </a>
          </div>
        ))}
      </div>

      {/* Modals */}
      <FakeCallModal isOpen={fakeCallOpen} onClose={() => setFakeCallOpen(false)} />
      <MedicalIDModal isOpen={medicalIdOpen} onClose={() => setMedicalIdOpen(false)} />
    </div>
  );
};

export default EmergencyHelp;
