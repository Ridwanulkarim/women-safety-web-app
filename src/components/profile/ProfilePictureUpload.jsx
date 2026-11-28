import React, { useState, useRef, useEffect } from 'react';
import { FiCamera, FiUser, FiLoader, FiAlertCircle, FiUploadCloud } from 'react-icons/fi';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../../firebase/config';
import { useLanguage } from '../../context/LanguageContext';
import toast from 'react-hot-toast';

const ProfilePictureUpload = ({ currentUrl, onUploadSuccess, userId = 'guest' }) => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

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
    if (!file) return isBn ? 'কোনো ফাইল নির্বাচন করা হয়নি।' : 'No file selected.';
    if (!file.type || !file.type.startsWith('image/')) {
      return isBn ? 'ছবির ফরম্যাট সঠিক নয় (JPEG, PNG, WEBP)।' : 'Select a valid image file (JPEG, PNG, WEBP, GIF).';
    }
    if (file.size > 5 * 1024 * 1024) {
      return isBn ? 'ছবির আকার ৫ মেগাবাইটের কম হতে হবে।' : 'File size must be under 5 MB.';
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

    const reader = new FileReader();
    reader.onloadend = async () => {
      const dataUrl = reader.result;
      setPreviewUrl(dataUrl);

      if (onUploadSuccess) {
        onUploadSuccess(dataUrl);
      }
      setUploading(false);
      toast.success(isBn ? 'প্রোফাইল ছবি আপডেট হয়েছে' : 'Profile photo updated');

      try {
        const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const storagePath = `profilePictures/${userId}/${Date.now()}_${cleanFileName}`;
        const storageRef = ref(storage, storagePath);

        if (currentUrl && currentUrl.includes('firebasestorage.googleapis.com')) {
          try {
            await deleteObject(ref(storage, currentUrl));
          } catch (e) {}
        }

        const uploadTask = uploadBytesResumable(storageRef, file);
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
    if (file) processAndUploadFile(file);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      <div
        onClick={() => !uploading && fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(false);
        }}
        className={`relative w-28 h-28 rounded-full overflow-hidden border transition-colors cursor-pointer group flex items-center justify-center bg-[#f4f4f5] dark:bg-[#141415] ${
          isDragging
            ? 'border-[#e11d48]'
            : errorMessage
            ? 'border-[#dc2626]'
            : 'border-zinc-900/15 dark:border-white/15 hover:border-zinc-900/30 dark:hover:border-white/30'
        }`}
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Profile preview"
            className={`w-full h-full object-cover transition-opacity duration-150 ${uploading ? 'opacity-40' : ''}`}
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-[#737373] dark:text-[#85858b] space-y-1">
            <FiUser className="w-8 h-8 dispatch-icon" />
            <span className="text-xs font-medium">{isBn ? 'ছবি যোগ করুন' : 'Add photo'}</span>
          </div>
        )}

        <div
          className={`absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white transition-opacity duration-150 ${
            isDragging ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
        >
          {isDragging ? (
            <>
              <FiUploadCloud className="w-6 h-6 dispatch-icon" />
              <span className="text-xs mt-1">{isBn ? 'এখানে ছাড়ুন' : 'Drop image'}</span>
            </>
          ) : (
            <>
              <FiCamera className="w-5 h-5 mb-1 dispatch-icon" />
              <span className="text-xs">
                {previewUrl ? (isBn ? 'পরিবর্তন' : 'Change') : (isBn ? 'আপলোড' : 'Upload')}
              </span>
            </>
          )}
        </div>

        {uploading && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white z-10 space-y-1">
            <FiLoader className="w-6 h-6 animate-spin dispatch-icon" />
            <span className="text-xs">{isBn ? 'আপলোড হচ্ছে' : 'Uploading'}</span>
          </div>
        )}
      </div>

      <div className="text-center">
        {errorMessage ? (
          <p className="text-xs text-[#dc2626] dark:text-[#e5484d] flex items-center justify-center gap-1.5">
            <FiAlertCircle className="w-3.5 h-3.5 shrink-0 dispatch-icon" /> {errorMessage}
          </p>
        ) : (
          <p className="text-xs text-[#737373] dark:text-[#85858b]">
            {isBn ? 'সর্বোচ্চ ৫ মেগাবাইট (JPG, PNG, WEBP)' : 'Max 5 MB · JPG, PNG, or WEBP'}
          </p>
        )}
      </div>
    </div>
  );
};

export default ProfilePictureUpload;
