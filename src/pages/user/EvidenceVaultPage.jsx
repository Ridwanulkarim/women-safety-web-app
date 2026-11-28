import React, { useState } from 'react';
import AudioEvidenceRecorder from '../../components/evidence/AudioEvidenceRecorder';
import CameraEvidenceCapture from '../../components/evidence/CameraEvidenceCapture';
import LegalEvidenceExporterModal from '../../components/evidence/LegalEvidenceExporterModal';
import { FiLock, FiFileText } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext';

const EvidenceVaultPage = () => {
  const [exporterOpen, setExporterOpen] = useState(false);
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const bulkExportItem = {
    id: 'bulk_package_' + Date.now(),
    date: new Date().toLocaleString(),
    type: isBn ? 'সম্পূর্ণ প্রমাণাদি প্যাকেজ' : 'Full evidence package',
    lat: 23.8103,
    lng: 90.4125,
    address: 'Dhaka / Chittagong, Bangladesh'
  };

  return (
    <div className="space-y-6">
      <div className="surface-panel p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="status-tag">
              <FiLock className="w-3.5 h-3.5 text-[#e11d48] dispatch-icon" />
              {isBn ? 'প্রমাণ সংরক্ষণাগার' : 'Evidence vault'}
            </span>
            <span className="status-tag mono-tag-emerald">
              {isBn ? 'SHA-256 চেইন-অব-কাস্টডি' : 'SHA-256 chain of custody'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-medium text-[#171717] dark:text-[#ededed]">
            {isBn ? 'জরুরি প্রমাণাদি ভল্ট' : 'Emergency evidence locker'}
          </h1>
          <p className="text-sm text-[#525252] dark:text-[#a1a1a6] max-w-2xl">
            {isBn
              ? 'ধারণকৃত অডিও, টাইমস্ট্যাম্পযুক্ত ছবি এবং ভিডিও প্রমাণাদি ডিভাইসে SHA-256 চেকসামসহ সংরক্ষিত থাকে।'
              : 'Recorded audio clips, timestamped photos, and video evidence are preserved locally with SHA-256 verification digests.'}
          </p>
        </div>

        <button onClick={() => setExporterOpen(true)} className="btn-solid h-10 px-4 text-xs shrink-0">
          <FiFileText className="w-4 h-4 dispatch-icon" />
          {isBn ? 'আইনি ডকেট এক্সপোর্ট (PDF)' : 'Export legal docket'}
        </button>
      </div>

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
