import React, { useState } from 'react';
import { FiPhoneCall, FiPlusCircle, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';
import ContactCard from '../../components/contacts/ContactCard';
import ContactModal from '../../components/contacts/ContactModal';
import toast from 'react-hot-toast';

const EmergencyContacts = () => {
  const [contacts, setContacts] = useState([
    { id: 'c1', name: 'Primary Guardian', phone: '+8801700000000', relationship: 'Mother', isPrimary: true, createdAt: new Date().toISOString() },
    { id: 'c2', name: 'Secondary Contact', phone: '+8801800000000', relationship: 'Sister', isPrimary: false, createdAt: new Date().toISOString() }
  ]);

  const [modalOpen, setModalOpen] = useState(false);

  const handleAddContact = (data) => {
    if (contacts.length >= 5) {
      toast.error('Maximum limit of 5 emergency contacts reached.');
      return;
    }
    const newContact = {
      id: 'c_' + Date.now(),
      ...data,
      createdAt: new Date().toISOString()
    };
    setContacts(prev => [...prev, newContact]);
    toast.success('Emergency contact added successfully.');
  };

  const handleDeleteContact = (id) => {
    setContacts(prev => prev.filter(c => c.id !== id));
    toast.success('Contact removed.');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
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
          disabled={contacts.length >= 5}
          className="px-5 py-3 rounded-2xl bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-pink-600/30 transition"
        >
          <FiPlusCircle className="text-base" /> Add Contact ({contacts.length}/5)
        </button>
      </div>

      {contacts.length >= 5 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs font-semibold flex items-center gap-2">
          <FiAlertTriangle /> Maximum quota of 5 emergency contacts reached. Delete an existing contact to add a new one.
        </div>
      )}

      <div className="space-y-4">
        {contacts.map((c) => (
          <ContactCard key={c.id} contact={c} onDelete={handleDeleteContact} />
        ))}
      </div>

      <ContactModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleAddContact}
      />
    </div>
  );
};

export default EmergencyContacts;
