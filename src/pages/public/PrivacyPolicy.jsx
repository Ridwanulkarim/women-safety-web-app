import React from 'react';
import { FiShield, FiLock, FiCheckCircle, FiMapPin, FiCamera, FiPhoneCall } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext';

const PrivacyPolicy = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8 font-sans">
      
      {/* Header */}
      <div className="product-card p-6 sm:p-8 space-y-3">
        <div className="flex items-center gap-2">
          <span className="mono-tag mono-tag-rose">
            <FiLock /> {isBn ? 'অফিসিয়াল প্রাইভেসি নীতিমালা' : 'OFFICIAL PRIVACY DISCLOSURE'}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-zinc-900 dark:text-white">
          {isBn ? 'সেফহ্যাভেন গোপনীয়তা নীতি ও নিরাপত্তা সম্মতি' : 'SafeHaven Privacy & Safety Compliance Policy'}
        </h1>
        <p className="text-xs text-zinc-500 font-mono">
          {isBn ? 'সর্বশেষ হালনাগাদ: ১২ আগস্ট, ২০২৬ • গুগল প্লে স্টোর ও অ্যাপল অ্যাপ স্টোর স্ট্যান্ডার্ড' : 'Last Updated: August 12, 2026 • Google Play Store & iOS App Store Compliance'}
        </p>
      </div>

      {/* Content Section */}
      <div className="product-card p-6 sm:p-8 space-y-6 text-sm text-zinc-700 dark:text-zinc-300">
        
        <div className="space-y-2">
          <h2 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2 font-heading">
            <FiShield className="text-rose-600" /> {isBn ? '১. ব্যবহারকারীর তথ্যের সর্বোচ্চ গোপনীয়তা' : '1. Commitment to User Privacy & Safety'}
          </h2>
          <p className="text-xs leading-relaxed">
            {isBn 
              ? 'সেফহ্যাভেন কোনো বাণিজ্যিক অ্যাপ নয়; এটি জরুরি বিপদের মুহূর্তে মানুষের জীবন ও ব্যক্তিগত নিরাপত্তা নিশ্চিত করার একটি জাতীয় প্ল্যাটফর্ম। আমরা ব্যবহারকারীর কোনো ডেটা বিক্রি করি না এবং কোনো থার্ড-পার্টির সাথে শেয়ার করি না।' 
              : 'SafeHaven is a mission-critical personal protection application designed to safeguard individuals during emergency distress situations. We prioritize absolute user privacy, zero commercial data monetization, and end-to-end user data ownership.'}
          </p>
        </div>

        <div className="space-y-2 border-t border-zinc-200 dark:border-zinc-800 pt-4">
          <h2 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2 font-heading">
            <FiMapPin className="text-rose-600" /> {isBn ? '২. জিওলোকেশন ও হার্ডওয়্যার জিপিএস ব্যবহার' : '2. Geolocation & Hardware GPS Data Usage'}
          </h2>
          <p className="text-xs leading-relaxed">
            {isBn 
              ? 'সেফহ্যাভেন ব্যবহারকারীর সঠিক অক্ষাংশ ও দ্রাঘিমাংশ শুধুমাত্র তখনই ট্র্যাক করে যখন SOS বাটন বা হ্যান্ডস-ফ্রি ভয়েস অ্যালার্ট সক্রিয় করা হয়। এটি সরাসরি আপনার জরুরি পরিচিতিদের কাছে লাইভ লোকেশন ম্যাপ সহ পাঠানো হয়।' 
              : 'SafeHaven collects real-time hardware GPS location coordinates (Latitude, Longitude) strictly to power the SOS Distress Broadcast feature. GPS data is transmitted to your designated emergency contacts and displayed on live telemetry maps only when an emergency alert is actively triggered by you.'}
          </p>
        </div>

        <div className="space-y-2 border-t border-zinc-200 dark:border-zinc-800 pt-4">
          <h2 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2 font-heading">
            <FiCamera className="text-rose-600" /> {isBn ? '৩. এভিডেন্স লকার (ক্যামেরা ও মাইক্রোফোন অ্যাক্সেস)' : '3. Evidence Locker (Camera & Microphone Access)'}
          </h2>
          <p className="text-xs leading-relaxed">
            {isBn 
              ? 'ভয়েস রেকর্ডার ও ক্যামেরা ক্যাপচার ব্যবহারের সময় সংগৃহীত অডিও ও ছবি আপনার ডিভাইসে ক্রিপ্টোগ্রাফিক SHA-256 হ্যাশ সহ সংরক্ষিত হয়। ব্যবহারকারীর স্পষ্ট সম্মতি ছাড়া অ্যাপ ব্যাকগ্রাউন্ডে ক্যামেরা বা মাইক চালু করে না।' 
              : 'When using the Evidence Locker features (Voice Recorder & Camera Capture), audio blobs and photo evidence are captured and stored locally on your device with cryptographic SHA-256 chain-of-custody verification. SafeHaven never accesses your camera or microphone in the background without explicit user action.'}
          </p>
        </div>

        <div className="space-y-2 border-t border-zinc-200 dark:border-zinc-800 pt-4">
          <h2 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2 font-heading">
            <FiPhoneCall className="text-rose-600" /> {isBn ? '৪. জরুরি কন্টাক্ট ও ডায়ালিং' : '4. Emergency Contacts & Speed Dialing'}
          </h2>
          <p className="text-xs leading-relaxed">
            {isBn 
              ? 'আপনার জরুরি পরিচিতিদের নম্বরগুলো নিরাপদে এনক্রিপ্টেড ডাটাবেজে রাখা হয়। জরুরি হটলাইন (৯৯৯, ১০৯) আপনার ফোনের নিজস্ব নেটওয়ার্ক ব্যবহার করে সরাসরি কল করে।' 
              : 'Emergency contacts saved by you are stored securely using dual persistence (local storage and encrypted database). National emergency helpline links (tel:999, tel:109) dial directly over your device’s mobile cellular network without transferring data to third parties.'}
          </p>
        </div>

        <div className="space-y-2 border-t border-zinc-200 dark:border-zinc-800 pt-4">
          <h2 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2 font-heading">
            <FiCheckCircle className="text-rose-600" /> {isBn ? '৫. ডেটা নিয়ন্ত্রণ ও ব্যবহারকারীর অধিকার' : '5. Data Security & Storage Transparency'}
          </h2>
          <p className="text-xs leading-relaxed">
            {isBn 
              ? 'সেফহ্যাভেন ফায়ারবেস অথেনটিকেশন ও এন্ড-টু-এন্ড এনক্রিপশন প্রটোকল অনুসরণ করে। ব্যবহারকারী যেকোনো সময় তার অ্যাকাউন্ট, রেকর্ডকৃত প্রমাণাদি এবং কন্টাক্ট তালিকা সম্পূর্ণ মুছে ফেলার পূর্ণ অধিকার রাখেন।' 
              : 'SafeHaven uses Firebase Authentication and encrypted HTTPS transport for all server communications. Users retain full rights to delete their evidence files, clear saved emergency contacts, or request complete account deletion at any time.'}
          </p>
        </div>

      </div>
    </div>
  );
};

export default PrivacyPolicy;
