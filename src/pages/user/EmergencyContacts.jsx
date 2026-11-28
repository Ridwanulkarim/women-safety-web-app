import React, { useState } from 'react';
import { FiPhoneCall, FiPlusCircle, FiAlertTriangle, FiUserPlus, FiUsers } from 'react-icons/fi';
import ContactCard from '../../components/contacts/ContactCard';
import ContactModal from '../../components/contacts/ContactModal';
import { useSOS } from '../../context/SOSContext';
import { useLanguage } from '../../context/LanguageContext';
import { toBengaliDigits } from '../../utils/helpers';

const EmergencyContacts = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const { savedContacts = [], addContact, deleteContact, loadingContacts } = useSOS();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const handleAddContact = async (data) => {
    const success = await addContact(data);
    if (success) {
      setModalOpen(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="surface-panel p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-medium text-[#171717] dark:text-[#ededed]">
              {isBn ? 'জরুরি পরিচিতি তালিকা' : 'Emergency contacts'}
            </h1>
            <span className="status-tag font-mono tabular-nums">
              {isBn ? `${toBengaliDigits(savedContacts.length)}/৫ কোটা` : `${savedContacts.length}/5 linked`}
            </span>
          </div>
          <p className="text-sm text-[#525252] dark:text-[#a1a1a6]">
            {isBn
              ? 'সর্বোচ্চ ৫ জন বিশ্বস্ত পরিচিতির নম্বর সংরক্ষণ করুন যারা আপনার এসওএস সতর্কবার্তা পাবেন।'
              : 'Up to 5 trusted guardians notified when you trigger an SOS alert.'}
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          disabled={savedContacts.length >= 5}
          className="btn-solid h-10 px-4 text-xs shrink-0"
        >
          <FiPlusCircle className="w-4 h-4 dispatch-icon" />
          {isBn
            ? `পরিচিতি যোগ করুন (${toBengaliDigits(savedContacts.length)}/৫)`
            : `Add contact (${savedContacts.length}/5)`}
        </button>
      </div>

      {savedContacts.length >= 5 && (
        <div className="p-3.5 rounded-xl bg-[#f4f4f5] dark:bg-[#232325] border border-zinc-900/[0.08] dark:border-white/[0.08] text-xs text-[#525252] dark:text-[#a1a1a6] flex items-center gap-2.5">
          <FiAlertTriangle className="w-4 h-4 text-[#e11d48] shrink-0 dispatch-icon" />
          <span>
            {isBn
              ? 'সর্বোচ্চ ৫ জন পরিচিতির সীমা পূর্ণ হয়েছে। নতুন যোগ করতে আগের একটি মুছে ফেলুন।'
              : 'Maximum limit of 5 contacts reached. Remove an existing guardian to add another.'}
          </span>
        </div>
      )}

      {loadingContacts ? (
        <div className="p-12 text-center text-sm text-[#737373] dark:text-[#85858b]">
          {isBn ? 'লোড হচ্ছে' : 'Loading emergency contacts'}
        </div>
      ) : savedContacts.length === 0 ? (
        <div className="surface-panel p-10 text-center space-y-4">
          <div className="w-10 h-10 mx-auto rounded-lg bg-[#f4f4f5] dark:bg-[#232325] text-[#525252] dark:text-[#a1a1a6] flex items-center justify-center">
            <FiUsers className="w-5 h-5 dispatch-icon" />
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <h2 className="text-base font-medium text-[#171717] dark:text-[#ededed]">
              {isBn ? 'কোনো জরুরি পরিচিতি সংরক্ষিত নেই' : 'No emergency contacts saved'}
            </h2>
            <p className="text-sm text-[#525252] dark:text-[#a1a1a6] leading-relaxed">
              {isBn
                ? 'বিপদের মুহূর্তে তাৎক্ষণিক বার্তা পাঠাতে পরিবার বা বন্ধুদের সর্বোচ্চ ৫ জনের নম্বর যোগ করুন।'
                : 'Add up to 5 trusted family members or friends to receive instant distress alerts.'}
            </p>
          </div>
          <button onClick={() => setModalOpen(true)} className="btn-solid h-10 px-4 text-xs inline-flex">
            <FiUserPlus className="w-4 h-4 dispatch-icon" />
            {isBn ? 'প্রথম পরিচিতি যোগ করুন' : 'Add emergency contact'}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {savedContacts.map((c) => (
            <ContactCard key={c.id || c._id} contact={c} onDelete={(id) => deleteContact(id)} />
          ))}
        </div>
      )}

      <ContactModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleAddContact}
      />
    </div>
  );
};

export default EmergencyContacts;
