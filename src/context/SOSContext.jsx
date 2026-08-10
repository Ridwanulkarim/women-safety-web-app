import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

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

  // Sync saved contacts across LocalStorage and Backend API
  const fetchSavedContacts = useCallback(async () => {
    if (!user) {
      setSavedContacts([]);
      return;
    }
    setLoadingContacts(true);
    try {
      const res = await api.get('/contacts');
      if (Array.isArray(res.data?.data) && res.data.data.length > 0) {
        setSavedContacts(res.data.data);
        localStorage.setItem(storageKey, JSON.stringify(res.data.data));
      } else {
        // Fallback to local storage if API returns empty (e.g. serverless cold restart)
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setSavedContacts(parsed);
          }
        }
      }
    } catch (e) {
      // LocalStorage fallback on API error
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        try { setSavedContacts(JSON.parse(stored)); } catch (err) {}
      }
    } finally {
      setLoadingContacts(false);
    }
  }, [user, storageKey]);

  useEffect(() => {
    fetchSavedContacts();
  }, [fetchSavedContacts]);

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

    const newContact = {
      id: 'contact_' + Date.now(),
      ...contactData,
      createdAt: new Date().toISOString()
    };

    const updatedList = [...savedContacts, newContact];
    setSavedContacts(updatedList);
    localStorage.setItem(storageKey, JSON.stringify(updatedList));

    try {
      await api.post('/contacts', contactData);
    } catch (err) {
      console.warn('API sync fallback for contact save');
    }

    toast.success('Emergency contact saved successfully!');
    return true;
  };

  const deleteContact = async (contactId) => {
    const updatedList = savedContacts.filter(c => c.id !== contactId && c._id !== contactId);
    setSavedContacts(updatedList);
    localStorage.setItem(storageKey, JSON.stringify(updatedList));

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
    try {
      const lat = locationData?.latitude || 23.8103;
      const lng = locationData?.longitude || 90.4125;
      const addr = locationData?.address || `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;

      const payload = {
        latitude: lat,
        longitude: lng,
        address: addr,
        userName: user?.fullName || 'User',
        userPhone: user?.phone || ''
      };

      const res = await api.post('/sos', payload);
      const sosRecord = res.data?.data || {
        id: 'sos_' + Date.now(),
        latitude: lat,
        longitude: lng,
        address: addr,
        status: 'ACTIVE',
        contactsAlerted: savedContacts,
        timestamp: new Date().toISOString()
      };

      setIsSOSActive(true);
      setActiveSOSData(sosRecord);
      setSosHistory(prev => [sosRecord, ...(Array.isArray(prev) ? prev : [])]);

      const count = Array.isArray(sosRecord.contactsAlerted) ? sosRecord.contactsAlerted.length : savedContacts.length;
      if (count > 0) {
        toast.error(`🚨 SOS EMERGENCY BROADCAST SENT! ${count} saved emergency contact(s) notified.`, { duration: 6000 });
      } else {
        toast.error('🚨 SOS EMERGENCY BROADCAST SENT! (No emergency contacts saved yet).', { duration: 6000 });
      }

      return sosRecord;
    } catch (error) {
      toast.error('SOS Broadcast Warning: Local distress signal captured.');
      const fallbackRecord = {
        id: 'sos_local_' + Date.now(),
        latitude: locationData?.latitude || 23.8103,
        longitude: locationData?.longitude || 90.4125,
        address: locationData?.address || 'Dhaka, Bangladesh',
        status: 'ACTIVE',
        contactsAlerted: savedContacts,
        timestamp: new Date().toISOString()
      };
      setIsSOSActive(true);
      setActiveSOSData(fallbackRecord);
      setSosHistory(prev => [fallbackRecord, ...(Array.isArray(prev) ? prev : [])]);
      return fallbackRecord;
    }
  };

  const resolveSOS = async (sosId) => {
    try {
      if (sosId) await api.patch(`/sos/${sosId}/status`, { status: 'RESOLVED' });
    } catch (e) {}
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
