import React, { useState } from 'react';
import AudioEvidenceRecorder from '../../components/evidence/AudioEvidenceRecorder';
import CameraEvidenceCapture from '../../components/evidence/CameraEvidenceCapture';
import LegalEvidenceExporterModal from '../../components/evidence/LegalEvidenceExporterModal';
import { FiShield, FiLock, FiHardDrive, FiFileText } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext';

const EvidenceVaultPage = () => {
  const [exporterOpen, setExporterOpen] = useState(false);
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const bulkExportItem = {
    id: 'bulk_package_' + Date.now(),
    date: new Date().toLocaleString(),
    type: isBn ? 'সম্পূর্ণ প্রমাণাদি প্যাকেজ' : 'Full Evidence Package',
    lat: 23.8103,
    lng: 90.4125,
    address: 'Dhaka / Chittagong, Bangladesh'
  };

  return (
    <div className="space-y-6 relative overflow-hidden font-sans">
      {/* Ambient corner glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-rose-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="glass-card-xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mono-tag mono-tag-rose">
              <FiLock className="w-3 h-3 text-rose-500" /> {isBn ? 'নিরাপদ প্রমাণ সংরক্ষণাগার' : 'SECURE EVIDENCE VAULT'}
            </span>
            <span className="mono-tag mono-tag-emerald">
              {isBn ? 'এসএইচএ-২৫৬ আইনি যাচাইকরণ' : 'SHA-256 Chain-of-Custody'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-zinc-900 dark:text-white tracking-tight">
            {isBn ? 'জরুরি ' : 'Emergency '}<span className="gradient-text-rose">{isBn ? 'প্রমাণাদি ভল্ট' : 'Evidence Locker'}</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl">
            {isBn
              ? 'রেকর্ড করা অডিও, টাইমস্ট্যাম্পসহ তোলা ছবি এবং জরুরি নোটসমূহ আপনার ডিভাইসে SHA-256 ক্রিপ্টোগ্রাফিক চেইনে সুরক্ষিত থাকে যা আদালতে প্রমাণ হিসেবে গ্রহণযোগ্য।'
              : 'Captured audio recordings, timestamped camera photos, and distress notes are encrypted locally with SHA-256 cryptographic chain-of-custody verification.'}
          </p>
        </div>

        <button
          onClick={() => setExporterOpen(true)}
          className="btn-danger py-3 px-5 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-rose-600/25 relative z-10"
        >
          <FiFileText className="text-base" /> {isBn ? 'আইনি প্রমাণপত্র ডাউনলোড (PDF)' : 'EXPORT LEGAL DOCKET (PDF)'}
        </button>
      </div>

      {/* Grid: Voice Recorder & Camera Capture */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
        <AudioEvidenceRecorder />
        <CameraEvidenceCapture />
      </div>

      <LegalEvidenceExporterModal
        isOpen={exporterOpen}
        onClose={() => setExporterOpen(false)}
        item={bulkExportItem}
      />
    </div>
  );
};

export default EvidenceVaultPage;
