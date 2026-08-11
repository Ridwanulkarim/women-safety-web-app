import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

const getInitialNotifications = (uid, email) => {
  return [
    {
      id: 'notif_sec_' + Date.now(),
      title: '🛡️ Security Alert: New Sign-In',
      message: `New sign-in detected for ${email || 'your account'} on ${new Date().toLocaleString()}. Shield protection is active.`,
      type: 'SECURITY',
      isRead: false,
      createdAt: new Date().toISOString()
    },
    {
      id: 'notif_welcome',
      title: 'Welcome to SafeHaven',
      message: 'Your personal safety shield is active. Add up to 5 emergency contacts in your dashboard.',
      type: 'INFO',
      isRead: false,
      createdAt: new Date().toISOString()
    }
  ];
};

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const storageKey = `safehaven_notifications_${user?.uid || user?.email || 'guest'}`;

  const [notifications, setNotifications] = useState(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return getInitialNotifications(user?.uid, user?.email);
  });

  const fetchNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      return;
    }

    let apiList = [];
    try {
      const res = await api.get('/notifications');
      if (Array.isArray(res.data?.data)) {
        apiList = res.data.data;
      }
    } catch (e) {}

    let localList = [];
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) localList = parsed;
      }
    } catch (e) {}

    // Merge API & Local notifications and deduplicate by ID
    const combined = [...apiList, ...localList];
    const uniqueMap = new Map();
    combined.forEach(n => {
      if (n && n.id) uniqueMap.set(n.id, n);
    });

    let finalNotifications = Array.from(uniqueMap.values());

    // Fallback: If 0 notifications exist, populate initial Welcome & Security Alert
    if (finalNotifications.length === 0) {
      finalNotifications = getInitialNotifications(user.uid, user.email);
    }

    setNotifications(finalNotifications);
    try {
      localStorage.setItem(storageKey, JSON.stringify(finalNotifications));
    } catch (e) {}
  }, [user, storageKey]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const addNotification = (notifItem) => {
    const newNotif = {
      id: 'notif_' + Date.now(),
      isRead: false,
      createdAt: new Date().toISOString(),
      ...notifItem
    };
    setNotifications(prev => {
      const currentList = Array.isArray(prev) ? prev : [];
      const updated = [newNotif, ...currentList];
      localStorage.setItem(storageKey, JSON.stringify(updated));
      return updated;
    });
  };

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
    } catch (e) {}
    setNotifications(prev => {
      const updated = (Array.isArray(prev) ? prev : []).map(n => n.id === id ? { ...n, isRead: true } : n);
      localStorage.setItem(storageKey, JSON.stringify(updated));
      return updated;
    });
  };

  const deleteNotification = (id) => {
    setNotifications(prev => {
      const updated = (Array.isArray(prev) ? prev : []).filter(n => n.id !== id);
      localStorage.setItem(storageKey, JSON.stringify(updated));
      return updated;
    });
  };

  const unreadCount = (Array.isArray(notifications) ? notifications : []).filter(n => !n?.isRead).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications: Array.isArray(notifications) ? notifications : [],
        unreadCount,
        markAsRead,
        deleteNotification,
        addNotification,
        refreshNotifications: fetchNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
