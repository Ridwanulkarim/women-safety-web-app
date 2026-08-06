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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="mono-tag mono-tag-rose">Emergency Operations Desk</span>
        <h1 className="text-3xl font-extrabold font-heading text-zinc-900 dark:text-white">
          Emergency Speed Dial & Safety Utilities
        </h1>
        <p className="text-xs text-zinc-500">
          Tap any hotline to call emergency dispatch, or trigger tactile safety tools.
        </p>
      </div>

      {/* Tactile Safety Quick Tools Banner */}
      <div className="product-card p-6 border-rose-500/20 bg-rose-500/5 space-y-4">
        <div className="flex items-center justify-between border-b border-rose-500/20 pb-3">
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase font-mono tracking-wider">
              Instant Safety Tools
            </h3>
            <p className="text-xs text-zinc-500">Quick deterrence and escape utilities</p>
          </div>
          <span className="mono-tag mono-tag-emerald">Ready</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <SirenAlarmButton />

          <button
            onClick={() => setFakeCallOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-mono text-xs font-bold flex items-center gap-2 transition active:scale-95 shadow-sm"
          >
            <FiPhoneCall /> FAKE CALL GENERATOR
          </button>

          <button
            onClick={() => setMedicalIdOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-mono text-xs font-bold flex items-center gap-2 transition active:scale-95 shadow-sm"
          >
            <FiActivity /> EMERGENCY MEDICAL ID
          </button>
        </div>
      </div>

      {/* Speed Dial Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {EMERGENCY_NUMBERS.map((num) => (
          <div key={num.id} className="product-card p-6 space-y-4 text-center">
            <div className="w-12 h-12 mx-auto rounded-xl bg-rose-600 text-white flex items-center justify-center text-2xl shadow-sm">
              <FiPhoneCall />
            </div>

            <div className="space-y-1">
              <span className="mono-tag mono-tag-zinc">{num.category}</span>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">{num.name}</h3>
              <p className="text-xs text-zinc-500">{num.description}</p>
            </div>

            <a
              href={`tel:${num.number}`}
              className="w-full btn-solid py-3 text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <FiPhoneCall /> Call {num.number}
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
