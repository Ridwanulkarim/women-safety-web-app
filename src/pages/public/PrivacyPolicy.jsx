import React from 'react';
import { FiShield, FiLock, FiCheckCircle, FiMapPin, FiCamera, FiPhoneCall } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext';

const PrivacyPolicy = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="surface-panel p-6 sm:p-8 space-y-3">
        <div className="flex items-center gap-2">
          <span className="status-tag">
            <FiLock className="w-3.5 h-3.5 dispatch-icon" />
            {isBn ? 'অফিসিয়াল প্রাইভেসি নীতিমালা' : 'Privacy disclosure'}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-medium tracking-[-0.02em] text-[#171717] dark:text-[#ededed]">
          {isBn ? 'সেফহ্যাভেন গোপনীয়তা নীতি ও নিরাপত্তা সম্মতি' : 'SafeHaven privacy and safety compliance'}
        </h1>
        <p className="text-xs text-[#737373] dark:text-[#85858b] font-mono tabular-nums">
          {isBn
            ? 'সর্বশেষ হালনাগাদ: ১২ আগস্ট, ২০২৬ · গুগল প্লে ও অ্যাপল অ্যাপ স্টোর স্ট্যান্ডার্ড'
            : 'Updated August 12, 2026 · Google Play and App Store disclosure standard'}
        </p>
      </div>

      <div className="surface-panel p-6 sm:p-8 space-y-6 text-sm text-[#525252] dark:text-[#a1a1a6]">
        <div className="space-y-2">
          <h2 className="text-base font-medium text-[#171717] dark:text-[#ededed] flex items-center gap-2">
            <FiShield className="w-4 h-4 text-[#e11d48] dispatch-icon" />
            {isBn ? '১. ব্যবহারকারীর তথ্যের গোপনীয়তা' : '1. Commitment to user privacy'}
          </h2>
          <p className="leading-relaxed">
            {isBn
              ? 'সেফহেভেন জরুরি বিপদের মুহূর্তে মানুষের ব্যক্তিগত নিরাপত্তা নিশ্চিত করার একটি প্ল্যাটফর্ম। আমরা ব্যবহারকারীর কোনো ডেটা বিক্রি করি না বা বাণিজ্যিক থার্ড-পার্টির সাথে শেয়ার করি না।'
              : 'SafeHaven is a personal protection platform engineered for emergency distress situations. We never sell or monetize user data or share personal records with advertisers.'}
          </p>
        </div>

        <div className="space-y-2 border-t border-zinc-900/[0.08] dark:border-white/[0.08] pt-5">
          <h2 className="text-base font-medium text-[#171717] dark:text-[#ededed] flex items-center gap-2">
            <FiMapPin className="w-4 h-4 text-[#737373] dark:text-[#85858b] dispatch-icon" />
            {isBn ? '২. জিওলোকেশন ও জিপিএস ব্যবহার' : '2. Geolocation and GPS telemetry'}
          </h2>
          <p className="leading-relaxed">
            {isBn
              ? 'অক্ষাংশ ও দ্রাঘিমাংশ কেবল তখনই পাঠানো হয় যখন SOS বাটন বা হ্যান্ডস-ফ্রি ভয়েস অ্যালার্ট সক্রিয় করা হয়।'
              : 'Hardware GPS coordinates are collected strictly to power live location previews and SOS distress broadcasts to designated guardians when triggered.'}
          </p>
        </div>

        <div className="space-y-2 border-t border-zinc-900/[0.08] dark:border-white/[0.08] pt-5">
          <h2 className="text-base font-medium text-[#171717] dark:text-[#ededed] flex items-center gap-2">
            <FiCamera className="w-4 h-4 text-[#737373] dark:text-[#85858b] dispatch-icon" />
            {isBn ? '৩. প্রমাণ সংরক্ষণাগার' : '3. Evidence locker access'}
          </h2>
          <p className="leading-relaxed">
            {isBn
              ? 'ভয়েস রেকর্ডার ও ক্যামেরা ক্যাপচারের মাধ্যমে সংগৃহীত অডিও ও ছবি আপনার ডিভাইসে SHA-256 হ্যাশ সহ সংরক্ষিত থাকে। সম্মতি ছাড়া ব্যাকগ্রাউন্ডে ক্যামেরা বা মাইক্রোফোন চালু হয় না।'
              : 'Audio recordings and photos captured inside the Evidence Vault remain on your device with SHA-256 verification digests. Hardware sensors are accessed only upon explicit action.'}
          </p>
        </div>

        <div className="space-y-2 border-t border-zinc-900/[0.08] dark:border-white/[0.08] pt-5">
          <h2 className="text-base font-medium text-[#171717] dark:text-[#ededed] flex items-center gap-2">
            <FiPhoneCall className="w-4 h-4 text-[#737373] dark:text-[#85858b] dispatch-icon" />
            {isBn ? '৪. জরুরি পরিচিতি ও হেল্পলাইন' : '4. Emergency contacts and speed dial'}
          </h2>
          <p className="leading-relaxed">
            {isBn
              ? 'জরুরি পরিচিতির নম্বরগুলো ফায়ারবেস ক্লাউড ফায়ারস্টোরে নিরাপত্তা বিধির আওতায় সংরক্ষিত হয়। জাতীয় হেল্পলাইন কলগুলো সরাসরি আপনার ডিভাইসের নেটওয়ার্কে ডায়াল হয়।'
              : 'Saved guardians are stored under Firebase Cloud Firestore ownership rules. National hotline links initiate direct cellular calls over your mobile network.'}
          </p>
        </div>

        <div className="space-y-2 border-t border-zinc-900/[0.08] dark:border-white/[0.08] pt-5">
          <h2 className="text-base font-medium text-[#171717] dark:text-[#ededed] flex items-center gap-2">
            <FiCheckCircle className="w-4 h-4 text-[#737373] dark:text-[#85858b] dispatch-icon" />
            {isBn ? '৫. ডেটা নিয়ন্ত্রণ ও অধিকার' : '5. User control and data deletion'}
          </h2>
          <p className="leading-relaxed">
            {isBn
              ? 'ব্যবহারকারী যেকোনো সময় সংরক্ষিত প্রমাণাদি, জরুরি পরিচিতি এবং প্রোফাইলের তথ্য পরিবর্তন বা মুছে ফেলতে পারেন।'
              : 'You retain full control to inspect, export, edit, or delete saved contacts, evidence files, and profile records at any time.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
