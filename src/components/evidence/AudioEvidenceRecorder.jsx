import React, { useState, useRef, useEffect } from 'react';
import { FiMic, FiSquare, FiPlay, FiPause, FiDownload, FiTrash2, FiRadio, FiFileText } from 'react-icons/fi';
import LegalEvidenceExporterModal from './LegalEvidenceExporterModal';
import { useLanguage } from '../../context/LanguageContext';
import { toBengaliDigits } from '../../utils/helpers';
import toast from 'react-hot-toast';

const AudioEvidenceRecorder = ({ autoStart = false }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [selectedExportItem, setSelectedExportItem] = useState(null);
  const [exporterOpen, setExporterOpen] = useState(false);
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [recordings, setRecordings] = useState(() => {
    try {
      const saved = localStorage.getItem('safehaven_audio_evidence');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);

  useEffect(() => {
    if (autoStart && !isRecording) {
      startRecording();
    }
  }, [autoStart]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64Audio = reader.result;
          const newRecording = {
            id: 'audio_' + Date.now(),
            date: new Date().toLocaleString(),
            duration: recordingTime,
            dataUrl: base64Audio
          };
          const updated = [newRecording, ...recordings];
          setRecordings(updated);
          localStorage.setItem('safehaven_audio_evidence', JSON.stringify(updated));
          toast.success(isBn ? 'অডিও প্রমাণ ভল্টে সংরক্ষিত হয়েছে' : 'Audio recording saved to vault');
        };

        stream.getTracks().forEach((t) => t.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      toast.error(isBn ? 'অডিও রেকর্ডিং শুরু হয়েছে' : 'Emergency audio recording started');

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.warn('Microphone error:', err.message);
      toast.error(isBn ? 'মাইক্রোফোন পারমিশন প্রয়োজন' : 'Microphone permission denied');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  const deleteRecording = (id) => {
    const updated = recordings.filter((r) => r.id !== id);
    setRecordings(updated);
    localStorage.setItem('safehaven_audio_evidence', JSON.stringify(updated));
    toast.success(isBn ? 'অডিও প্রমাণ মুছে ফেলা হয়েছে' : 'Audio evidence removed');
  };

  const handleOpenExporter = (rec) => {
    setSelectedExportItem(rec);
    setExporterOpen(true);
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="surface-card p-6 space-y-5">
      <div className="flex items-center justify-between border-b border-zinc-900/[0.08] dark:border-white/[0.08] pb-4">
        <div className="flex items-center gap-3">
          <FiMic className="w-5 h-5 text-[#525252] dark:text-[#a1a1a6] dispatch-icon" />
          <div>
            <h2 className="text-base font-medium text-[#171717] dark:text-[#ededed]">
              {isBn ? 'জরুরি ভয়েস রেকর্ডার' : 'Emergency voice recorder'}
            </h2>
            <p className="text-xs text-[#737373] dark:text-[#85858b]">
              {isBn ? 'আইনি প্রমাণের জন্য অডিও রেকর্ড সংরক্ষণ করে' : 'Records ambient audio locally for evidence'}
            </p>
          </div>
        </div>
        {isRecording ? (
          <span className="status-tag mono-tag-rose font-mono tabular-nums">
            {isBn ? `রেকর্ডিং (${toBengaliDigits(formatTime(recordingTime))})` : `Recording ${formatTime(recordingTime)}`}
          </span>
        ) : (
          <span className="status-tag mono-tag-emerald">{isBn ? 'প্রস্তুত' : 'Ready'}</span>
        )}
      </div>

      <div>
        {isRecording ? (
          <button onClick={stopRecording} className="w-full btn-danger h-10 text-xs">
            <FiSquare className="w-4 h-4 dispatch-icon" />
            {isBn ? `রেকর্ড বন্ধ করুন (${toBengaliDigits(formatTime(recordingTime))})` : `Stop recording (${formatTime(recordingTime)})`}
          </button>
        ) : (
          <button onClick={startRecording} className="w-full btn-solid h-10 text-xs">
            <FiMic className="w-4 h-4 dispatch-icon" />
            {isBn ? 'জরুরি অডিও রেকর্ড শুরু করুন' : 'Start emergency recording'}
          </button>
        )}
      </div>

      <div className="space-y-3 pt-1">
        <h3 className="text-xs font-medium text-[#737373] dark:text-[#85858b]">
          {isBn ? `সংরক্ষিত অডিও (${toBengaliDigits(recordings.length)})` : `Saved audio (${recordings.length})`}
        </h3>

        {recordings.length === 0 ? (
          <p className="text-xs text-[#737373] dark:text-[#85858b] py-2">
            {isBn ? 'কোনো অডিও প্রমাণ এখনো ধারণ করা হয়নি' : 'No audio recordings captured'}
          </p>
        ) : (
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {recordings.map((rec) => (
              <div
                key={rec.id}
                className="p-3 rounded-lg bg-[#fafafa] dark:bg-[#141415] border border-zinc-900/[0.08] dark:border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <span className="font-mono tabular-nums text-[#737373] dark:text-[#85858b] block">{rec.date}</span>
                  <audio controls src={rec.dataUrl} className="h-8 max-w-[220px] mt-1.5" />
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenExporter(rec)}
                    className="btn-outline h-8 px-2.5 text-xs"
                    title={isBn ? 'আইনি ডকেট' : 'Export legal docket'}
                  >
                    <FiFileText className="w-3.5 h-3.5 text-[#e11d48] dispatch-icon" /> {isBn ? 'আইনি PDF' : 'Legal PDF'}
                  </button>
                  <a
                    href={rec.dataUrl}
                    download={`Evidence_Audio_${rec.id}.webm`}
                    className="h-8 w-8 rounded-lg bg-[#f4f4f5] dark:bg-[#232325] text-[#525252] dark:text-[#a1a1a6] hover:text-[#171717] dark:hover:text-[#ededed] border border-zinc-900/[0.08] dark:border-white/[0.08] flex items-center justify-center transition-colors"
                    title={isBn ? 'ডাউনলোড' : 'Download'}
                  >
                    <FiDownload className="w-3.5 h-3.5 dispatch-icon" />
                  </a>
                  <button
                    onClick={() => deleteRecording(rec.id)}
                    className="h-8 w-8 rounded-lg bg-[#f4f4f5] dark:bg-[#232325] text-[#737373] dark:text-[#85858b] hover:text-[#dc2626] dark:hover:text-[#e5484d] border border-zinc-900/[0.08] dark:border-white/[0.08] flex items-center justify-center transition-colors cursor-pointer"
                    title={isBn ? 'মুছুন' : 'Delete'}
                  >
                    <FiTrash2 className="w-3.5 h-3.5 dispatch-icon" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <LegalEvidenceExporterModal
        isOpen={exporterOpen}
        onClose={() => setExporterOpen(false)}
        item={selectedExportItem}
      />
    </div>
  );
};

export default AudioEvidenceRecorder;
