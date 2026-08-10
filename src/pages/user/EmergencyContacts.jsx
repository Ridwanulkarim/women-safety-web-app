import React, { useState } from 'react';
import { FiPhoneCall, FiPlusCircle, FiAlertTriangle, FiUserPlus, FiUsers } from 'react-icons/fi';
import ContactCard from '../../components/contacts/ContactCard';
import ContactModal from '../../components/contacts/ContactModal';
import { useSOS } from '../../context/SOSContext';

const EmergencyContacts = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const { savedContacts = [], addContact, deleteContact, loadingContacts } = useSOS();

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
    <div className="max-w-4xl mx-auto space-y-8 font-sans">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-pink-600 text-white flex items-center justify-center text-2xl font-bold shadow-md">
            <FiPhoneCall />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-heading">Emergency Contacts</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Add up to 5 priority contacts who will receive your SOS distress broadcasts.</p>
          </div>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          disabled={savedContacts.length >= 5}
          className="px-5 py-3 rounded-2xl bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-pink-600/30 transition"
        >
          <FiPlusCircle className="text-base" /> Add Contact ({savedContacts.length}/5)
        </button>
      </div>

      {savedContacts.length >= 5 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs font-semibold flex items-center gap-2">
          <FiAlertTriangle className="flex-shrink-0 text-base" /> Maximum quota of 5 emergency contacts reached. Delete an existing contact to add a new one.
        </div>
      )}

      {loadingContacts ? (
        <div className="p-8 text-center text-xs text-slate-400 font-mono">
          Loading saved emergency contacts...
        </div>
      ) : savedContacts.length === 0 ? (
        <div className="p-8 sm:p-12 glass-card rounded-3xl text-center space-y-4 border-dashed border-2 border-slate-300 dark:border-slate-800">
          <div className="w-16 h-16 mx-auto rounded-full bg-pink-500/10 text-pink-500 flex items-center justify-center text-3xl">
            <FiUsers />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">No Emergency Contacts Saved</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              You haven't added any emergency contacts yet. Manually add up to 5 priority contacts (family or trusted friends) to receive your SOS broadcasts.
            </p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="px-6 py-3 rounded-2xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 shadow-lg shadow-pink-600/30 transition"
          >
            <FiUserPlus /> Add Your First Emergency Contact
          </button>
        </div>
      ) : (
        <div className="space-y-4">
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
