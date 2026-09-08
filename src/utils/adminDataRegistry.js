// src/utils/adminDataRegistry.js
import { collection, doc, getDocs, setDoc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';

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

// Fetch real users from Firebase Cloud Firestore and merge into local state
export const fetchFirestoreUsers = async () => {
  try {
    const snap = await getDocs(collection(db, 'users'));
    const firestoreUsers = [];
    snap.docs.forEach((d) => {
      const data = d.data();
      if (data && data.email) {
        firestoreUsers.push({
          uid: d.id,
          ...data
        });
      }
    });

    if (firestoreUsers.length > 0) {
      const local = getRegisteredUsers();
      // Merge by email / uid
      const map = new Map();
      local.forEach((u) => map.set(u.email.toLowerCase(), u));
      firestoreUsers.forEach((u) => map.set(u.email.toLowerCase(), { ...map.get(u.email.toLowerCase()), ...u }));

      const merged = sanitizeUsers(Array.from(map.values()));
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(merged));
      window.dispatchEvent(new CustomEvent('safehaven_users_updated', { detail: merged }));
      return merged;
    }
  } catch (err) {
    console.warn('Firestore fetch users notice:', err.message);
  }
  return getRegisteredUsers();
};

export const upsertRegisteredUser = async (userData) => {
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
      uid: userData.uid || (existingIndex >= 0 ? list[existingIndex].uid : 'usr_' + Date.now()),
      fullName: userData.fullName || email.split('@')[0],
      email: email,
      phone: userData.phone || 'Not Provided',
      role: userData.role || (email.includes('admin') ? 'admin' : 'user'),
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

    // Sync to Cloud Firestore in background so all devices/browsers see this user
    try {
      await setDoc(doc(db, 'users', userEntry.uid), userEntry, { merge: true });
    } catch (e) {
      console.warn('Firestore user cloud sync notice:', e.message);
    }

    return cleaned;
  } catch (e) {
    console.warn('Failed to upsert registered user:', e);
    return [];
  }
};

export const updateUserStatus = async (uid, status) => {
  try {
    const list = getRegisteredUsers();
    const updated = list.map((u) => (u.uid === uid ? { ...u, status } : u));
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('safehaven_users_updated', { detail: updated }));

    // Update in Firestore
    try {
      await updateDoc(doc(db, 'users', uid), { status, updatedAt: new Date().toISOString() });
    } catch (e) {
      console.warn('Firestore user status update notice:', e.message);
    }

    return updated;
  } catch (e) {
    console.warn('Failed to update user status:', e);
    return [];
  }
};

export const deleteUserFromRegistry = async (uid) => {
  try {
    const list = getRegisteredUsers();
    const updated = list.filter((u) => u.uid !== uid);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('safehaven_users_updated', { detail: updated }));

    // Delete in Firestore
    try {
      await deleteDoc(doc(db, 'users', uid));
    } catch (e) {
      console.warn('Firestore user delete notice:', e.message);
    }

    return updated;
  } catch (e) {
    console.warn('Failed to delete user from registry:', e);
    return [];
  }
};

// --- SOS Alert Management with Cloud Firestore ---
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

export const fetchFirestoreSOSAlerts = async () => {
  try {
    const snap = await getDocs(collection(db, 'sos'));
    const firestoreAlerts = [];
    snap.docs.forEach((d) => {
      const data = d.data();
      if (data) {
        firestoreAlerts.push({
          id: d.id,
          ...data
        });
      }
    });

    if (firestoreAlerts.length > 0) {
      const local = getGlobalSOSAlerts();
      const map = new Map();
      local.forEach((a) => map.set(a.id, a));
      firestoreAlerts.forEach((a) => map.set(a.id, { ...map.get(a.id), ...a }));

      const merged = sanitizeAlerts(Array.from(map.values()));
      localStorage.setItem(SOS_STORAGE_KEY, JSON.stringify(merged));
      window.dispatchEvent(new CustomEvent('safehaven_sos_updated', { detail: merged }));
      return merged;
    }
  } catch (err) {
    console.warn('Firestore fetch SOS notice:', err.message);
  }
  return getGlobalSOSAlerts();
};

export const saveGlobalSOSAlert = async (alertData) => {
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

    // Sync to Cloud Firestore
    try {
      await setDoc(doc(db, 'sos', alertEntry.id), alertEntry, { merge: true });
    } catch (e) {
      console.warn('Firestore SOS cloud sync notice:', e.message);
    }

    return cleaned;
  } catch (e) {
    console.warn('Failed to save global SOS alert:', e);
    return [];
  }
};

export const updateSOSAlertStatus = async (id, status) => {
  try {
    const list = getGlobalSOSAlerts();
    const updated = list.map((a) => (a.id === id ? { ...a, status } : a));
    localStorage.setItem(SOS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('safehaven_sos_updated', { detail: updated }));

    // Update in Firestore
    try {
      await updateDoc(doc(db, 'sos', id), { status, resolvedAt: new Date().toISOString() });
    } catch (e) {
      console.warn('Firestore SOS status update notice:', e.message);
    }

    return updated;
  } catch (e) {
    console.warn('Failed to update SOS alert status:', e);
    return [];
  }
};

export const deleteSOSAlert = async (id) => {
  try {
    const list = getGlobalSOSAlerts();
    const updated = list.filter((a) => a.id !== id);
    localStorage.setItem(SOS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('safehaven_sos_updated', { detail: updated }));

    // Delete in Firestore
    try {
      await deleteDoc(doc(db, 'sos', id));
    } catch (e) {
      console.warn('Firestore SOS delete notice:', e.message);
    }

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
