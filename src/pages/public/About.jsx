import React from 'react';
import { FiShield, FiHeart, FiLock, FiCheckCircle } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext';

const About = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 relative overflow-hidden font-sans">
      {/* Ambient background glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="text-center max-w-3xl mx-auto space-y-4 relative z-10">
        <span className="mono-tag mono-tag-rose">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 telemetry-dot"></span> {isBn ? 'উদ্দেশ্য ও মূল্যবোধ' : 'Mission & Values'}
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-zinc-900 dark:text-white tracking-tight">
          {isBn ? 'ব্যক্তিগত নিরাপত্তা ও দ্রুত ' : 'Empowering Personal Safety Through '} <br className="hidden sm:block" />
          <span className="gradient-text-rose">{isBn ? 'জরুরি সুরক্ষা নেটওয়ার্ক' : 'Rapid Telemetry & Protection'}</span>
        </h1>
        <p className="text-xs sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
          {isBn
            ? 'সেফহ্যাভেন প্ল্যাটফর্ম তৈরি করা হয়েছে বিপদের মুহূর্তে এবং উদ্ধারকারীদের দ্রুত পদক্ষেপের মধ্যকার সময় শূন্যে নামিয়ে আনতে, যাতে যেকোনো জরুরি পরিস্থিতিতে একজন নারী নিজেকে সম্পূর্ণ নিরাপদ অনুভব করেন।'
            : 'SafeHaven was built to eliminate the seconds between distress detection and rapid emergency dispatch, providing users with absolute certainty in critical moments.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        <div className="product-card product-card-hover p-7 sm:p-8 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-600 to-rose-700 text-white flex items-center justify-center text-2xl font-bold shadow-lg shadow-rose-600/25">
            <FiShield />
          </div>
          <h3 className="text-lg font-extrabold text-zinc-900 dark:text-white font-heading">
            {isBn ? 'আমাদের লক্ষ্য (Our Mission)' : 'Our Mission'}
          </h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
            {isBn
              ? 'জিরো-ফ্র্রিকশন জরুরি এসওএস প্যানিক অ্যাক্টিভেশন, প্রাইভেসী-ফার্স্ট জিপিএস টেলিমেট্রি ব্রডকাস্টিং এবং সারা বাংলাদেশে জাতীয় হেল্পলাইনের (৯৯৯) সাথে সরাসরি সংযোগ নিশ্চিত করা।'
              : 'Provide zero-friction emergency panic activation, privacy-first geolocation telemetry broadcasting, and direct national dispatch linkages across Bangladesh and beyond.'}
          </p>
        </div>

        <div className="product-card product-card-hover p-7 sm:p-8 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg shadow-purple-600/25">
            <FiHeart />
          </div>
          <h3 className="text-lg font-extrabold text-zinc-900 dark:text-white font-heading">
            {isBn ? 'নারীর ক্ষমতায়ন ও সুরক্ষা' : 'Empowerment'}
          </h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
            {isBn
              ? 'প্রত্যেক নারীকে আত্মরক্ষার কৌশল, আইনি অধিকার নির্দেশিকা, স্বয়ংক্রিয় এআই ভয়েস ডিটেকশন এবং আইনি প্রমাণাদি সংরক্ষণাগারে শক্তিশালী ডিজিটাল প্রমাণের সুবিধা প্রদান করা।'
              : 'Equip every individual with actionable self-defense strategies, legal rights guides, automated emergency check-ins, and digital evidence capture tools.'}
          </p>
        </div>

        <div className="product-card product-card-hover p-7 sm:p-8 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg shadow-emerald-600/25">
            <FiLock />
          </div>
          <h3 className="text-lg font-extrabold text-zinc-900 dark:text-white font-heading">
            {isBn ? 'কঠোর তথ্য গোপনীয়তা ও সুরক্ষা' : 'Strict Cryptographic Privacy'}
          </h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
            {isBn
              ? 'আপনার লোকেশন ডেটা কেবলমাত্র সক্রিয় এসওএস বিপদকালীন সময় সংগ্রহ করা হয় এবং AES-256 এনক্রিপশনে সুরক্ষিত থাকে। আপনার ব্যক্তিগত তথ্য কখনোই বিক্রি বা অপব্যবহার করা হয় না।'
              : 'Your location telemetry is stored strictly during active distress broadcasts and encrypted at rest with AES-256. We will never sell or monetize your safety data.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
