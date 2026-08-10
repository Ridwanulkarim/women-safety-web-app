import React, { useState, useEffect, useCallback } from 'react';
import { FiPhoneCall, FiPlusCircle, FiAlertTriangle, FiUserPlus, FiUsers } from 'react-icons/fi';
import ContactCard from '../../components/contacts/ContactCard';
import ContactModal from '../../components/contacts/ContactModal';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { useSOS } from '../../context/SOSContext';

const EmergencyContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const { refreshContacts } = useSOS();

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/contacts');
      if (Array.isArray(res.data?.data)) {
        setContacts(res.data.data);
      }
    } catch (err) {
      console.warn('Failed to fetch emergency contacts:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const handleAddContact = async (data) => {
    if (contacts.length >= 5) {
      toast.error('Maximum quota of 5 emergency contacts reached.');
      return;
    }

    // Duplicate Phone Number Validation
    const cleanNewPhone = (data.phone || '').replace(/[\s\-\(\)]/g, '');
    const isDuplicate = contacts.some(c => (c.phone || '').replace(/[\s\-\(\)]/g, '') === cleanNewPhone);

    if (isDuplicate) {
      toast.error(`Duplicate Error: A contact with phone number "${data.phone}" already exists in your emergency contacts list.`);
      return;
    }

    try {
      const res = await api.post('/contacts', data);
      const newContact = res.data?.data || { id: 'c_' + Date.now(), ...data };
      setContacts(prev => [...prev, newContact]);
      toast.success('Emergency contact added successfully.');
      if (refreshContacts) refreshContacts();
      setModalOpen(false);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add emergency contact.';
      toast.error(msg);
    }
  };

  const handleDeleteContact = async (id) => {
    try {
      await api.delete(`/contacts/${id}`);
      setContacts(prev => prev.filter(c => c.id !== id));
      toast.success('Emergency contact removed.');
      if (refreshContacts) refreshContacts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove contact.');
    }
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
          disabled={contacts.length >= 5}
          className="px-5 py-3 rounded-2xl bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-pink-600/30 transition"
        >
          <FiPlusCircle className="text-base" /> Add Contact ({contacts.length}/5)
        </button>
      </div>

      {contacts.length >= 5 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs font-semibold flex items-center gap-2">
          <FiAlertTriangle className="flex-shrink-0 text-base" /> Maximum quota of 5 emergency contacts reached. Delete an existing contact to add a new one.
        </div>
      )}

      {loading ? (
        <div className="p-8 text-center text-xs text-slate-400 font-mono">
          Loading saved emergency contacts...
        </div>
      ) : contacts.length === 0 ? (
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
          {contacts.map((c) => (
            <ContactCard key={c.id} contact={c} onDelete={handleDeleteContact} />
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
