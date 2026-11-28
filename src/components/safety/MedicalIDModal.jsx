import React, { useState, useEffect } from 'react';
import { FiX, FiActivity, FiUser, FiPhone, FiCheck, FiPlusCircle, FiEdit2 } from 'react-icons/fi';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import toast from 'react-hot-toast';

const MedicalIDModal = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const isBn = language === 'bn';

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

  useEffect(() => {
    if (!isOpen || !user?.uid) return;
    getDoc(doc(db, 'users', user.uid))
      .then((snap) => {
        if (snap.exists() && snap.data()?.medicalId) {
          const cloudMed = snap.data().medicalId;
          setFormData((prev) => ({ ...prev, ...cloudMed }));
          localStorage.setItem('safehaven_medical_id', JSON.stringify(cloudMed));
          setIsEditing(false);
        }
      })
      .catch(() => {});
  }, [isOpen, user?.uid]);

  if (!isOpen) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    localStorage.setItem('safehaven_medical_id', JSON.stringify(formData));
    if (user?.uid) {
      try {
        await setDoc(
          doc(db, 'users', user.uid),
          {
            medicalId: formData,
            bloodGroup: formData.bloodType,
            updatedAt: new Date().toISOString()
          },
          { merge: true }
        );
      } catch (err) {
        console.warn('Firestore medical ID sync notice:', err.message);
      }
    }
    setIsEditing(false);
    toast.success(isBn ? 'জরুরি মেডিকেল আইডি সংরক্ষিত হয়েছে' : 'Medical ID saved');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75">
      <div className="relative max-w-md w-full surface-panel p-6 sm:p-8 space-y-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 h-8 w-8 rounded-lg bg-[#f4f4f5] dark:bg-[#232325] text-[#737373] dark:text-[#85858b] hover:text-[#171717] dark:hover:text-[#ededed] flex items-center justify-center cursor-pointer"
          title={isBn ? 'বন্ধ করুন' : 'Close'}
        >
          <FiX className="w-4 h-4 dispatch-icon" />
        </button>

        <div className="space-y-1.5">
          <span className="status-tag">{isBn ? 'মেডিকেল টেলিমেট্রি' : 'Responder telemetry'}</span>
          <h2 className="text-xl font-medium text-[#171717] dark:text-[#ededed]">
            {isEditing
              ? (isBn ? 'মেডিকেল আইডি সম্পাদনা' : 'Edit medical ID')
              : (isBn ? 'জরুরি মেডিকেল আইডি' : 'Emergency medical ID')}
          </h2>
          <p className="text-sm text-[#525252] dark:text-[#a1a1a6]">
            {isEditing
              ? (isBn ? 'জরুরি চিকিৎসার জন্য আপনার স্বাস্থ্য তথ্য দিন।' : 'Enter key medical details for emergency responders.')
              : (isBn ? 'প্যারামেডিক ও উদ্ধারকারীদের জন্য স্বাস্থ্য তথ্য।' : 'Health profile for first responders and paramedics.')}
          </p>
        </div>

        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="human-label">{isBn ? 'রক্তের গ্রুপ' : 'Blood type'}</label>
              <select
                value={formData.bloodType}
                onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                className="human-input font-mono font-medium text-[#e11d48]"
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
              <label className="human-label">{isBn ? 'অ্যালার্জি তথ্য' : 'Known allergies'}</label>
              <input
                type="text"
                required
                value={formData.allergies}
                onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                placeholder={isBn ? 'পেনিসিলিন, বাদাম বা নেই' : 'Penicillin, peanuts, or None'}
                className="human-input"
              />
            </div>

            <div>
              <label className="human-label">{isBn ? 'শারীরিক অসুস্থতা' : 'Medical conditions'}</label>
              <input
                type="text"
                required
                value={formData.medicalConditions}
                onChange={(e) => setFormData({ ...formData, medicalConditions: e.target.value })}
                placeholder={isBn ? 'অ্যাজমা, ডায়াবেটিস বা নেই' : 'Asthma, diabetes, or None'}
                className="human-input"
              />
            </div>

            <div>
              <label className="human-label">{isBn ? 'প্রধান পরিচিতির নাম' : 'Primary contact name'}</label>
              <input
                type="text"
                required
                value={formData.contactName}
                onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                placeholder={isBn ? 'আয়েশা রহমান' : 'Ayesha Rahman'}
                className="human-input"
              />
            </div>

            <div>
              <label className="human-label">{isBn ? 'জরুরি ফোন নম্বর' : 'Primary contact phone'}</label>
              <input
                type="tel"
                required
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                placeholder="+880 1711-000000"
                className="human-input font-mono tabular-nums"
              />
            </div>

            <div className="flex gap-2 pt-2">
              {savedData && (
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="w-1/2 btn-outline h-10 text-xs"
                >
                  {isBn ? 'বাতিল' : 'Cancel'}
                </button>
              )}
              <button type="submit" className="w-full btn-solid h-10 text-xs">
                <FiCheck className="w-4 h-4 dispatch-icon" /> {isBn ? 'সংরক্ষণ করুন' : 'Save medical ID'}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="surface-raised p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={user?.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                    alt={user?.fullName}
                    className="w-11 h-11 rounded-lg object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <h3 className="font-medium text-sm text-[#171717] dark:text-[#ededed] truncate">
                      {user?.fullName || (isBn ? 'ব্যবহারকারী' : 'User')}
                    </h3>
                    <p className="text-xs font-mono text-[#737373] dark:text-[#85858b] truncate">{user?.email}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs text-[#737373] dark:text-[#85858b] block">{isBn ? 'রক্তের গ্রুপ' : 'Blood type'}</span>
                  <p className="text-lg font-mono font-medium text-[#e11d48]">{formData.bloodType}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-zinc-900/[0.08] dark:border-white/[0.08] text-xs">
                <div>
                  <span className="text-[#737373] dark:text-[#85858b] block">{isBn ? 'অ্যালার্জি' : 'Allergies'}</span>
                  <p className="font-medium text-[#171717] dark:text-[#ededed] mt-0.5">{formData.allergies || (isBn ? 'নেই' : 'None')}</p>
                </div>
                <div>
                  <span className="text-[#737373] dark:text-[#85858b] block">{isBn ? 'অসুস্থতা' : 'Conditions'}</span>
                  <p className="font-medium text-[#171717] dark:text-[#ededed] mt-0.5">{formData.medicalConditions || (isBn ? 'নেই' : 'None')}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs text-[#737373] dark:text-[#85858b] block">
                {isBn ? 'প্রধান জরুরি পরিচিতি' : 'Primary contact'}
              </span>
              <div className="surface-raised p-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-[#171717] dark:text-[#ededed]">{formData.contactName || (isBn ? 'অভিভাবক' : 'Primary contact')}</p>
                  <p className="text-xs text-[#737373] dark:text-[#85858b] font-mono tabular-nums">{formData.contactPhone || '+880 1711-000000'}</p>
                </div>
                {formData.contactPhone && (
                  <a href={`tel:${formData.contactPhone}`} className="btn-solid h-9 px-3 text-xs">
                    <FiPhone className="w-3.5 h-3.5 dispatch-icon" /> {isBn ? 'কল করুন' : 'Call'}
                  </a>
                )}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button onClick={() => setIsEditing(true)} className="w-1/2 btn-outline h-10 text-xs">
                <FiEdit2 className="w-3.5 h-3.5 dispatch-icon" /> {isBn ? 'সম্পাদনা' : 'Edit details'}
              </button>
              <button onClick={onClose} className="w-1/2 btn-solid h-10 text-xs">
                {isBn ? 'বন্ধ করুন' : 'Close'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalIDModal;
