import React, { useState, useRef } from 'react';
import { FiCamera, FiVideo, FiSquare, FiDownload, FiTrash2, FiEye, FiX, FiCheck, FiFileText } from 'react-icons/fi';
import LegalEvidenceExporterModal from './LegalEvidenceExporterModal';
import toast from 'react-hot-toast';

const CameraEvidenceCapture = () => {
  const [cameraActive, setCameraActive] = useState(false);
  const [isVideoRecording, setIsVideoRecording] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedExportItem, setSelectedExportItem] = useState(null);
  const [exporterOpen, setExporterOpen] = useState(false);

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

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
      toast.success('📷 Camera Feed Activated!');
    } catch (err) {
      console.warn('Camera Access Error:', err.message);
      toast.error('Camera permission required to capture evidence');
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
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(10, canvas.height - 40, 360, 30);
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px monospace';
    ctx.fillText(`SAFEHAVEN EVIDENCE • ${new Date().toLocaleString()}`, 20, canvas.height - 20);

    const base64Data = canvas.toDataURL('image/jpeg');

    const newEvidence = {
      id: 'photo_' + Date.now(),
      type: 'photo',
      date: new Date().toLocaleString(),
      dataUrl: base64Data
    };

    const updated = [newEvidence, ...evidenceList];
    setEvidenceList(updated);
    localStorage.setItem('safehaven_camera_evidence', JSON.stringify(updated));
    toast.success('📸 Photo Evidence Captured & Saved!');
  };

  const startVideoRecording = () => {
    if (!streamRef.current) return;
    try {
      mediaRecorderRef.current = new MediaRecorder(streamRef.current);
      videoChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          videoChunksRef.current.push(e.data);
        }
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
          toast.success('🎥 Emergency Video Recording Saved!');
        };
      };

      mediaRecorderRef.current.start();
      setIsVideoRecording(true);
      toast.error('🎥 Emergency Video Recording Started!');
    } catch (e) {
      toast.error('Video recording failed');
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
    toast.success('Evidence removed');
  };

  const handleOpenExporter = (item) => {
    setSelectedExportItem(item);
    setExporterOpen(true);
  };

  return (
    <div className="product-card p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <FiCamera className="text-rose-600 dark:text-rose-400 text-lg" />
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white font-heading">
              Camera Evidence Capture
            </h3>
            <p className="text-xs text-zinc-500">Record video clips & snapshot evidence during emergencies</p>
          </div>
        </div>
        {cameraActive ? (
          <span className="mono-tag mono-tag-rose">Camera Feed Live</span>
        ) : (
          <span className="mono-tag mono-tag-zinc">Camera Off</span>
        )}
      </div>

      {/* Live Stream Viewfinder */}
      {cameraActive ? (
        <div className="relative rounded-xl overflow-hidden bg-black aspect-video border border-zinc-800">
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />

          {/* Action Bar Overlay */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-center gap-3 bg-zinc-950/80 backdrop-blur-sm p-3 rounded-xl">
            <button
              onClick={capturePhoto}
              className="btn-solid !py-2 !px-4 text-xs font-mono"
            >
              <FiCamera /> TAKE PHOTO
            </button>

            {isVideoRecording ? (
              <button
                onClick={stopVideoRecording}
                className="btn-danger !py-2 !px-4 text-xs font-mono animate-pulse"
              >
                <FiSquare /> STOP VIDEO
              </button>
            ) : (
              <button
                onClick={startVideoRecording}
                className="btn-danger !py-2 !px-4 text-xs font-mono"
              >
                <FiVideo /> RECORD VIDEO
              </button>
            )}

            <button
              onClick={stopCamera}
              className="btn-outline !py-2 !px-3 text-xs"
            >
              <FiX /> Close Camera
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={startCamera}
          className="w-full py-8 rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-800 hover:border-rose-500/50 bg-zinc-50 dark:bg-zinc-900/40 text-center space-y-2 transition cursor-pointer"
        >
          <FiCamera className="w-8 h-8 mx-auto text-rose-500" />
          <span className="block font-bold text-xs text-zinc-800 dark:text-zinc-200">
            Click to Launch Live Camera Feed
          </span>
          <span className="block text-[11px] text-zinc-500 font-mono">
            Captures timestamped photo snapshots & video evidence
          </span>
        </button>
      )}

      {/* Camera Evidence Vault List */}
      <div className="space-y-3 pt-2">
        <h4 className="text-xs font-mono font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
          Saved Media Vault ({evidenceList.length})
        </h4>

        {evidenceList.length === 0 ? (
          <p className="text-xs text-zinc-400 italic py-2">No photo or video evidence stored yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {evidenceList.map((item) => (
              <div key={item.id} className="relative group rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-900">
                {item.type === 'photo' ? (
                  <img src={item.dataUrl} alt="Evidence" className="w-full h-24 object-cover" />
                ) : (
                  <video src={item.dataUrl} className="w-full h-24 object-cover" />
                )}
                <div className="absolute inset-0 bg-zinc-950/80 opacity-0 group-hover:opacity-100 transition p-2 flex flex-col justify-between text-white">
                  <span className="text-[9px] font-mono truncate">{item.date}</span>
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => handleOpenExporter(item)}
                      className="p-1 rounded bg-rose-600 hover:bg-rose-700 text-xs text-white"
                      title="Export Chain-of-Custody PDF Docket"
                    >
                      <FiFileText />
                    </button>
                    <button
                      onClick={() => setPreviewImage(item.dataUrl)}
                      className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-xs"
                      title="View Full"
                    >
                      <FiEye />
                    </button>
                    <a
                      href={item.dataUrl}
                      download={`Evidence_${item.id}.${item.type === 'photo' ? 'jpg' : 'webm'}`}
                      className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-xs"
                      title="Download"
                    >
                      <FiDownload />
                    </a>
                    <button
                      onClick={() => deleteEvidence(item.id)}
                      className="p-1 rounded bg-rose-600/50 hover:bg-rose-700 text-xs text-white"
                      title="Delete"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Media Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-50 bg-zinc-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-2xl w-full product-card p-4 space-y-4">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-2 right-2 p-2 rounded-lg bg-zinc-800 text-white"
            >
              <FiX />
            </button>
            <img src={previewImage} alt="Evidence Full Preview" className="w-full rounded-lg max-h-[70vh] object-contain" />
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
