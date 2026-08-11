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
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="product-card p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="mono-tag mono-tag-rose">
              <FiLock className="w-3 h-3 text-rose-500" /> SECURE EVIDENCE VAULT
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-zinc-900 dark:text-white">
            Emergency Evidence Locker
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-2xl">
            Captured voice recordings, timestamped camera photos, and distress videos are stored locally on your device with SHA-256 cryptographic chain-of-custody verification.
          </p>
        </div>

        <button
          onClick={() => setExporterOpen(true)}
          className="btn-danger py-3 px-5 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-rose-600/20"
        >
          <FiFileText className="text-base" /> EXPORT LEGAL DOCKET (PDF)
        </button>
      </div>

      {/* Grid: Voice Recorder & Camera Capture */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
