import React from 'react';
import AudioEvidenceRecorder from '../../components/evidence/AudioEvidenceRecorder';
import CameraEvidenceCapture from '../../components/evidence/CameraEvidenceCapture';
import { FiShield, FiLock, FiHardDrive } from 'react-icons/fi';

const EvidenceVaultPage = () => {
  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="product-card p-6 sm:p-8 space-y-2">
        <div className="flex items-center gap-2">
          <span className="mono-tag mono-tag-rose">
            <FiLock className="w-3 h-3 text-rose-500" /> SECURE EVIDENCE VAULT
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-zinc-900 dark:text-white">
          Emergency Evidence Locker
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-2xl">
          Captured voice recordings, timestamped camera photos, and distress videos are stored locally on your device for legal evidence review.
        </p>
      </div>

      {/* Grid: Voice Recorder & Camera Capture */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AudioEvidenceRecorder />
        <CameraEvidenceCapture />
      </div>

    </div>
  );
};

export default EvidenceVaultPage;
