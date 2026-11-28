import React, { useState } from 'react';
import { FiPhoneCall, FiActivity } from 'react-icons/fi';
import { EMERGENCY_NUMBERS } from '../../utils/constants';
import FakeCallModal from '../../components/safety/FakeCallModal';
import SirenAlarmButton from '../../components/safety/SirenAlarmButton';
import MedicalIDModal from '../../components/safety/MedicalIDModal';
import { useLanguage } from '../../context/LanguageContext';
import { localizeNum } from '../../utils/helpers';

const EmergencyHelp = () => {
  const [fakeCallOpen, setFakeCallOpen] = useState(false);
  const [medicalIdOpen, setMedicalIdOpen] = useState(false);
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const categoryMap = {
    'National Hotline': isBn ? 'জাতীয় হটলাইন' : 'National hotline',
    'Law Enforcement': isBn ? 'আইন শৃঙ্খলা' : 'Law enforcement',
    'Specialized Hotline': isBn ? 'বিশেষ হটলাইন' : 'Specialized line',
    'Child Protection': isBn ? 'শিশু সুরক্ষা' : 'Child protection',
    'Medical Advice': isBn ? 'চিকিৎসা পরামর্শ' : 'Medical advice'
  };

  const nameMap = {
    'National Emergency Service': isBn ? 'জাতীয় জরুরি সেবা' : 'National Emergency Service',
    'Police Emergency Helpline': isBn ? 'পুলিশ জরুরি হেল্পলাইন' : 'Police Emergency Helpline',
    'National Women Helpline': isBn ? 'জাতীয় নারী হেল্পলাইন' : 'National Women Helpline',
    'Child Helpline Bangladesh': isBn ? 'চাইল্ড হেল্পলাইন বাংলাদেশ' : 'Child Helpline Bangladesh',
    'Shasthyo Batayon': isBn ? 'স্বাস্থ্য বাতায়ন' : 'Shasthyo Batayon'
  };

  const descMap = {
    'National Emergency Service': isBn
      ? 'পুলিশ, ফায়ার সার্ভিস এবং অ্যাম্বুলেন্স দ্রুত প্রেরণের কেন্দ্রীয় জাতীয় সেবা।'
      : 'Combined national dispatch service for police, fire department, and ambulance.',
    'Police Emergency Helpline': isBn
      ? 'তাৎক্ষণিক পুলিশি সহায়তা ও জরুরি অপরাধ প্রতিরোধের সরাসরি হটলাইন।'
      : 'Direct hotline for immediate police response and emergency reporting.',
    'National Women Helpline': isBn
      ? 'নারীর প্রতি সহিংসতা, হেনস্তা ও পারিবারিক নির্যাতন প্রতিরোধে ২৪/৭ সহায়তা।'
      : 'Dedicated support line against harassment, violence, and legal emergencies.',
    'Child Helpline Bangladesh': isBn
      ? 'শিশু অধিকার সুরক্ষা ও জরুরি উদ্ধারে ২৪/৭ টোল-ফ্রি হেল্পলাইন।'
      : 'Toll-free emergency helpline for child protection and rescue coordination.',
    'Shasthyo Batayon': isBn
      ? 'নিবন্ধিত ডাক্তারের স্বাস্থ্য পরামর্শ, হাসপাতালের তথ্য ও অ্যাম্বুলেন্স সহায়তা।'
      : 'Government health helpline for medical advice, hospital lookup, and ambulance support.'
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Page Header */}
      <div className="max-w-2xl space-y-3">
        <p className="text-xs font-mono text-[#737373] dark:text-[#85858b]">
          {isBn ? 'জরুরি অপারেশন ডেস্ক' : 'Emergency operations desk'}
        </p>
        <h1 className="text-3xl sm:text-4xl font-medium tracking-[-0.02em] text-[#171717] dark:text-[#ededed]">
          {isBn ? 'জরুরি স্পিড ডায়াল ও নিরাপত্তা টুলস' : 'Emergency speed dial and deterrence tools'}
        </h1>
        <p className="text-base text-[#525252] dark:text-[#a1a1a6]">
          {isBn
            ? 'তাৎক্ষণিক কল করতে নিচের হেল্পলাইন নির্বাচন করুন অথবা আত্মরক্ষা টুলস চালু করুন'
            : 'Call national response desks directly or trigger deterrence controls below'}
        </p>
      </div>

      {/* Quick Deterrence Controls */}
      <div className="surface-panel p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-900/[0.08] dark:border-white/[0.08] pb-4">
          <div className="space-y-1">
            <h2 className="text-base font-medium text-[#171717] dark:text-[#ededed]">
              {isBn ? 'তাৎক্ষণিক আত্মরক্ষা ও মেডিকেল টুলস' : 'Immediate deterrence and medical controls'}
            </h2>
            <p className="text-xs text-[#525252] dark:text-[#a1a1a6]">
              {isBn ? 'সাইরেন অ্যালার্ম, ভুয়া কল সিমুলেটর এবং জরুরি মেডিকেল কার্ড' : 'Acoustic siren alarm, escape call simulator, and medical ID card'}
            </p>
          </div>
          <span className="status-tag mono-tag-emerald">{isBn ? 'সক্রিয়' : 'Ready'}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="surface-raised p-4 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <h3 className="text-sm font-medium text-[#171717] dark:text-[#ededed]">
                {isBn ? 'উচ্চ ডেসিবেল সাইরেন' : 'Acoustic siren alarm'}
              </h3>
              <p className="text-xs text-[#737373] dark:text-[#85858b]">{isBn ? 'আশেপাশের দৃষ্টি আকর্ষণে' : 'Loud deterrence tone'}</p>
            </div>
            <SirenAlarmButton />
          </div>

          <div className="surface-raised p-4 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <h3 className="text-sm font-medium text-[#171717] dark:text-[#ededed]">
                {isBn ? 'ফেক এস্কেপ কল' : 'Fake escape call'}
              </h3>
              <p className="text-xs text-[#737373] dark:text-[#85858b]">{isBn ? 'নিরাপদ প্রস্থানের জন্য' : 'Simulated incoming call'}</p>
            </div>
            <button onClick={() => setFakeCallOpen(true)} className="btn-solid h-9 px-3 text-xs shrink-0">
              <FiPhoneCall className="w-4 h-4 dispatch-icon" /> {isBn ? 'চালু করুন' : 'Start call'}
            </button>
          </div>

          <div className="surface-raised p-4 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <h3 className="text-sm font-medium text-[#171717] dark:text-[#ededed]">
                {isBn ? 'মেডিকেল আইডি কার্ড' : 'Medical ID card'}
              </h3>
              <p className="text-xs text-[#737373] dark:text-[#85858b]">{isBn ? 'রক্তের গ্রুপ ও অ্যালার্জি' : 'Blood group and allergies'}</p>
            </div>
            <button onClick={() => setMedicalIdOpen(true)} className="btn-outline h-9 px-3 text-xs shrink-0">
              <FiActivity className="w-4 h-4 text-[#e11d48] dispatch-icon" /> {isBn ? 'দেখুন' : 'Open ID'}
            </button>
          </div>
        </div>
      </div>

      {/* Hotline Speed Dial Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {EMERGENCY_NUMBERS.map((num) => (
          <div key={num.id} className="surface-card product-card-hover p-6 flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="status-tag">{categoryMap[num.category] || num.category}</span>
                <span className="font-mono tabular-nums text-lg font-medium text-[#e11d48] dark:text-[#fb7185]">
                  {localizeNum(num.number, isBn)}
                </span>
              </div>
              <h3 className="text-base font-medium text-[#171717] dark:text-[#ededed]">
                {nameMap[num.name] || num.name}
              </h3>
              <p className="text-sm text-[#525252] dark:text-[#a1a1a6] leading-relaxed">
                {descMap[num.name] || num.description}
              </p>
            </div>

            <a href={`tel:${num.number}`} className="w-full btn-danger h-10 text-xs">
              <FiPhoneCall className="w-4 h-4 dispatch-icon" />
              <span>{isBn ? `কল করুন ${localizeNum(num.number, isBn)}` : `Call ${num.number}`}</span>
            </a>
          </div>
        ))}
      </div>

      <FakeCallModal isOpen={fakeCallOpen} onClose={() => setFakeCallOpen(false)} />
      <MedicalIDModal isOpen={medicalIdOpen} onClose={() => setMedicalIdOpen(false)} />
    </div>
  );
};

export default EmergencyHelp;
