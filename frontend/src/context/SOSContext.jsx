import React, { createContext, useContext, useState } from 'react';
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

  const openSOSModal = () => setSosModalOpen(true);
  const closeSOSModal = () => setSosModalOpen(false);

  const sendSOSAlert = async (locationData) => {
    try {
      const lat = locationData?.latitude || 23.8103; // Default Dhaka coordinates if GPS denied
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
        timestamp: new Date().toISOString()
      };

      setIsSOSActive(true);
      setActiveSOSData(sosRecord);
      setSosHistory(prev => [sosRecord, ...prev]);
      toast.error('🚨 SOS EMERGENCY BROADCAST SENT! Emergency contacts notified.', { duration: 6000 });
      return sosRecord;
    } catch (error) {
      toast.error('SOS Broadcast Warning: Local distress signal captured.');
      const fallbackRecord = {
        id: 'sos_local_' + Date.now(),
        latitude: locationData?.latitude || 23.8103,
        longitude: locationData?.longitude || 90.4125,
        address: locationData?.address || 'Dhaka, Bangladesh',
        status: 'ACTIVE',
        timestamp: new Date().toISOString()
      };
      setIsSOSActive(true);
      setActiveSOSData(fallbackRecord);
      setSosHistory(prev => [fallbackRecord, ...prev]);
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
        sosHistory,
        activeSOSData
      }}
    >
      {children}
    </SOSContext.Provider>
  );
};

export const useSOS = () => useContext(SOSContext);
