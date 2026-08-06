import React from 'react';
import { FiX, FiActivity, FiUser, FiPhone, FiHeart, FiDroplet } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const MedicalIDModal = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md">
      <div className="relative max-w-md w-full product-card p-6 sm:p-8 space-y-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-zinc-200 rounded-lg bg-zinc-100 dark:bg-zinc-800"
        >
          <FiX className="w-4 h-4" />
        </button>

        <div className="space-y-1">
          <span className="mono-tag mono-tag-rose">First Responder Badge</span>
          <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white font-heading">
            Emergency Medical ID
          </h3>
          <p className="text-xs text-zinc-500">
            Vital health telemetry for emergency medical responders & paramedics.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={user?.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                alt={user?.fullName}
                className="w-12 h-12 rounded-xl object-cover ring-2 ring-rose-500/40"
              />
              <div>
                <h4 className="font-extrabold text-sm text-zinc-900 dark:text-white">{user?.fullName || 'Jane Doe'}</h4>
                <p className="text-[11px] font-mono text-zinc-500">{user?.email}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono uppercase text-zinc-400">BLOOD TYPE</span>
              <p className="text-lg font-black text-rose-600 dark:text-rose-400 font-mono">B +ve</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-rose-500/20 text-xs font-mono">
            <div>
              <span className="text-[10px] text-zinc-400">ALLERGIES</span>
              <p className="font-semibold text-zinc-800 dark:text-zinc-200">Penicillin, Peanuts</p>
            </div>
            <div>
              <span className="text-[10px] text-zinc-400">MEDICAL CONDITIONS</span>
              <p className="font-semibold text-zinc-800 dark:text-zinc-200">Asthma</p>
            </div>
          </div>
        </div>

        <div className="space-y-2 text-xs">
          <h4 className="font-bold text-zinc-900 dark:text-white font-mono uppercase text-[11px]">Primary Contact</h4>
          <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <div>
              <p className="font-bold text-zinc-800 dark:text-zinc-200">Sarah Connor (Mother)</p>
              <p className="text-zinc-500 font-mono text-[11px]">+880 1711-999999</p>
            </div>
            <a href="tel:+8801711999999" className="btn-solid !py-1.5 !px-3 text-[11px]">
              <FiPhone /> Call
            </a>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full btn-outline py-2.5 text-xs"
        >
          Close Medical ID
        </button>
      </div>
    </div>
  );
};

export default MedicalIDModal;
