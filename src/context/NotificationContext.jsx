import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const storageKey = `safehaven_notifications_${user?.uid || user?.email || 'guest'}`;

  const [notifications, setNotifications] = useState(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return [
      {
        id: 'notif_welcome',
        title: 'Welcome to SafeHaven',
        message: 'Your personal safety shield is active. Add up to 5 emergency contacts in your dashboard.',
        type: 'INFO',
        isRead: false,
        createdAt: new Date().toISOString()
      }
    ];
  });

  const fetchNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      return;
    }
    try {
      const res = await api.get('/notifications');
      if (Array.isArray(res.data?.data) && res.data.data.length > 0) {
        setNotifications(res.data.data);
        localStorage.setItem(storageKey, JSON.stringify(res.data.data));
      } else {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          try {
            setNotifications(JSON.parse(stored));
          } catch (err) {}
        }
      }
    } catch (error) {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        try { setNotifications(JSON.parse(stored)); } catch (err) {}
      }
    }
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
