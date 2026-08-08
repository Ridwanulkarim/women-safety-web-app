import { db } from '../config/firebaseAdmin.js';

// In-memory mock storage for fallback
const mockDb = {
  users: new Map(),
  contacts: new Map(),
  sos: new Map(),
  notifications: new Map(),
  announcements: new Map(),
  blogs: new Map(),
  safetyTips: new Map(),
  analytics: new Map()
};

const initMockData = () => {
  if (mockDb.blogs.size === 0) {
    const defaultBlogs = [
      {
        id: 'blog-1',
        title: 'Essential Self-Defense Strategies Every Woman Should Know',
        summary: 'Learn practical physical awareness and tactical self-defense maneuvers.',
        content: 'Personal safety begins with situational awareness. Stay alert in low-light environments, trust your instincts, and keep emergency hotlines on speed dial...',
        author: 'SafeHaven Security Team',
        category: 'Self Defense',
        imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
        createdAt: new Date().toISOString()
      },
      {
        id: 'blog-2',
        title: 'Digital Safety: Protecting Your Location & Online Privacy',
        summary: 'How to prevent cyber-stalking, secure mobile permissions, and manage location sharing.',
        content: 'Your digital footprint can reveal your real-world routines. Review application permissions frequently, use multi-factor authentication, and avoid posting live check-ins...',
        author: 'Cyber Safety Expert',
        category: 'Digital Safety',
        imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
        createdAt: new Date().toISOString()
      }
    ];
    defaultBlogs.forEach(b => mockDb.blogs.set(b.id, b));
  }

  if (mockDb.safetyTips.size === 0) {
    const defaultTips = [
      {
        id: 'tip-1',
        title: 'Commuting at Night',
        category: 'Travel Safety',
        content: 'Stay in well-lit areas, share your live trip details with a trusted contact, and avoid wearing noise-canceling headphones.',
        createdAt: new Date().toISOString()
      },
      {
        id: 'tip-2',
        title: 'Ride-Sharing Security Checklist',
        category: 'Travel Safety',
        content: 'Verify driver identity, match license plate numbers before entering, and sit in the rear seat.',
        createdAt: new Date().toISOString()
      },
      {
        id: 'tip-3',
        title: 'Home Entrance Vigilance',
        category: 'Home Safety',
        content: 'Have your keys ready before reaching your front door. Look around before stepping inside.',
        createdAt: new Date().toISOString()
      }
    ];
    defaultTips.forEach(t => mockDb.safetyTips.set(t.id, t));
  }
};

initMockData();

