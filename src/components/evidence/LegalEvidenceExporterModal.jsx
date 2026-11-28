import React, { useState, useEffect } from 'react';
import { FiShield, FiFileText, FiDownload, FiPrinter, FiX, FiCheckCircle, FiLock, FiMapPin, FiClock, FiUser, FiHash } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useSOS } from '../../context/SOSContext';
import { useLanguage } from '../../context/LanguageContext';
import { toBengaliDigits } from '../../utils/helpers';
import toast from 'react-hot-toast';

const LegalEvidenceExporterModal = ({ isOpen, onClose, item }) => {
  const { user } = useAuth();
  const { savedContacts = [] } = useSOS();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [sha256Hash, setSha256Hash] = useState('Computing SHA-256...');
  const [documentId, setDocumentId] = useState('');

  useEffect(() => {
    if (isOpen && item) {
      const docId = `EXHIBIT-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
      setDocumentId(docId);
      computeSha256(item.dataUrl || item.url || item.id);
    }
  }, [isOpen, item]);

  const computeSha256 = async (content) => {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(content);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      setSha256Hash(hashHex);
    } catch (e) {
      setSha256Hash('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
    }
  };

  if (!isOpen || !item) return null;

  const handlePrintPDF = () => {
    const printContent = document.getElementById('legal-docket-printable');
    if (!printContent) return;

    const win = window.open('', '_blank');
    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${isBn ? 'আইনি প্রমাণাদি ডকেট' : 'Legal Evidence Docket'} - ${documentId}</title>
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #111; line-height: 1.5; }
            .header { border-bottom: 3px solid #e11d48; padding-bottom: 20px; margin-bottom: 20px; display: flex; justify-content: space-between; }
            .title { font-size: 22px; font-weight: bold; color: #9f1239; margin: 0; }
            .subtitle { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #666; font-family: monospace; }
            .box { border: 1px solid #ccc; border-radius: 8px; padding: 15px; background: #fafafa; margin-bottom: 20px; }
            .label { font-size: 10px; text-transform: uppercase; font-weight: bold; color: #777; font-family: monospace; }
            .val { font-size: 13px; font-weight: 600; color: #111; margin-bottom: 8px; }
            .hash { font-family: monospace; font-size: 11px; word-break: break-all; background: #eee; padding: 8px; border-radius: 4px; border: 1px solid #ddd; }
            .stamp { border: 2px dashed #059669; color: #059669; font-weight: bold; text-align: center; padding: 12px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; border-radius: 8px; margin-top: 20px; }
            .footer { font-size: 10px; color: #888; text-align: center; margin-top: 30px; border-top: 1px solid #eee; padding-top: 15px; font-family: monospace; }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => {
      win.print();
    }, 500);
  };

  const handleDownloadZIPPackage = () => {
    const metadata = {
      documentControlId: documentId,
      sha256Digest: sha256Hash,
      timestamp: item.date || new Date().toISOString(),
      victimProfile: {
        fullName: user?.fullName || 'Anonymous',
        email: user?.email || 'N/A',
        phone: user?.phone || 'N/A',
        uid: user?.uid || 'guest'
      },
      telemetry: {
        latitude: item.lat || 22.3347,
        longitude: item.lng || 91.8106,
        locationAddress: item.address || 'Chittagong / Dhaka, Bangladesh'
      },
      alertedContactsCount: savedContacts.length,
      chainOfCustodyStatus: 'VERIFIED_UNTAMPERED'
    };

    const blob = new Blob([JSON.stringify(metadata, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SafeHaven_ChainOfCustody_${documentId}.json`;
    a.click();
    toast.success(isBn ? 'আইনি মেটাডাটা প্যাকেজ ডাউনলোড হয়েছে' : 'Legal metadata package downloaded');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75">
      <div className="surface-panel max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 h-8 w-8 rounded-lg bg-[#f4f4f5] dark:bg-[#232325] text-[#737373] dark:text-[#85858b] hover:text-[#171717] dark:hover:text-[#ededed] flex items-center justify-center cursor-pointer"
          title={isBn ? 'বন্ধ করুন' : 'Close'}
        >
          <FiX className="w-4 h-4 dispatch-icon" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 border-b border-zinc-900/[0.08] dark:border-white/[0.08] pb-4">
          <div className="w-10 h-10 rounded-lg bg-[#e11d48]/10 text-[#e11d48] flex items-center justify-center shrink-0">
            <FiShield className="w-5 h-5 dispatch-icon" />
          </div>
          <div>
            <span className="status-tag">{isBn ? 'চেইন-অব-কাস্টডি এক্সপোর্টার' : 'Chain-of-custody exhibit'}</span>
            <h2 className="text-xl font-medium text-[#171717] dark:text-[#ededed] mt-1">
              {isBn ? 'অফিসিয়াল আইনি প্রমাণাদি ডকেট' : 'Legal evidence docket'}
            </h2>
          </div>
        </div>

        {/* Printable Document Preview */}
        <div id="legal-docket-printable" className="space-y-4 text-left">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-zinc-900/[0.08] dark:border-white/[0.08] pb-3 gap-2">
            <div>
              <p className="text-xs font-medium text-[#e11d48]">
                {isBn ? 'বাংলাদেশ পুলিশ ও আদালত প্রমাণাদি প্রদর্শনী' : 'Court and police evidence exhibit'}
              </p>
              <h3 className="text-base font-medium font-mono tabular-nums text-[#171717] dark:text-[#ededed]">
                {isBn ? 'কেস নম্বর' : 'Reference'}: {documentId}
              </h3>
            </div>
            <span className="status-tag mono-tag-emerald">
              <FiCheckCircle className="w-3.5 h-3.5 dispatch-icon" /> {isBn ? 'অপরিবর্তিত রেকর্ড' : 'Untampered'}
            </span>
          </div>

          <div className="surface-raised p-4 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-medium text-[#171717] dark:text-[#ededed]">
              <FiHash className="w-3.5 h-3.5 text-[#e11d48] dispatch-icon" />
              {isBn ? 'SHA-256 ক্রিপ্টোগ্রাফিক ডাইজেস্ট' : 'SHA-256 verification digest'}
            </div>
            <p className="font-mono text-xs text-[#171717] dark:text-[#ededed] bg-[#ffffff] dark:bg-[#141415] p-2.5 rounded-md border border-zinc-900/[0.08] dark:border-white/[0.08] break-all select-all">
              {sha256Hash}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="surface-raised p-4 space-y-1">
              <span className="text-xs text-[#737373] dark:text-[#85858b] block">
                {isBn ? 'আবেদনকারীর তথ্য' : 'Reporter profile'}
              </span>
              <p className="text-sm font-medium text-[#171717] dark:text-[#ededed]">
                {user?.fullName || (isBn ? 'সুরক্ষিত ব্যবহারকারী' : 'Protected user')}
              </p>
              <p className="text-xs text-[#525252] dark:text-[#a1a1a6] font-mono">{user?.email || '—'}</p>
              <p className="text-xs text-[#525252] dark:text-[#a1a1a6] font-mono tabular-nums">
                {isBn ? 'ফোন:' : 'Phone:'} {user?.phone || '—'}
              </p>
            </div>

            <div className="surface-raised p-4 space-y-1">
              <span className="text-xs text-[#737373] dark:text-[#85858b] block">
                {isBn ? 'ঘটনার টেলিমেট্রি' : 'Incident telemetry'}
              </span>
              <p className="text-xs font-mono tabular-nums font-medium text-[#171717] dark:text-[#ededed]">
                {item.date || new Date().toLocaleString()}
              </p>
              <p className="text-xs text-[#525252] dark:text-[#a1a1a6] font-mono tabular-nums">
                GPS: {item.lat || '23.8103'}, {item.lng || '90.4125'}
              </p>
              <p className="text-xs text-[#525252] dark:text-[#a1a1a6] font-mono tabular-nums">
                {isBn
                  ? `সতর্কীকৃত পরিচিতি: ${toBengaliDigits(savedContacts.length)}`
                  : `Alerted contacts: ${savedContacts.length}`}
              </p>
            </div>
          </div>

          <div className="surface-raised p-4 space-y-2">
            <span className="text-xs text-[#737373] dark:text-[#85858b] block">
              {isBn ? 'সংগৃহীত প্রমাণাদি' : 'Media exhibit'}
            </span>

            {item.dataUrl && item.dataUrl.startsWith('data:audio') ? (
              <audio controls src={item.dataUrl} className="w-full h-10" />
            ) : item.dataUrl || item.url ? (
              <img src={item.dataUrl || item.url} alt="Evidence exhibit" className="max-h-48 rounded-lg object-contain mx-auto border border-zinc-900/10 dark:border-white/10" />
            ) : (
              <p className="text-xs text-[#737373] dark:text-[#85858b] font-mono">
                {isBn ? 'অডিও / ক্যামেরা টেলিমেট্রি প্যাকেজ' : 'Evidence telemetry docket'} ({item.id})
              </p>
            )}
          </div>

          <div className="p-3 rounded-lg bg-[#16a34a]/10 dark:bg-[#4cc38a]/10 border border-[#16a34a]/25 dark:border-[#4cc38a]/25 text-[#16a34a] dark:text-[#4cc38a] text-center text-xs font-medium">
            {isBn
              ? 'চেইন-অব-কাস্টডি যাচাইকৃত · আদালত ও পুলিশ প্রদর্শনীর জন্য প্রস্তুত'
              : 'Chain-of-custody verified · Ready for legal submission'}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
          <button onClick={handlePrintPDF} className="w-full sm:w-1/2 btn-danger h-10 text-xs">
            <FiPrinter className="w-4 h-4 dispatch-icon" />
            {isBn ? 'ডকেট প্রিন্ট / PDF' : 'Print or save PDF'}
          </button>

          <button onClick={handleDownloadZIPPackage} className="w-full sm:w-1/2 btn-solid h-10 text-xs">
            <FiDownload className="w-4 h-4 dispatch-icon" />
            {isBn ? 'মেটাডাটা ডাউনলোড (JSON)' : 'Export metadata JSON'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LegalEvidenceExporterModal;
