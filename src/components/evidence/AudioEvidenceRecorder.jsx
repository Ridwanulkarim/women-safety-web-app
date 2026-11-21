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
          toast.success(isBn ? '🎙️ জরুরি ভয়েস রেকর্ডিং ভল্টে সংরক্ষিত হয়েছে!' : '🎙️ Emergency Voice Recording Saved to Evidence Vault!');
        };

        stream.getTracks().forEach((t) => t.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      toast.error(isBn ? '🎙️ জরুরি অডিও রেকর্ডিং শুরু হয়েছে!' : '🎙️ Emergency Audio Recording Started!');

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
    <div className="product-card p-6 space-y-6 font-sans">
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <FiMic className="text-rose-600 dark:text-rose-400 text-lg" />
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white font-heading">
              {isBn ? 'জরুরি ভয়েস রেকর্ডার' : 'Emergency Voice Recorder'}
            </h3>
            <p className="text-xs text-zinc-500">
              {isBn ? 'আইনি প্রমাণের জন্য ব্যাকগ্রাউন্ড অডিও রেকর্ড করে' : 'Captures background audio telemetry for legal evidence'}
            </p>
          </div>
        </div>
        {isRecording ? (
          <span className="mono-tag mono-tag-rose animate-pulse">
            <span className="w-2 h-2 rounded-full bg-rose-600 telemetry-dot"></span> {isBn ? `রেকর্ডিং চলছে (${toBengaliDigits(formatTime(recordingTime))})` : `RECORDING (${formatTime(recordingTime)})`}
          </span>
        ) : (
          <span className="mono-tag mono-tag-emerald">{isBn ? 'প্রস্তুত' : 'Ready'}</span>
        )}
      </div>

      {/* Recording Controls */}
      <div className="flex items-center gap-3">
        {isRecording ? (
          <button
            onClick={stopRecording}
            className="w-full btn-danger py-3 text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 animate-pulse"
          >
            <FiSquare /> {isBn ? `রেকর্ড বন্ধ করুন (${toBengaliDigits(formatTime(recordingTime))})` : `STOP RECORDING (${formatTime(recordingTime)})`}
          </button>
        ) : (
          <button
            onClick={startRecording}
            className="w-full btn-solid py-3 text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <FiMic /> {isBn ? 'জরুরি অডিও রেকর্ড শুরু করুন' : 'START EMERGENCY RECORDING'}
          </button>
        )}
      </div>

      {/* Audio Evidence Locker List */}
      <div className="space-y-3 pt-2">
        <h4 className="text-xs font-mono font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
          {isBn ? `সংরক্ষিত অডিও ভল্ট (${toBengaliDigits(recordings.length)})` : `Saved Audio Vault (${recordings.length})`}
        </h4>

        {recordings.length === 0 ? (
          <p className="text-xs text-zinc-400 italic py-2">
            {isBn ? 'কোনো অডিও প্রমাণ এখনো ধারণ করা হয়নি।' : 'No audio evidence captured yet.'}
          </p>
        ) : (
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {recordings.map((rec) => (
              <div
                key={rec.id}
                className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <span className="font-mono text-zinc-500 text-[10px] block">{rec.date}</span>
                  <audio controls src={rec.dataUrl} className="h-8 max-w-[220px] mt-1" />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenExporter(rec)}
                    className="p-2 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 transition flex items-center gap-1 font-mono text-[10px] font-bold"
                    title={isBn ? 'আইনি প্রমাণপত্র ডাউনলোড' : 'Export Chain-of-Custody PDF Docket'}
                  >
                    <FiFileText /> {isBn ? 'আইনি PDF' : 'Legal PDF'}
                  </button>
                  <a
                    href={rec.dataUrl}
                    download={`Evidence_Audio_${rec.id}.webm`}
                    className="p-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:text-rose-600 transition"
                    title={isBn ? 'ডাউনলোড' : 'Download Evidence'}
                  >
                    <FiDownload />
                  </a>
                  <button
                    onClick={() => deleteRecording(rec.id)}
                    className="p-2 rounded-lg bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 transition"
                    title={isBn ? 'মুছুন' : 'Delete Evidence'}
                  >
                    <FiTrash2 />
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
