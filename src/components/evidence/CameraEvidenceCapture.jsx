import React, { useState, useRef, useEffect } from 'react';
import { FiCamera, FiVideo, FiSquare, FiDownload, FiTrash2, FiX, FiFileText, FiEye } from 'react-icons/fi';
import LegalEvidenceExporterModal from './LegalEvidenceExporterModal';
import { useLanguage } from '../../context/LanguageContext';
import { toBengaliDigits } from '../../utils/helpers';
import toast from 'react-hot-toast';

const CameraEvidenceCapture = () => {
  const [cameraActive, setCameraActive] = useState(false);
  const [isVideoRecording, setIsVideoRecording] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedExportItem, setSelectedExportItem] = useState(null);
  const [exporterOpen, setExporterOpen] = useState(false);
  const { language, t } = useLanguage();
  const isBn = language === 'bn';

  const [evidenceList, setEvidenceList] = useState(() => {
    try {
      const saved = localStorage.getItem('safehaven_camera_evidence');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const videoChunksRef = useRef([]);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: true });
      streamRef.current = stream;
      setCameraActive(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (err) {
      console.warn('Camera access failed:', err.message);
      toast.error(isBn ? 'ক্যামেরা পারমিশন প্রয়োজন' : 'Camera access permission denied');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
    setIsVideoRecording(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

    const newEvidence = {
      id: 'photo_' + Date.now(),
      type: 'photo',
      date: new Date().toLocaleString(),
      dataUrl
    };
    const updated = [newEvidence, ...evidenceList];
    setEvidenceList(updated);
    localStorage.setItem('safehaven_camera_evidence', JSON.stringify(updated));
    toast.success(isBn ? 'ছবির প্রমাণ ভল্টে সংরক্ষিত হয়েছে' : 'Photo evidence saved');
  };

  const startVideoRecording = () => {
    if (!streamRef.current) return;
    try {
      mediaRecorderRef.current = new MediaRecorder(streamRef.current);
      videoChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) videoChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const videoBlob = new Blob(videoChunksRef.current, { type: 'video/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(videoBlob);
        reader.onloadend = () => {
          const newEvidence = {
            id: 'video_' + Date.now(),
            type: 'video',
            date: new Date().toLocaleString(),
            dataUrl: reader.result
          };
          const updated = [newEvidence, ...evidenceList];
          setEvidenceList(updated);
          localStorage.setItem('safehaven_camera_evidence', JSON.stringify(updated));
          toast.success(isBn ? 'ভিডিও প্রমাণ ভল্টে সংরক্ষিত হয়েছে' : 'Video recording saved');
        };
      };

      mediaRecorderRef.current.start();
      setIsVideoRecording(true);
      toast.error(isBn ? 'জরুরি ভিডিও রেকর্ডিং শুরু হয়েছে' : 'Video recording started');
    } catch (e) {
      toast.error(isBn ? 'ভিডিও রেকর্ডিং ব্যর্থ হয়েছে' : 'Video recording failed');
    }
  };

  const stopVideoRecording = () => {
    if (mediaRecorderRef.current && isVideoRecording) {
      mediaRecorderRef.current.stop();
      setIsVideoRecording(false);
    }
  };

  const deleteEvidence = (id) => {
    const updated = evidenceList.filter((item) => item.id !== id);
    setEvidenceList(updated);
    localStorage.setItem('safehaven_camera_evidence', JSON.stringify(updated));
    toast.success(isBn ? 'প্রমাণ মুছে ফেলা হয়েছে' : 'Evidence removed');
  };

  const handleOpenExporter = (item) => {
    setSelectedExportItem(item);
    setExporterOpen(true);
  };

  return (
    <div className="surface-card p-6 space-y-5">
      <div className="flex items-center justify-between border-b border-zinc-900/[0.08] dark:border-white/[0.08] pb-4">
        <div className="flex items-center gap-3">
          <FiCamera className="w-5 h-5 text-[#525252] dark:text-[#a1a1a6] dispatch-icon" />
          <div>
            <h2 className="text-base font-medium text-[#171717] dark:text-[#ededed]">
              {t('safetyTools.cameraEvidence')}
            </h2>
            <p className="text-xs text-[#737373] dark:text-[#85858b]">{t('safetyTools.cameraSub')}</p>
          </div>
        </div>
        <span className={`status-tag ${cameraActive ? 'mono-tag-rose' : ''}`}>
          {cameraActive ? (isBn ? 'চালু' : 'Live') : (isBn ? 'বন্ধ' : 'Standby')}
        </span>
      </div>

      {cameraActive ? (
        <div className="relative rounded-xl overflow-hidden bg-black aspect-video border border-zinc-900/15 dark:border-white/15">
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />

          <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-center gap-2 bg-[#141415]/90 p-2.5 rounded-lg border border-white/10">
            <button onClick={capturePhoto} className="btn-solid h-9 px-3 text-xs">
              <FiCamera className="w-4 h-4 dispatch-icon" /> {t('safetyTools.takePhoto')}
            </button>

            {isVideoRecording ? (
              <button onClick={stopVideoRecording} className="btn-danger h-9 px-3 text-xs">
                <FiSquare className="w-4 h-4 dispatch-icon" /> {t('safetyTools.stopVideo')}
              </button>
            ) : (
              <button onClick={startVideoRecording} className="btn-danger h-9 px-3 text-xs">
                <FiVideo className="w-4 h-4 dispatch-icon" /> {t('safetyTools.recordVideo')}
              </button>
            )}

            <button onClick={stopCamera} className="btn-outline h-9 px-3 text-xs">
              <FiX className="w-4 h-4 dispatch-icon" /> {t('common.close')}
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={startCamera}
          className="w-full py-8 rounded-xl border border-dashed border-zinc-900/15 dark:border-white/15 hover:border-zinc-900/30 dark:hover:border-white/30 bg-[#fafafa] dark:bg-[#141415] text-center space-y-2 transition-colors cursor-pointer"
        >
          <FiCamera className="w-6 h-6 mx-auto text-[#525252] dark:text-[#a1a1a6] dispatch-icon" />
          <span className="block text-sm font-medium text-[#171717] dark:text-[#ededed]">
            {t('safetyTools.launchCamera')}
          </span>
          <span className="block text-xs text-[#737373] dark:text-[#85858b]">
            {t('safetyTools.cameraDesc')}
          </span>
        </button>
      )}

      <div className="space-y-3 pt-1">
        <h3 className="text-xs font-medium text-[#737373] dark:text-[#85858b]">
          {isBn
            ? `সংরক্ষিত মিডিয়া (${toBengaliDigits(evidenceList.length)})`
            : `Saved media (${evidenceList.length})`}
        </h3>

        {evidenceList.length === 0 ? (
          <p className="text-xs text-[#737373] dark:text-[#85858b] py-2">{t('safetyTools.noMedia')}</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {evidenceList.map((item) => (
              <div
                key={item.id}
                className="relative group rounded-lg overflow-hidden border border-zinc-900/[0.08] dark:border-white/[0.08] bg-[#141415]"
              >
                {item.type === 'photo' ? (
                  <img src={item.dataUrl} alt="Evidence" className="w-full h-24 object-cover" />
                ) : (
                  <video src={item.dataUrl} className="w-full h-24 object-cover" />
                )}
                <div className="absolute inset-0 bg-[#141415]/85 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-between text-white">
                  <span className="text-[11px] font-mono tabular-nums truncate">{item.date}</span>
                  <div className="flex items-center justify-between gap-1">
                    <button
                      onClick={() => handleOpenExporter(item)}
                      className="p-1.5 rounded bg-[#dc2626] hover:bg-[#b91c1c] text-white cursor-pointer"
                      title={isBn ? 'আইনি ডকেট' : 'Export legal docket'}
                    >
                      <FiFileText className="w-3.5 h-3.5 dispatch-icon" />
                    </button>
                    <button
                      onClick={() => setPreviewImage(item.dataUrl)}
                      className="p-1.5 rounded bg-[#232325] hover:bg-zinc-700 cursor-pointer"
                      title={isBn ? 'দেখুন' : 'Preview'}
                    >
                      <FiEye className="w-3.5 h-3.5 dispatch-icon" />
                    </button>
                    <a
                      href={item.dataUrl}
                      download={`Evidence_${item.id}.${item.type === 'photo' ? 'jpg' : 'webm'}`}
                      className="p-1.5 rounded bg-[#232325] hover:bg-zinc-700"
                      title={isBn ? 'ডাউনলোড' : 'Download'}
                    >
                      <FiDownload className="w-3.5 h-3.5 dispatch-icon" />
                    </a>
                    <button
                      onClick={() => deleteEvidence(item.id)}
                      className="p-1.5 rounded bg-[#232325] hover:bg-[#dc2626] cursor-pointer"
                      title={isBn ? 'মুছুন' : 'Delete'}
                    >
                      <FiTrash2 className="w-3.5 h-3.5 dispatch-icon" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {previewImage && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
          <div className="relative max-w-2xl w-full surface-panel p-4 space-y-4">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-3 right-3 h-8 w-8 rounded-lg bg-[#232325] text-[#ededed] flex items-center justify-center cursor-pointer"
              title={t('common.close')}
            >
              <FiX className="w-4 h-4 dispatch-icon" />
            </button>
            <img src={previewImage} alt="Evidence preview" className="w-full rounded-lg max-h-[70vh] object-contain" />
          </div>
        </div>
      )}

      <LegalEvidenceExporterModal
        isOpen={exporterOpen}
        onClose={() => setExporterOpen(false)}
        item={selectedExportItem}
      />
    </div>
  );
};

export default CameraEvidenceCapture;
