import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import admin from 'firebase-admin';
import nodemailer from 'nodemailer';
import { runSafeHavenLangGraphAgent, getAgentMetadata } from '../backend/src/services/langgraphAgentService.js';

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const JWT_SECRET = process.env.JWT_SECRET || 'safehaven_default_jwt_secret_key_2026';

// Initialize Firebase Admin SDK for Cloud Firestore persistence
let firestoreDb = null;
if (!admin.apps.length) {
  const projectId = process.env.FIREBASE_PROJECT_ID || 'women-safety-app-7c29e';
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (privateKey) {
    privateKey = privateKey.trim().replace(/^"/, '').replace(/"$/, '').replace(/\\n/g, '\n');
  }

  try {
    if (projectId && clientEmail && privateKey) {
      admin.initializeApp({
        credential: admin.credential.cert({ projectId, clientEmail, privateKey })
      });
      firestoreDb = admin.firestore();
    } else {
      admin.initializeApp({ projectId });
    }
  } catch (e) {
    console.warn('Firebase Admin Init Notice:', e.message);
  }
} else {
  try {
    if (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
      firestoreDb = admin.firestore();
    }
  } catch (e) {}
}

// In-Memory Fallback Cache (used seamlessly when Firestore Admin credentials are absent)
const dbData = {
  users: new Map(),
  contacts: new Map(),
  sos: new Map(),
  notifications: new Map(),
  blogs: new Map([
    ['blog-1', {
      id: 'blog-1',
      title: 'Essential Self-Defense Strategies Every Woman Should Know',
      title_bn: 'প্রত্যেক নারীর জন্য আবশ্যকীয় আত্মরক্ষা ও নিরাপত্তা কৌশল',
      summary: 'Learn practical physical awareness and tactical self-defense maneuvers.',
      summary_bn: 'পাবলিক প্লেসে সচেতনতা, শারীরিক কৌশল এবং তাৎক্ষণিক আত্মরক্ষার প্রয়োজনীয় নির্দেশিকা।',
      content: 'Personal safety begins with situational awareness. Stay alert in low-light environments, trust your instincts, and keep emergency hotlines on speed dial...',
      content_bn: 'ব্যক্তিগত নিরাপত্তা শুরু হয় পরিস্থিতি সম্পর্কে সচেতনতার মাধ্যমে। কম আলো বা নির্জন স্থানে সতর্ক থাকুন, নিজের অনুভূতির উপর আস্থা রাখুন এবং জরুরি হটলাইনগুলো প্রস্তুত রাখুন...',
      author: 'SafeHaven Security Team',
      author_bn: 'সেফহ্যাভেন নিরাপত্তা টিম',
      category: 'Self Defense',
      category_bn: 'আত্মরক্ষা',
      imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
      createdAt: new Date().toISOString()
    }],
    ['blog-2', {
      id: 'blog-2',
      title: 'Digital Safety: Protecting Your Location & Online Privacy',
      title_bn: 'ডিজিটাল নিরাপত্তা: লাইভ লোকেশন ও অনলাইন তথ্যের গোপনীয়তা রক্ষা',
      summary: 'How to prevent cyber-stalking, secure mobile permissions, and manage location sharing.',
      summary_bn: 'সাইবার স্টকিং রোধ, মোবাইল অ্যাপ পারমিশন নিয়ন্ত্রণ এবং রিয়েল-টাইম গোপনীয়তা সুরক্ষার উপায়।',
      content: 'Your digital footprint can reveal your real-world routines. Review application permissions frequently, use multi-factor authentication, and avoid posting live check-ins...',
      content_bn: 'আধুনিক ডিজিটাল যুগে মোবাইল তথ্যের গোপনীয়তা ব্যক্তিগত নিরাপত্তার একটি অবিচ্ছেদ্য অংশ। অধিকাংশ ক্ষেত্রে সামাজিক যোগাযোগ মাধ্যমে সরাসরি চেক-ইন বা মোবাইল অ্যাপের অনিয়ন্ত্রিত পারমিশন থেকে ট্র্যাকিংয়ের ঘটনা ঘটে...',
      author: 'Cyber Safety Expert',
      author_bn: 'সাইবার সুরক্ষা বিশেষজ্ঞ',
      category: 'Digital Safety',
      category_bn: 'ডিজিটাল নিরাপত্তা',
      imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
      createdAt: new Date().toISOString()
    }]
  ]),
  safetyTips: new Map([
    ['tip-1', {
      id: 'tip-1',
      title: 'Commuting at Night',
      title_bn: 'রাতের যাত্রা ও যাতায়াতের নিরাপত্তা',
      category: 'Travel Safety',
      category_bn: 'ভ্রমণ নিরাপত্তা',
      content: 'Stay in well-lit areas, share your live trip details with a trusted contact, and avoid wearing noise-canceling headphones.',
      content_bn: 'সবসময় আলোযুক্ত রাস্তায় চলুন, বিশ্বস্ত পরিচিতদের সাথে লাইভ ট্রিপ লোকেশন শেয়ার করুন এবং রাতে একা চলার সময় দুই কানে হেডফোন গুঁজে রাখবেন না।'
    }],
    ['tip-2', {
      id: 'tip-2',
      title: 'Ride-Sharing Security Checklist',
      title_bn: 'রাইডশেয়ারিং নিরাপত্তা চেকলিস্ট',
      category: 'Travel Safety',
      category_bn: 'ভ্রমণ নিরাপত্তা',
      content: 'Verify driver identity, match license plate numbers before entering, and sit in the rear seat.',
      content_bn: 'গাড়িতে ওঠার আগে চালকের ছবি ও গাড়ির নম্বর প্লেট অ্যাপের সাথে মিলিয়ে নিন এবং পেছনের সিটে বসুন।'
    }],
    ['tip-3', {
      id: 'tip-3',
      title: 'Home Entrance Vigilance',
      title_bn: 'বাসার প্রবেশদ্বারে সতর্কতা',
      category: 'Home Safety',
      category_bn: 'বাসার নিরাপত্তা',
      content: 'Have your keys ready before reaching your front door. Look around before stepping inside.',
      content_bn: 'দরজার সামনে আসার আগেই চাবি হাতে রাখুন। ভেতরে প্রবেশের আগে আশেপাশের পরিবেশ দেখে নিন এবং দ্রুত ছিটকিনি লাগিয়ে দিন।'
    }]
  ])
};

