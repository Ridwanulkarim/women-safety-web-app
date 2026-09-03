import React, { useState } from 'react';
import AudioEvidenceRecorder from '../../components/evidence/AudioEvidenceRecorder';
import CameraEvidenceCapture from '../../components/evidence/CameraEvidenceCapture';
import LegalEvidenceExporterModal from '../../components/evidence/LegalEvidenceExporterModal';
import { FiShield, FiLock, FiHardDrive, FiFileText } from 'react-icons/fi';

const EvidenceVaultPage = () => {
  const [exporterOpen, setExporterOpen] = useState(false);

  const bulkExportItem = {
    id: 'bulk_package_' + Date.now(),
    date: new Date().toLocaleString(),
    type: 'Full Evidence Package',
    lat: 22.3347,
    lng: 91.8106,
    address: 'Chittagong / Dhaka, Bangladesh'
  };

  return (
    <div className="space-y-6 relative overflow-hidden">
      {/* Ambient corner glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-rose-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="glass-card-xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mono-tag mono-tag-rose">
              <FiLock className="w-3 h-3 text-rose-500" /> SECURE EVIDENCE VAULT
            </span>
            <span className="mono-tag mono-tag-emerald">
              SHA-256 Chain-of-Custody
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-zinc-900 dark:text-white tracking-tight">
            Emergency <span className="gradient-text-rose">Evidence Locker</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl">
            Captured audio recordings, timestamped camera photos, and distress notes are encrypted locally with SHA-256 cryptographic chain-of-custody verification.
          </p>
        </div>

        <button
          onClick={() => setExporterOpen(true)}
          className="btn-danger py-3 px-5 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-rose-600/25 relative z-10"
        >
          <FiFileText className="text-base" /> EXPORT LEGAL DOCKET (PDF)
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