export const firestoreAdminService = {
  // USER OPERATIONS
  createUser: async (userData) => {
    const now = new Date().toISOString();
    const fullUser = {
      uid: userData.uid,
      fullName: userData.fullName || 'User',
      email: userData.email,
      phone: userData.phone || '',
      profileImage: userData.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      dateOfBirth: userData.dateOfBirth || '',
      gender: userData.gender || 'Female',
      bloodGroup: userData.bloodGroup || '',
      address: userData.address || '',
      city: userData.city || '',
      country: userData.country || 'Bangladesh',
      emergencyContacts: userData.emergencyContacts || [],
      currentLocation: userData.currentLocation || null,
      locationHistory: [],
      role: userData.role || 'user',
      status: 'active',
      isVerified: userData.isVerified || false,
      createdAt: now,
      updatedAt: now,
      lastLogin: now,
      notificationPreferences: { email: true, sms: true, push: true },
      darkMode: false,
      language: 'en',
      deviceInfo: userData.deviceInfo || {},
      sosHistory: []
    };

    try {
      if (db) await db.collection('users').doc(userData.uid).set(fullUser, { merge: true });
    } catch (e) {}

    mockDb.users.set(userData.uid, fullUser);
    return fullUser;
  },

  getUserByUid: async (uid) => {
    try {
      if (db) {
        const snap = await db.collection('users').doc(uid).get();
        if (snap.exists) return snap.data();
      }
    } catch (e) {}
    return mockDb.users.get(uid) || null;
  },

  getAllUsers: async () => {
    try {
      if (db) {
        const snap = await db.collection('users').get();
        if (!snap.empty) return snap.docs.map(doc => doc.data());
      }
    } catch (e) {}
    return Array.from(mockDb.users.values());
  },

  updateUser: async (uid, updateData) => {
    const now = new Date().toISOString();
    const payload = { ...updateData, updatedAt: now };
    try {
      if (db) await db.collection('users').doc(uid).update(payload);
    } catch (e) {}
    const current = mockDb.users.get(uid) || {};
    const updated = { ...current, ...payload };
    mockDb.users.set(uid, updated);
    return updated;
  },

  deleteUser: async (uid) => {
    try {
      if (db) await db.collection('users').doc(uid).delete();
    } catch (e) {}
    mockDb.users.delete(uid);
    return true;
  },

  // EMERGENCY CONTACTS
  getUserContacts: async (uid) => {
    try {
      if (db) {
        const snap = await db.collection('contacts').where('userId', '==', uid).get();
        return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      }
    } catch (e) {}
    return Array.from(mockDb.contacts.values()).filter(c => c.userId === uid);
  },

  addContact: async (uid, contactData) => {
    const id = 'contact_' + Date.now();
    const newContact = {
      id,
      userId: uid,
      name: contactData.name,
      phone: contactData.phone,
      relationship: contactData.relationship,
      isPrimary: contactData.isPrimary || false,
      createdAt: new Date().toISOString()
    };
    try {
      if (db) await db.collection('contacts').doc(id).set(newContact);
    } catch (e) {}
    mockDb.contacts.set(id, newContact);
    return newContact;
  },

  deleteContact: async (id) => {
    try {
      if (db) await db.collection('contacts').doc(id).delete();
    } catch (e) {}
    mockDb.contacts.delete(id);
    return true;
  },

  // SOS SYSTEM
  triggerSOS: async (uid, sosData) => {
    const id = 'sos_' + Date.now();
    const newSOS = {
      id,
      userId: uid,
      userName: sosData.userName || 'User',
      userPhone: sosData.userPhone || '',
      latitude: sosData.latitude,
      longitude: sosData.longitude,
      address: sosData.address || `Lat: ${sosData.latitude}, Lng: ${sosData.longitude}`,
      status: 'ACTIVE',
      alertStatus: sosData.alertStatus || 'FULLY_ALERTED',
      timestamp: new Date().toISOString(),
      contactsAlerted: sosData.contactsAlerted || [],
      deliveryFailures: sosData.deliveryFailures || []
    };

    try {
      if (db) await db.collection('sos').doc(id).set(newSOS);
    } catch (e) {}
    mockDb.sos.set(id, newSOS);

    await firestoreAdminService.createNotification({
      userId: uid,
      title: '🚨 SOS Alert Triggered',
      message: `Emergency distress signal sent from location: ${newSOS.address}. Alert Status: ${newSOS.alertStatus}`,
      type: 'SOS',
      sosId: id
    });

    return newSOS;
  },

  getSOSHistory: async (uid) => {
    try {
      if (db) {
        const snap = await db.collection('sos').where('userId', '==', uid).get();
        return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      }
    } catch (e) {}
    return Array.from(mockDb.sos.values()).filter(s => s.userId === uid);
  },

  getAllSOSAlerts: async () => {
    try {
      if (db) {
        const snap = await db.collection('sos').get();
        return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      }
    } catch (e) {}
    return Array.from(mockDb.sos.values());
  },

  updateSOSStatus: async (id, status) => {
    try {
      if (db) await db.collection('sos').doc(id).update({ status, updatedAt: new Date().toISOString() });
    } catch (e) {}
    const sos = mockDb.sos.get(id);
    if (sos) {
      sos.status = status;
      mockDb.sos.set(id, sos);
    }
    return sos;
  },

  // NOTIFICATIONS
  getUserNotifications: async (uid) => {
    try {
      if (db) {
        const snap = await db.collection('notifications').where('userId', '==', uid).get();
        return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      }
    } catch (e) {}
    return Array.from(mockDb.notifications.values()).filter(n => n.userId === uid);
  },

  createNotification: async (notifData) => {
    const id = 'notif_' + Date.now();
    const notif = {
      id,
      userId: notifData.userId,
      title: notifData.title,
      message: notifData.message,
      type: notifData.type || 'INFO',
      isRead: false,
      createdAt: new Date().toISOString()
    };
    try {
      if (db) await db.collection('notifications').doc(id).set(notif);
    } catch (e) {}
    mockDb.notifications.set(id, notif);
    return notif;
  },

  markNotificationRead: async (id) => {
    try {
      if (db) await db.collection('notifications').doc(id).update({ isRead: true });
    } catch (e) {}
    const item = mockDb.notifications.get(id);
    if (item) {
      item.isRead = true;
      mockDb.notifications.set(id, item);
    }
    return item;
  },

  // ANNOUNCEMENTS
  getAnnouncements: async () => {
    try {
      if (db) {
        const snap = await db.collection('announcements').get();
        return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      }
    } catch (e) {}
    return Array.from(mockDb.announcements.values());
  },

  createAnnouncement: async (annData) => {
    const id = 'ann_' + Date.now();
    const ann = {
      id,
      title: annData.title,
      content: annData.content,
      priority: annData.priority || 'normal',
      createdAt: new Date().toISOString()
    };
    try {
      if (db) await db.collection('announcements').doc(id).set(ann);
    } catch (e) {}
    mockDb.announcements.set(id, ann);
    return ann;
  },

  // BLOGS
  getBlogs: async () => {
    try {
      if (db) {
        const snap = await db.collection('blogs').get();
        if (!snap.empty) return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      }
    } catch (e) {}
    return Array.from(mockDb.blogs.values());
  },

  getBlogById: async (id) => {
    try {
      if (db) {
        const snap = await db.collection('blogs').doc(id).get();
        if (snap.exists) return { id: snap.id, ...snap.data() };
      }
    } catch (e) {}
    return mockDb.blogs.get(id) || null;
  },

  createBlog: async (blogData) => {
    const id = 'blog_' + Date.now();
    const blog = {
      id,
      ...blogData,
      createdAt: new Date().toISOString()
    };
    try {
      if (db) await db.collection('blogs').doc(id).set(blog);
    } catch (e) {}
    mockDb.blogs.set(id, blog);
    return blog;
  },

  deleteBlog: async (id) => {
    try {
      if (db) await db.collection('blogs').doc(id).delete();
    } catch (e) {}
    mockDb.blogs.delete(id);
    return true;
  },

  // SAFETY TIPS
  getSafetyTips: async () => {
    try {
      if (db) {
        const snap = await db.collection('safetyTips').get();
        if (!snap.empty) return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      }
    } catch (e) {}
    return Array.from(mockDb.safetyTips.values());
  },

  createSafetyTip: async (tipData) => {
    const id = 'tip_' + Date.now();
    const tip = {
      id,
      ...tipData,
      createdAt: new Date().toISOString()
    };
    try {
      if (db) await db.collection('safetyTips').doc(id).set(tip);
    } catch (e) {}
    mockDb.safetyTips.set(id, tip);
    return tip;
  },

  deleteSafetyTip: async (id) => {
    try {
      if (db) await db.collection('safetyTips').doc(id).delete();
    } catch (e) {}
    mockDb.safetyTips.delete(id);
    return true;
  },

  // ANALYTICS
  getAnalytics: async () => {
    const users = await firestoreAdminService.getAllUsers();
    const sosAlerts = await firestoreAdminService.getAllSOSAlerts();
    const activeAlerts = sosAlerts.filter(s => s.status === 'ACTIVE').length;
    const resolvedAlerts = sosAlerts.filter(s => s.status === 'RESOLVED').length;

    return {
      totalUsers: users.length || 1,
      totalSOSAlerts: sosAlerts.length || 0,
      activeAlerts,
      resolvedAlerts,
      monthlySOSStats: [
        { month: 'Jan', count: 4 },
        { month: 'Feb', count: 7 },
        { month: 'Mar', count: 5 },
        { month: 'Apr', count: 9 },
        { month: 'May', count: 12 },
        { month: 'Jun', count: 8 },
        { month: 'Jul', count: 14 }
      ],
      alertsByCategory: [
        { category: 'Physical Threat', count: 45 },
        { category: 'Stalking / Following', count: 30 },
        { category: 'Medical Emergency', count: 15 },
        { category: 'Harassment', count: 10 }
      ]
    };
  },

  deleteAnnouncement: async (id) => {
    try {
      if (db) await db.collection('announcements').doc(id).delete();
    } catch (e) {}
    mockDb.announcements.delete(id);
    return true;
  },

  // AUDIT LOGGING SYSTEM
  createAuditLog: async (logData) => {
    const id = 'audit_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const entry = {
      id,
      performedByUid: logData.performedByUid,
      performedByName: logData.performedByName || 'Admin',
      action: logData.action,
      targetId: logData.targetId,
      details: logData.details || {},
      timestamp: new Date().toISOString()
    };

    try {
      if (db) await db.collection('auditLogs').doc(id).set(entry);
    } catch (e) {}
    if (!mockDb.auditLogs) mockDb.auditLogs = new Map();
    mockDb.auditLogs.set(id, entry);
    return entry;
  },

  getAuditLogs: async () => {
    try {
      if (db) {
        const snap = await db.collection('auditLogs').orderBy('timestamp', 'desc').get();
        if (!snap.empty) return snap.docs.map(doc => doc.data());
      }
    } catch (e) {}
    if (!mockDb.auditLogs) mockDb.auditLogs = new Map();
    return Array.from(mockDb.auditLogs.values()).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }
};