const generateToken = (payload) => jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

// Middleware: Authenticate Token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'Access token required' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: 'Invalid or expired token' });
  }
};

// Health Check
app.get(['/api/health', '/health'], (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'Women Safety Vercel API',
    database: firestoreDb ? 'Firebase Cloud Firestore (Admin SDK Connected)' : 'Firebase Cloud Firestore (Client SDK + Serverless Cache)',
    aiService: getAgentMetadata(),
    timestamp: new Date().toISOString()
  });
});

// AUTH ROUTES
app.post(['/api/auth/register', '/auth/register'], async (req, res) => {
  const { uid, email, fullName, phone, role } = req.body;
  const userId = uid || 'user_' + Date.now();
  const user = {
    uid: userId,
    email,
    fullName: fullName || (email ? email.split('@')[0] : 'User'),
    phone: phone || '',
    role: role || 'user',
    status: 'active',
    createdAt: new Date().toISOString()
  };
  dbData.users.set(userId, user);
  if (firestoreDb) {
    try { await firestoreDb.collection('users').doc(userId).set(user, { merge: true }); } catch (e) {}
  }
  const token = generateToken({ uid: user.uid, email: user.email, role: user.role, fullName: user.fullName });
  return res.status(201).json({ success: true, message: 'User registered successfully', data: { user, token } });
});

