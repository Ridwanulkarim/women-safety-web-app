import React, { useState, useRef, useEffect } from 'react';
import { FiCamera, FiUser, FiLoader, FiAlertCircle, FiUploadCloud } from 'react-icons/fi';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../../firebase/config';
import toast from 'react-hot-toast';

const ProfilePictureUpload = ({ currentUrl, onUploadSuccess, userId = 'guest' }) => {
  const [previewUrl, setPreviewUrl] = useState(currentUrl || '');
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (currentUrl) {
      setPreviewUrl(currentUrl);
    }
  }, [currentUrl]);

  const validateFile = (file) => {
    if (!file) return 'No file selected.';
    if (!file.type || !file.type.startsWith('image/')) {
      return 'Invalid file type. Please select a valid image file (JPEG, PNG, WEBP, GIF).';
    }
    if (file.size > 5 * 1024 * 1024) {
      return 'File size exceeds 5MB limit. Please select a smaller photo.';
    }
    return null;
  };

  const processAndUploadFile = (file) => {
    const error = validateFile(file);
    if (error) {
      setErrorMessage(error);
      return;
    }

    setErrorMessage(null);
    setUploading(true);

    // 1. Convert file to Data URL instantly for 0-lag preview & profile update
    const reader = new FileReader();
    reader.onloadend = async () => {
      const dataUrl = reader.result;
      setPreviewUrl(dataUrl);

      // Save image immediately to form & AuthContext
      if (onUploadSuccess) {
        onUploadSuccess(dataUrl);
      }
      setUploading(false);
      toast.success('Profile picture updated successfully!');

      // 2. Attempt background upload to Firebase Storage (if bucket is active)
      try {
        const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const storagePath = `profilePictures/${userId}/${Date.now()}_${cleanFileName}`;
        const storageRef = ref(storage, storagePath);

        // Delete old image if it exists in Firebase Storage
        if (currentUrl && currentUrl.includes('firebasestorage.googleapis.com')) {
          try {
            await deleteObject(ref(storage, currentUrl));
          } catch (e) {}
        }

        const uploadTask = uploadBytesResumable(storageRef, file);

        // 3-second safety timeout for Firebase Storage background sync
        const timeoutId = setTimeout(() => {
          uploadTask.cancel();
        }, 3000);

        uploadTask.on(
          'state_changed',
          null,
          (err) => {
            clearTimeout(timeoutId);
            console.warn('Firebase Storage notice:', err.message);
          },
          async () => {
            clearTimeout(timeoutId);
            try {
              const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
              setPreviewUrl(downloadUrl);
              if (onUploadSuccess) onUploadSuccess(downloadUrl);
            } catch (e) {}
          }
        );
      } catch (err) {
        console.warn('Background storage sync notice:', err.message);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processAndUploadFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      processAndUploadFile(file);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Hidden File Input for Native Camera / Gallery Picker */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Circular Avatar Upload Area */}
      <div
        onClick={() => !uploading && fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 transition-all duration-200 cursor-pointer group flex items-center justify-center bg-zinc-100 dark:bg-zinc-900 shadow-xl ${
          isDragging
            ? 'border-rose-500 scale-105 ring-4 ring-rose-500/30'
            : errorMessage
            ? 'border-rose-500/80'
            : 'border-rose-500/40 hover:border-rose-500'
        }`}
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Profile Preview"
            className={`w-full h-full object-cover transition duration-300 ${uploading ? 'opacity-40 blur-xs' : 'group-hover:scale-105'}`}
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-500 space-y-1">
            <FiUser className="w-10 h-10" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-500">Add Photo</span>
          </div>
        )}

        {/* Hover / Drag Overlay for Desktop */}
        <div className={`absolute inset-0 bg-zinc-950/60 flex flex-col items-center justify-center text-white transition-opacity duration-200 ${
          isDragging ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}>
          {isDragging ? (
            <>
              <FiUploadCloud className="w-8 h-8 text-rose-400 animate-bounce" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider mt-1 text-rose-300">Drop Image Here</span>
            </>
          ) : (
            <>
              <FiCamera className="w-7 h-7 text-white mb-1" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-200">
                {previewUrl ? 'Change Photo' : 'Upload Photo'}
              </span>
            </>
          )}
        </div>

        {/* Upload Loading Spinner */}
        {uploading && (
          <div className="absolute inset-0 bg-zinc-950/70 flex flex-col items-center justify-center text-white z-10 space-y-1">
            <FiLoader className="w-8 h-8 text-rose-500 animate-spin" />
            <span className="text-[10px] font-mono font-bold text-rose-400">Processing...</span>
          </div>
        )}
      </div>

      {/* Helper & Validation Error Messages */}
      <div className="text-center space-y-1">
        {errorMessage ? (
          <p className="text-xs font-semibold text-rose-500 flex items-center justify-center gap-1.5 animate-pulse">
            <FiAlertCircle className="flex-shrink-0" /> {errorMessage}
          </p>
        ) : (
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono">
            Click, tap, or drag & drop to upload (Max 5MB: JPG, PNG, WEBP)
          </p>
        )}
      </div>
    </div>
  );
};

export default ProfilePictureUpload;
