// src/utils/adminDataRegistry.js

const USERS_STORAGE_KEY = 'safehaven_registered_users';
const SOS_STORAGE_KEY = 'safehaven_global_sos_alerts';
const ANNOUNCEMENTS_STORAGE_KEY = 'safehaven_admin_announcements';

// Filter out any obsolete dummy/demo accounts
export const sanitizeUsers = (list) => {
  if (!Array.isArray(list)) return [];
  return list.filter((u) => {
    if (!u || !u.email) return false;
    const email = u.email.toLowerCase().trim();
    const name = (u.fullName || '').toLowerCase().trim();
    if (email.includes('example.com')) return false;
    if (name === 'sarah connor' || name === 'emily rose') return false;
    if (email === 'admin@safehaven.org' && name === 'admin manager') return false;
    return true;
  });
};

export const sanitizeAlerts = (list) => {
  if (!Array.isArray(list)) return [];
  return list.filter((a) => {
    if (!a) return false;
    if (a.id === 'sos_101' || a.id === 'sos_102') return false;
    const name = (a.userName || '').toLowerCase().trim();
    if (name === 'sarah connor' || name === 'emily rose') return false;
    return true;
  });
};

export const getRegisteredUsers = () => {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    const cleaned = sanitizeUsers(parsed);
    if (cleaned.length !== parsed.length) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(cleaned));
    }
    return cleaned;
  } catch (e) {
    return [];
  }
};

export const upsertRegisteredUser = (userData) => {
  if (!userData || !userData.email) return [];
  try {
    const list = getRegisteredUsers();
    const email = userData.email.toLowerCase().trim();
    const existingIndex = list.findIndex(
      (u) =>
        (u.email && u.email.toLowerCase().trim() === email) ||
        (userData.uid && u.uid === userData.uid)
    );

    const userEntry = {
      uid: userData.uid || 'usr_' + Date.now(),
      fullName: userData.fullName || email.split('@')[0],
      email: email,
      phone: userData.phone || 'Not Provided',
      role: userData.role || 'user',
      status: userData.status || 'active',
      profileImage: userData.profileImage || '',
      createdAt:
        userData.createdAt ||
        (existingIndex >= 0 ? list[existingIndex].createdAt : new Date().toISOString()),
      lastLogin: new Date().toISOString()
    };

    let updatedList;
    if (existingIndex >= 0) {
      updatedList = [...list];
      updatedList[existingIndex] = {
        ...list[existingIndex],
        ...userEntry,
        createdAt: list[existingIndex].createdAt || userEntry.createdAt
      };
    } else {
      updatedList = [userEntry, ...list];
    }

    const cleaned = sanitizeUsers(updatedList);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(cleaned));
    window.dispatchEvent(new CustomEvent('safehaven_users_updated', { detail: cleaned }));
    return cleaned;
  } catch (e) {
    console.warn('Failed to upsert registered user:', e);
    return [];
  }
};

export const updateUserStatus = (uid, status) => {
  try {
    const list = getRegisteredUsers();
    const updated = list.map((u) => (u.uid === uid ? { ...u, status } : u));
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('safehaven_users_updated', { detail: updated }));
    return updated;
  } catch (e) {
    console.warn('Failed to update user status:', e);
    return [];
  }
};

export const deleteUserFromRegistry = (uid) => {
  try {
    const list = getRegisteredUsers();
    const updated = list.filter((u) => u.uid !== uid);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('safehaven_users_updated', { detail: updated }));
    return updated;
  } catch (e) {
    console.warn('Failed to delete user from registry:', e);
    return [];
  }
};

// --- SOS Alert Management ---
export const getGlobalSOSAlerts = () => {
  try {
    const raw = localStorage.getItem(SOS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    const cleaned = sanitizeAlerts(parsed);
    if (cleaned.length !== parsed.length) {
      localStorage.setItem(SOS_STORAGE_KEY, JSON.stringify(cleaned));
    }
    return cleaned;
  } catch (e) {
    return [];
  }
};

export const saveGlobalSOSAlert = (alertData) => {
  if (!alertData) return [];
  try {
    const list = getGlobalSOSAlerts();
    const alertEntry = {
      id: alertData.id || 'sos_' + Date.now(),
      userName: alertData.userName || 'Anonymous User',
      userPhone: alertData.userPhone || 'Emergency Direct',
      userEmail: alertData.userEmail || '',
      latitude: alertData.latitude || 23.8103,
      longitude: alertData.longitude || 90.4125,
      address: alertData.address || 'Dhaka, Bangladesh',
      status: alertData.status || 'ACTIVE',
      contactsAlerted: alertData.contactsAlerted || [],
      timestamp: alertData.timestamp || new Date().toISOString()
    };

    const updated = [alertEntry, ...list.filter((a) => a.id !== alertEntry.id)];
    const cleaned = sanitizeAlerts(updated);
    localStorage.setItem(SOS_STORAGE_KEY, JSON.stringify(cleaned));
    window.dispatchEvent(new CustomEvent('safehaven_sos_updated', { detail: cleaned }));
    return cleaned;
  } catch (e) {
    console.warn('Failed to save global SOS alert:', e);
    return [];
  }
};

export const updateSOSAlertStatus = (id, status) => {
  try {
    const list = getGlobalSOSAlerts();
    const updated = list.map((a) => (a.id === id ? { ...a, status } : a));
    localStorage.setItem(SOS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('safehaven_sos_updated', { detail: updated }));
    return updated;
  } catch (e) {
    console.warn('Failed to update SOS alert status:', e);
    return [];
  }
};

export const deleteSOSAlert = (id) => {
  try {
    const list = getGlobalSOSAlerts();
    const updated = list.filter((a) => a.id !== id);
    localStorage.setItem(SOS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('safehaven_sos_updated', { detail: updated }));
    return updated;
  } catch (e) {
    console.warn('Failed to delete SOS alert:', e);
    return [];
  }
};

// --- Announcements Management ---
export const getAdminAnnouncements = () => {
  try {
    const raw = localStorage.getItem(ANNOUNCEMENTS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const saveAdminAnnouncement = (announcement) => {
  try {
    const list = getAdminAnnouncements();
    const newAnn = {
      id: announcement.id || 'ann_' + Date.now(),
      title: announcement.title,
      content: announcement.content,
      priority: announcement.priority || 'normal',
      createdAt: announcement.createdAt || new Date().toISOString()
    };
    const updated = [newAnn, ...list];
    localStorage.setItem(ANNOUNCEMENTS_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.warn('Failed to save announcement:', e);
    return [];
  }
};

export const deleteAdminAnnouncement = (id) => {
  try {
    const list = getAdminAnnouncements();
    const updated = list.filter((a) => a.id !== id);
    localStorage.setItem(ANNOUNCEMENTS_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.warn('Failed to delete announcement:', e);
    return [];
  }
};