const dispatchLoginAlertEmail = async (email, fullName) => {
  if (!email) return;
  const time = new Date().toLocaleString('en-US', { timeZone: 'Asia/Dhaka' });
  const subject = `SafeHaven Security: New sign-in detected on your account (${email})`;
  const textContent = `SafeHaven Security Notification

Hello ${fullName || email.split('@')[0]},

Your account was successfully logged in to SafeHaven Women Safety Web Application.

• Account: ${email}
• Date & Time: ${time}
• Status: Authenticated

SafeHaven Women Emergency & Distress Network`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #09090b; color: #f4f4f5; margin: 0; padding: 20px; }
        .card { max-width: 520px; margin: 0 auto; background: #121215; border: 1px solid #27272a; border-radius: 16px; padding: 28px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .header { text-align: center; border-bottom: 1px solid #27272a; padding-bottom: 20px; margin-bottom: 20px; }
        .logo { font-size: 24px; font-weight: 900; color: #e11d48; letter-spacing: -0.5px; }
        .badge { display: inline-block; background: rgba(225, 29, 72, 0.15); color: #fb7185; border: 1px solid rgba(225, 29, 72, 0.3); font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 9999px; text-transform: uppercase; margin-top: 6px; }
        .info-box { background: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 16px; margin: 20px 0; }
        .info-row { display: flex; justify-content: space-between; font-size: 13px; padding: 6px 0; border-bottom: 1px solid #27272a; }
        .info-row:last-child { border-bottom: none; }
        .label { color: #a1a1aa; }
        .val { color: #ffffff; font-weight: 600; text-align: right; }
        .warning { font-size: 12px; color: #a1a1aa; line-height: 1.6; margin-top: 20px; border-top: 1px solid #27272a; padding-top: 16px; }
        .btn { display: block; text-align: center; background: #e11d48; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 700; padding: 12px 20px; border-radius: 10px; margin-top: 16px; }
        .footer { font-size: 11px; color: #71717a; text-align: center; margin-top: 24px; line-height: 1.5; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <div class="logo">SafeHaven</div>
          <span class="badge">Security Notice • New Sign-In</span>
        </div>
        <p style="font-size: 15px; margin: 0 0 12px 0;">Hello <strong>${fullName || email.split('@')[0]}</strong>,</p>
        <p style="font-size: 14px; color: #d4d4d8; line-height: 1.6; margin: 0;">
          This is an automated confirmation that your account was successfully logged in to the <strong>SafeHaven Women Safety Web Application</strong>.
        </p>
        <div class="info-box">
          <div class="info-row"><span class="label">Account Email:</span><span class="val">${email}</span></div>
          <div class="info-row"><span class="label">Date & Time:</span><span class="val">${time}</span></div>
          <div class="info-row"><span class="label">Status:</span><span class="val" style="color: #34d399;">Authenticated</span></div>
        </div>
        <div class="warning">
          <strong style="color: #f43f5e;">Was this you?</strong><br>
          If you recently signed in, you can safely ignore this notification.
        </div>
        <a href="https://women-safety-web-app.vercel.app/forgot-password" class="btn">Change / Reset Password</a>
        <div class="footer">SafeHaven Women Emergency & Distress Network • Dhaka, Bangladesh</div>
      </div>
    </body>
    </html>
  `;

  const emailUser = process.env.EMAIL_USER || process.env.SMTP_USER;
  const emailPass = process.env.EMAIL_PASS || process.env.SMTP_PASS;
  if (emailUser && emailPass) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: emailUser, pass: emailPass }
      });
      await transporter.sendMail({
        from: `"SafeHaven Security" <${emailUser}>`,
        replyTo: emailUser,
        to: email,
        subject,
        text: textContent,
        html: htmlContent
      });
      return;
    } catch (e) {
      console.warn('Gmail SMTP notice:', e.message);
    }
  }

  if (process.env.RESEND_API_KEY) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: process.env.ALERT_FROM_EMAIL || 'SafeHaven Security <onboarding@resend.dev>',
          to: [email],
          subject,
          html: htmlContent
        })
      });
    } catch (e) {
      console.warn('Resend dispatch notice:', e.message);
    }
  }
};

app.post(['/api/auth/login', '/auth/login'], async (req, res) => {
  const { email, uid, isSessionRestore } = req.body;
  const cleanEmail = email ? email.toLowerCase().trim() : '';
  let user = null;

  if (firestoreDb && uid) {
    try {
      const docSnap = await firestoreDb.collection('users').doc(uid).get();
      if (docSnap.exists) user = { uid: docSnap.id, ...docSnap.data() };
    } catch (e) {}
  }

  if (!user && uid) user = dbData.users.get(uid);
  if (!user) user = Array.from(dbData.users.values()).find(u => u.email === cleanEmail);

  const isAdmin = cleanEmail === 'ridwanulk08@gmail.com' || cleanEmail.startsWith('admin@') || cleanEmail.includes('admin');
  if (!user) {
    user = {
      uid: uid || 'user_' + Date.now(),
      email: cleanEmail,
      fullName: cleanEmail.split('@')[0],
      role: isAdmin ? 'admin' : 'user',
      status: 'active',
      createdAt: new Date().toISOString()
    };
  }
  user.lastLogin = new Date().toISOString();
  dbData.users.set(user.uid, user);
  if (firestoreDb) {
    try { await firestoreDb.collection('users').doc(user.uid).set(user, { merge: true }); } catch (e) {}
  }

  if (!isSessionRestore) {
    try { await dispatchLoginAlertEmail(user.email, user.fullName); } catch (err) {}
  }

  const token = generateToken({ uid: user.uid, email: user.email, role: user.role, fullName: user.fullName });
  return res.status(200).json({ success: true, message: 'Login successful', data: { user, token } });
});

// USER ROUTES
app.get(['/api/users', '/users'], async (req, res) => {
  if (firestoreDb) {
    try {
      const snap = await firestoreDb.collection('users').get();
      if (!snap.empty) {
        return res.status(200).json({ success: true, data: snap.docs.map(d => ({ uid: d.id, ...d.data() })) });
      }
    } catch (e) {}
  }
  return res.status(200).json({ success: true, data: Array.from(dbData.users.values()) });
});

app.get(['/api/users/me', '/users/me'], authenticateToken, async (req, res) => {
  if (firestoreDb) {
    try {
      const snap = await firestoreDb.collection('users').doc(req.user.uid).get();
      if (snap.exists) return res.status(200).json({ success: true, data: { uid: snap.id, ...snap.data() } });
    } catch (e) {}
  }
  const user = dbData.users.get(req.user.uid) || { uid: req.user.uid, email: req.user.email, fullName: req.user.fullName, role: req.user.role };
  return res.status(200).json({ success: true, data: user });
});

app.put(['/api/users/profile', '/users/profile'], authenticateToken, async (req, res) => {
  const { role, status, ...safeUpdates } = req.body || {};
  const updated = { uid: req.user.uid, ...safeUpdates, updatedAt: new Date().toISOString() };
  dbData.users.set(req.user.uid, { ...(dbData.users.get(req.user.uid) || {}), ...updated });
  if (firestoreDb) {
    try { await firestoreDb.collection('users').doc(req.user.uid).set(updated, { merge: true }); } catch (e) {}
  }
  return res.status(200).json({ success: true, message: 'Profile updated in Firestore', data: updated });
});

// CONTACTS ROUTES (Firestore-backed)
app.get(['/api/contacts', '/contacts'], authenticateToken, async (req, res) => {
  if (firestoreDb) {
    try {
      const snap = await firestoreDb.collection('contacts').where('userId', '==', req.user.uid).get();
      if (!snap.empty) {
        return res.status(200).json({ success: true, data: snap.docs.map(d => ({ id: d.id, ...d.data() })) });
      }
    } catch (e) {}
  }
  const contacts = Array.from(dbData.contacts.values()).filter(c => c.userId === req.user.uid);
  return res.status(200).json({ success: true, data: contacts });
});

app.post(['/api/contacts', '/contacts'], authenticateToken, async (req, res) => {
  const { id: providedId, name, phone, email, relationship, isPrimary } = req.body;
  const id = providedId || 'contact_' + Date.now();
  const contact = {
    id,
    userId: req.user.uid,
    name,
    phone,
    email: email || '',
    relationship: relationship || 'Emergency Contact',
    isPrimary: !!isPrimary,
    createdAt: new Date().toISOString()
  };
  dbData.contacts.set(id, contact);
  if (firestoreDb) {
    try { await firestoreDb.collection('contacts').doc(id).set(contact, { merge: true }); } catch (e) {}
  }
  return res.status(201).json({ success: true, message: 'Contact saved to Cloud Firestore', data: contact });
});

app.delete(['/api/contacts/:id', '/contacts/:id'], authenticateToken, async (req, res) => {
  dbData.contacts.delete(req.params.id);
  if (firestoreDb) {
    try { await firestoreDb.collection('contacts').doc(req.params.id).delete(); } catch (e) {}
  }
  return res.status(200).json({ success: true, message: 'Contact deleted' });
});

// SOS ROUTES (Firestore-backed — supports both /api/sos and /api/sos/trigger)
const handleCreateSOS = async (req, res) => {
  const { latitude, longitude, address, userName, userPhone, userEmail, contactsAlerted } = req.body;
  const id = 'sos_' + Date.now();
  const sos = {
    id,
    userId: req.user.uid,
    userName: userName || req.user.fullName || 'User',
    userPhone: userPhone || '',
    userEmail: userEmail || req.user.email || '',
    latitude: latitude || 23.8103,
    longitude: longitude || 90.4125,
    address: address || `Lat: ${latitude}, Lng: ${longitude}`,
    status: 'ACTIVE',
    timestamp: new Date().toISOString(),
    contactsAlerted: contactsAlerted || []
  };
  dbData.sos.set(id, sos);
  if (firestoreDb) {
    try { await firestoreDb.collection('sos').doc(id).set(sos, { merge: true }); } catch (e) {}
  }
  return res.status(201).json({ success: true, message: 'SOS alert saved to Cloud Firestore', data: sos });
};

app.post(['/api/sos', '/sos', '/api/sos/trigger', '/sos/trigger'], authenticateToken, handleCreateSOS);

app.patch(['/api/sos/:id/status', '/sos/:id/status'], authenticateToken, async (req, res) => {
  const { status } = req.body;
  const id = req.params.id;
  const updates = { status: status || 'RESOLVED', resolvedAt: new Date().toISOString() };
  if (dbData.sos.has(id)) {
    dbData.sos.set(id, { ...dbData.sos.get(id), ...updates });
  }
  if (firestoreDb) {
    try { await firestoreDb.collection('sos').doc(id).set(updates, { merge: true }); } catch (e) {}
  }
  return res.status(200).json({ success: true, message: 'SOS status updated', data: { id, ...updates } });
});

app.get(['/api/sos/history', '/sos/history'], authenticateToken, async (req, res) => {
  if (firestoreDb) {
    try {
      const snap = await firestoreDb.collection('sos').where('userId', '==', req.user.uid).get();
      if (!snap.empty) {
        return res.status(200).json({ success: true, data: snap.docs.map(d => ({ id: d.id, ...d.data() })) });
      }
    } catch (e) {}
  }
  const history = Array.from(dbData.sos.values()).filter(s => s.userId === req.user.uid);
  return res.status(200).json({ success: true, data: history });
});

// LANGCHAIN + LANGGRAPH AI AGENT ROUTES
app.get(['/api/ai/status', '/ai/status'], (req, res) => {
  return res.status(200).json({ success: true, data: getAgentMetadata() });
});

app.post(['/api/ai/chat', '/ai/chat'], async (req, res) => {
  try {
    const { query, mode = 'SOS_REPORTS', language = 'en', clientAlerts = [], clientUsers = [] } = req.body || {};
    if (!query || !String(query).trim()) {
      return res.status(400).json({ success: false, message: 'Query text is required.' });
    }

    let dbAlerts = Array.from(dbData.sos.values());
    let dbUsers = Array.from(dbData.users.values());

    if (firestoreDb) {
      try {
        const [sosSnap, userSnap] = await Promise.all([
          firestoreDb.collection('sos').get(),
          firestoreDb.collection('users').get()
        ]);
        if (!sosSnap.empty) dbAlerts = sosSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        if (!userSnap.empty) dbUsers = userSnap.docs.map(d => ({ uid: d.id, ...d.data() }));
      } catch (e) {}
    }

    const alertMap = new Map();
    (Array.isArray(clientAlerts) ? clientAlerts : []).forEach(a => a?.id && alertMap.set(a.id, a));
    dbAlerts.forEach(a => a?.id && alertMap.set(a.id, { ...(alertMap.get(a.id) || {}), ...a }));

    const userMap = new Map();
    (Array.isArray(clientUsers) ? clientUsers : []).forEach(u => u?.uid && userMap.set(u.uid, u));
    dbUsers.forEach(u => u?.uid && userMap.set(u.uid, { ...(userMap.get(u.uid) || {}), ...u }));

    const mergedAlerts = Array.from(alertMap.values()).sort(
      (a, b) => new Date(b.timestamp || b.createdAt || 0) - new Date(a.timestamp || a.createdAt || 0)
    );
    const mergedUsers = Array.from(userMap.values());

    const result = await runSafeHavenLangGraphAgent({
      query: String(query).trim(),
      mode,
      language,
      alerts: mergedAlerts,
      users: mergedUsers
    });

    return res.status(200).json({ success: true, message: 'LangGraph AI agent executed', data: result });
  } catch (err) {
    console.error('LangGraph AI endpoint error:', err);
    return res.status(500).json({ success: false, message: 'AI Agent execution error', error: err.message });
  }
});

// PUBLIC DATA ROUTES
app.get(['/api/blogs', '/blogs'], (req, res) => {
  return res.status(200).json({ success: true, data: Array.from(dbData.blogs.values()) });
});

app.get(['/api/safety-tips', '/safety-tips'], (req, res) => {
  return res.status(200).json({ success: true, data: Array.from(dbData.safetyTips.values()) });
});

app.get(['/api/notifications', '/notifications'], (req, res) => {
  return res.status(200).json({ success: true, data: [] });
});

// Catch-all
app.use('*', (req, res) => {
  res.status(200).json({ status: 'online', service: 'SafeHaven API (Firestore + LangGraph)' });
});

export default app;
