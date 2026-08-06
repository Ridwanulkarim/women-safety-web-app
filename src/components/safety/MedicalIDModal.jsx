import React, { useState } from 'react';
import { FiX, FiActivity, FiUser, FiPhone, FiCheck, FiPlusCircle, FiEdit2 } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const MedicalIDModal = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  // Load saved Medical ID from localStorage
  const savedData = (() => {
    try {
      const item = localStorage.getItem('safehaven_medical_id');
      return item ? JSON.parse(item) : null;
    } catch (e) {
      return null;
    }
  })();

  const [isEditing, setIsEditing] = useState(!savedData);

  const [formData, setFormData] = useState({
    bloodType: savedData?.bloodType || 'B +ve',
    allergies: savedData?.allergies || '',
    medicalConditions: savedData?.medicalConditions || '',
    contactName: savedData?.contactName || '',
    contactPhone: savedData?.contactPhone || ''
  });

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('safehaven_medical_id', JSON.stringify(formData));
    setIsEditing(false);
    toast.success('Emergency Medical ID saved successfully!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md">
      <div className="relative max-w-md w-full product-card p-6 sm:p-8 space-y-6 shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-zinc-200 rounded-lg bg-zinc-100 dark:bg-zinc-800"
        >
          <FiX className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="space-y-1">
          <span className="mono-tag mono-tag-rose">First Responder Telemetry</span>
          <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white font-heading">
            {isEditing ? 'Add / Update Medical ID' : 'Emergency Medical ID Badge'}
          </h3>
          <p className="text-xs text-zinc-500">
            {isEditing ? 'Fill in your personal health details for first responders.' : 'Vital health telemetry for emergency paramedics.'}
          </p>
        </div>

        {/* 1. INPUT FORM MODE */}
        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-4 pt-1">
            <div>
              <label className="human-label">Blood Type</label>
              <select
                value={formData.bloodType}
                onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                className="human-input font-mono font-bold text-rose-600 dark:text-rose-400"
              >
                <option value="A +ve">A +ve</option>
                <option value="A -ve">A -ve</option>
                <option value="B +ve">B +ve</option>
                <option value="B -ve">B -ve</option>
                <option value="AB +ve">AB +ve</option>
                <option value="AB -ve">AB -ve</option>
                <option value="O +ve">O +ve</option>
                <option value="O -ve">O -ve</option>
              </select>
            </div>

            <div>
              <label className="human-label">Known Allergies</label>
              <input
                type="text"
                required
                value={formData.allergies}
                onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                placeholder="e.g. Penicillin, Peanuts, None"
                className="human-input"
              />
            </div>

            <div>
              <label className="human-label">Medical Conditions</label>
              <input
                type="text"
                required
                value={formData.medicalConditions}
                onChange={(e) => setFormData({ ...formData, medicalConditions: e.target.value })}
                placeholder="e.g. Asthma, Diabetes, None"
                className="human-input"
              />
            </div>

            <div>
              <label className="human-label">Primary Contact Name</label>
              <input
                type="text"
                required
                value={formData.contactName}
                onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                placeholder="e.g. Sarah Connor (Mother)"
                className="human-input"
              />
            </div>

            <div>
              <label className="human-label">Primary Contact Phone</label>
              <input
                type="tel"
                required
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                placeholder="e.g. +880 1711-999999"
                className="human-input font-mono"
              />
            </div>

            <div className="flex gap-2 pt-2">
              {savedData && (
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="w-1/2 btn-outline text-xs"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="w-full btn-danger text-xs font-mono font-bold py-3"
              >
                <FiCheck /> Save Medical ID
              </button>
            </div>
          </form>
        ) : (
          /* 2. BADGE DISPLAY MODE */
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={user?.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                    alt={user?.fullName}
                    className="w-12 h-12 rounded-xl object-cover ring-2 ring-rose-500/40"
                  />
                  <div>
                    <h4 className="font-extrabold text-sm text-zinc-900 dark:text-white">{user?.fullName || 'User'}</h4>
                    <p className="text-[11px] font-mono text-zinc-500">{user?.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono uppercase text-zinc-400">BLOOD TYPE</span>
                  <p className="text-lg font-black text-rose-600 dark:text-rose-400 font-mono">{formData.bloodType}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-rose-500/20 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-zinc-400">ALLERGIES</span>
                  <p className="font-semibold text-zinc-800 dark:text-zinc-200">{formData.allergies || 'None'}</p>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400">MEDICAL CONDITIONS</span>
                  <p className="font-semibold text-zinc-800 dark:text-zinc-200">{formData.medicalConditions || 'None'}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-zinc-900 dark:text-white font-mono uppercase text-[11px]">Primary Contact</h4>
              <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                <div>
                  <p className="font-bold text-zinc-800 dark:text-zinc-200">{formData.contactName || 'Primary Contact'}</p>
                  <p className="text-zinc-500 font-mono text-[11px]">{formData.contactPhone || '+880 1711-999999'}</p>
                </div>
                {formData.contactPhone && (
                  <a href={`tel:${formData.contactPhone}`} className="btn-solid !py-1.5 !px-3 text-[11px]">
                    <FiPhone /> Call
                  </a>
                )}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setIsEditing(true)}
                className="w-1/2 btn-outline py-2.5 text-xs font-mono flex items-center justify-center gap-2"
              >
                <FiEdit2 /> Edit Details
              </button>
              <button
                onClick={onClose}
                className="w-1/2 btn-solid py-2.5 text-xs"
              >
                Close
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default MedicalIDModal;
