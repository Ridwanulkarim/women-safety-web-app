import React, { useState } from 'react';
import { FiPhoneCall, FiPlusCircle, FiAlertTriangle, FiUserPlus, FiUsers } from 'react-icons/fi';
import ContactCard from '../../components/contacts/ContactCard';
import ContactModal from '../../components/contacts/ContactModal';
import { useSOS } from '../../context/SOSContext';
import { useLanguage } from '../../context/LanguageContext';

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

  const handleDeleteContact = (id) => {
    deleteContact(id);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-sans relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-rose-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="glass-card-xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-600 to-rose-700 text-white flex items-center justify-center text-2xl font-bold shadow-lg shadow-rose-600/30">
            <FiPhoneCall />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold font-heading text-zinc-900 dark:text-white">
                {isBn ? 'জরুরি পরিচিতি তালিকা' : 'Emergency Contacts'}
              </h1>
              <span className="mono-tag mono-tag-rose text-[10px]">
                {isBn ? `${savedContacts.length}/৫ কোটা` : `${savedContacts.length}/5 QUOTA`}
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {isBn
                ? 'সর্বোচ্চ ৫ জন বিশ্বস্ত পরিচিতির নম্বর যোগ করুন যারা আপনার এসওএস সতর্কবার্তা ও এসএমএস পাবেন।'
                : 'Add up to 5 priority contacts who will receive your SOS distress broadcasts & SMS.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          disabled={savedContacts.length >= 5}
          className="btn-danger py-3 px-5 text-xs font-mono font-bold uppercase tracking-wider shadow-lg shadow-rose-600/25"
        >
          <FiPlusCircle className="text-base" /> {isBn ? `পরিচিতি যোগ করুন (${savedContacts.length}/৫)` : `Add Contact (${savedContacts.length}/5)`}
        </button>
      </div>

      {savedContacts.length >= 5 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs font-semibold flex items-center gap-2">
          <FiAlertTriangle className="flex-shrink-0 text-base" />
          {isBn
            ? 'সর্বোচ্চ ৫ জন পরিচিতির কোটা পূর্ণ হয়েছে। নতুন যোগ করতে আগের কোনো একটি মুছে ফেলুন।'
            : 'Maximum quota of 5 emergency contacts reached. Delete an existing contact to add a new one.'}
        </div>
      )}

      {loadingContacts ? (
        <div className="p-12 text-center text-xs text-zinc-400 font-mono">
          {isBn ? 'সংরক্ষিত জরুরি পরিচিতি লোড হচ্ছে...' : 'Loading saved emergency contacts...'}
        </div>
      ) : savedContacts.length === 0 ? (
        <div className="p-8 sm:p-12 glass-card-xl rounded-3xl text-center space-y-4 border-dashed border-2 border-zinc-300 dark:border-zinc-800">
          <div className="w-16 h-16 mx-auto rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center text-3xl">
            <FiUsers />
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="text-lg font-extrabold text-zinc-900 dark:text-white font-heading">
              {isBn ? 'কোনো জরুরি পরিচিতি সংরক্ষিত নেই' : 'No Emergency Contacts Linked'}
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-normal">
              {isBn
                ? 'আপনি এখনও কোনো জরুরি পরিচিতি যোগ করেননি। আপনার বিপদের সময় সরাসরি লাইভ লোকেশন ও বার্তা পাঠাতে পরিবার বা বন্ধুদের সর্বোচ্চ ৫ জনের নম্বর যুক্ত করুন।'
                : "You haven't added any emergency contacts yet. Manually add up to 5 priority contacts (family or trusted friends) to receive your SOS broadcasts."}
            </p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="btn-danger py-3 px-6 text-xs font-mono font-bold uppercase tracking-wider inline-flex items-center gap-2 shadow-lg shadow-rose-600/30"
          >
            <FiUserPlus /> {isBn ? 'আপনার প্রথম জরুরি পরিচিতি যোগ করুন' : 'Add Your First Emergency Contact'}
          </button>
        </div>
      ) : (
        <div className="space-y-3.5 relative z-10">
          {savedContacts.map((c) => (
            <ContactCard key={c.id || c._id} contact={c} onDelete={handleDeleteContact} />
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
