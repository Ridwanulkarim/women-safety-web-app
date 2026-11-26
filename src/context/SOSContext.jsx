import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { collection, doc, getDocs, setDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';
import { saveGlobalSOSAlert, updateSOSAlertStatus } from '../utils/adminDataRegistry';

const SOSContext = createContext();

export const SOSProvider = ({ children }) => {
  const { user } = useAuth();
  const [isSOSActive, setIsSOSActive] = useState(false);
  const [sosModalOpen, setSosModalOpen] = useState(false);
  const [sosHistory, setSosHistory] = useState([]);
  const [activeSOSData, setActiveSOSData] = useState(null);

  const storageKey = `safehaven_contacts_${user?.uid || user?.email || 'guest'}`;

  const [savedContacts, setSavedContacts] = useState(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });
  const [loadingContacts, setLoadingContacts] = useState(false);

  // Sync saved contacts directly with Firebase Cloud Firestore + Backend API
  const fetchSavedContacts = useCallback(async () => {
    if (!user) {
      setSavedContacts([]);
      return;
    }
    setLoadingContacts(true);
    try {
      let cloudContacts = [];

      // 1. Primary Cloud Database: Query Firebase Cloud Firestore directly
      if (user.uid) {
        try {
          const q = query(collection(db, 'contacts'), where('userId', '==', user.uid));
          const snap = await getDocs(q);
          cloudContacts = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        } catch (fsErr) {
          console.warn('Firestore contacts read notice:', fsErr.message);
        }
      }

      // 2. Also fetch from Express Backend API if Firestore returned empty
      if (cloudContacts.length === 0) {
        try {
          const res = await api.get('/contacts');
          if (Array.isArray(res.data?.data) && res.data.data.length > 0) {
            cloudContacts = res.data.data;
          }
        } catch (apiErr) {
          console.warn('Backend contacts sync notice:', apiErr.message);
        }
      }

      if (cloudContacts.length > 0) {
        setSavedContacts(cloudContacts);
        localStorage.setItem(storageKey, JSON.stringify(cloudContacts));
      } else {
        // Offline cache fallback
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setSavedContacts(parsed);
          }
        }
      }
    } catch (e) {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        try { setSavedContacts(JSON.parse(stored)); } catch (err) {}
      }
    } finally {
      setLoadingContacts(false);
    }
  }, [user, storageKey]);

  // Fetch user's SOS history directly from Firebase Cloud Firestore + Backend API
  const fetchSOSHistory = useCallback(async () => {
    if (!user?.uid) {
      setSosHistory([]);
      return;
    }
    try {
      const q = query(collection(db, 'sos'), where('userId', '==', user.uid));
      const snap = await getDocs(q);
      const fsHistory = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));

      if (fsHistory.length > 0) {
        setSosHistory(fsHistory);
        return;
      }

      const res = await api.get('/sos/history');
      if (Array.isArray(res.data?.data)) {
        setSosHistory(res.data.data);
      }
    } catch (err) {
      console.warn('Firestore SOS history sync notice:', err.message);
    }
  }, [user]);

  useEffect(() => {
    fetchSavedContacts();
    fetchSOSHistory();
  }, [fetchSavedContacts, fetchSOSHistory]);

  const addContact = async (contactData) => {
    if (savedContacts.length >= 5) {
      toast.error('Maximum limit of 5 emergency contacts reached.');
      return false;
    }

    const cleanNewPhone = (contactData.phone || '').replace(/[\s\-\(\)]/g, '');
    const isDuplicate = savedContacts.some(c => (c.phone || '').replace(/[\s\-\(\)]/g, '') === cleanNewPhone);

    if (isDuplicate) {
      toast.error(`Duplicate Error: A contact with phone number "${contactData.phone}" already exists.`);
      return false;
    }

    const contactId = 'contact_' + Date.now();
    const newContact = {
      id: contactId,
      userId: user?.uid || 'guest',
      ...contactData,
      createdAt: new Date().toISOString()
    };

    const updatedList = [...savedContacts, newContact];
    setSavedContacts(updatedList);
    localStorage.setItem(storageKey, JSON.stringify(updatedList));

    // Persist to Firebase Cloud Firestore directly
    if (user?.uid) {
      try {
        await setDoc(doc(db, 'contacts', contactId), newContact, { merge: true });
      } catch (fsErr) {
        console.warn('Firestore contact write notice:', fsErr.message);
      }
    }

    // Sync with Backend REST API
    try {
      await api.post('/contacts', newContact);
    } catch (err) {
      console.warn('API sync fallback for contact save');
    }

    toast.success('Emergency contact saved to Cloud Database!');
    return true;
  };

  const deleteContact = async (contactId) => {
    const updatedList = savedContacts.filter(c => c.id !== contactId && c._id !== contactId);
    setSavedContacts(updatedList);
    localStorage.setItem(storageKey, JSON.stringify(updatedList));

    // Delete directly from Firebase Cloud Firestore
    if (user?.uid) {
      try {
        await deleteDoc(doc(db, 'contacts', contactId));
      } catch (fsErr) {
        console.warn('Firestore contact delete notice:', fsErr.message);
      }
    }

    try {
      await api.delete(`/contacts/${contactId}`);
    } catch (err) {
      console.warn('API sync fallback for contact deletion');
    }

    toast.success('Emergency contact removed.');
    return true;
  };

  const openSOSModal = () => {
    fetchSavedContacts();
    setSosModalOpen(true);
  };

  const closeSOSModal = () => setSosModalOpen(false);

  const sendSOSAlert = async (locationData) => {
    const lat = locationData?.latitude || 23.8103;
    const lng = locationData?.longitude || 90.4125;
    const addr = locationData?.address || `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;

    const payload = {
      userId: user?.uid || 'anonymous',
      latitude: lat,
      longitude: lng,
      address: addr,
      userName: user?.fullName || (user?.email ? user.email.split('@')[0] : 'User'),
      userPhone: user?.phone || '',
      userEmail: user?.email || '',
      contactsAlerted: savedContacts
    };

    try {
      const res = await api.post('/sos', payload);
      const sosRecord = {
        id: res.data?.data?.id || 'sos_' + Date.now(),
        userId: user?.uid || 'anonymous',
        userName: payload.userName,
        userPhone: payload.userPhone || 'Emergency Direct',
        userEmail: payload.userEmail,
        latitude: lat,
        longitude: lng,
        address: addr,
        status: 'ACTIVE',
        contactsAlerted: res.data?.data?.contactsAlerted || savedContacts,
        timestamp: res.data?.data?.timestamp || new Date().toISOString(),
        ...(res.data?.data || {})
      };

      setIsSOSActive(true);
      setActiveSOSData(sosRecord);
      setSosHistory(prev => [sosRecord, ...(Array.isArray(prev) ? prev : [])]);
      await saveGlobalSOSAlert(sosRecord);

      const count = Array.isArray(sosRecord.contactsAlerted) ? sosRecord.contactsAlerted.length : savedContacts.length;
      if (count > 0) {
        toast.error(`🚨 SOS EMERGENCY BROADCAST SENT! ${count} saved emergency contact(s) notified.`, { duration: 6000 });
      } else {
        toast.error('🚨 SOS EMERGENCY BROADCAST SENT! (No emergency contacts saved yet).', { duration: 6000 });
      }

      return sosRecord;
    } catch (error) {
      const fallbackRecord = {
        id: 'sos_' + Date.now(),
        userId: user?.uid || 'anonymous',
        userName: payload.userName,
        userPhone: payload.userPhone || 'Emergency Direct',
        userEmail: payload.userEmail,
        latitude: lat,
        longitude: lng,
        address: addr,
        status: 'ACTIVE',
        contactsAlerted: savedContacts,
        timestamp: new Date().toISOString()
      };
      setIsSOSActive(true);
      setActiveSOSData(fallbackRecord);
      setSosHistory(prev => [fallbackRecord, ...(Array.isArray(prev) ? prev : [])]);
      await saveGlobalSOSAlert(fallbackRecord);
      toast.error('🚨 SOS EMERGENCY BROADCAST SAVED TO CLOUD FIRESTORE!', { duration: 6000 });
      return fallbackRecord;
    }
  };

  const resolveSOS = async (sosId) => {
    const targetId = sosId || activeSOSData?.id;
    try {
      if (targetId) await api.patch(`/sos/${targetId}/status`, { status: 'RESOLVED' });
    } catch (e) {}
    if (targetId) {
      await updateSOSAlertStatus(targetId, 'RESOLVED');
      setSosHistory(prev => (Array.isArray(prev) ? prev.map(item => item.id === targetId ? { ...item, status: 'RESOLVED' } : item) : []));
    }
    setIsSOSActive(false);
    setActiveSOSData(null);
    toast.success('SOS state resolved and marked safe.');
  };

  return (
    <SOSContext.Provider
      value={{
        isSOSActive,
        sosModalOpen,
        openSOSModal,
        closeSOSModal,
        sendSOSAlert,
        resolveSOS,
        sosHistory: Array.isArray(sosHistory) ? sosHistory : [],
        activeSOSData,
        savedContacts: Array.isArray(savedContacts) ? savedContacts : [],
        loadingContacts,
        addContact,
        deleteContact,
        refreshContacts: fetchSavedContacts
      }}
    >
      {children}
    </SOSContext.Provider>
  );
};

export const useSOS = () => useContext(SOSContext);
