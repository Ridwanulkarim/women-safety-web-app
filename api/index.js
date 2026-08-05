import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import admin from 'firebase-admin';

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const JWT_SECRET = process.env.JWT_SECRET || 'safehaven_default_jwt_secret_key_2026';

// Initialize Firebase Admin if credentials present
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
    } else {
      admin.initializeApp({ projectId });
    }
  } catch (e) {
    console.warn('Firebase Admin Init Notice:', e.message);
  }
}

// In-Memory Mock Database
const dbData = {
  users: new Map(),
  contacts: new Map(),
  sos: new Map(),
  notifications: new Map(),
  blogs: new Map([
    ['blog-1', {
      id: 'blog-1',
      title: 'Essential Self-Defense Strategies Every Woman Should Know',
      summary: 'Learn practical physical awareness and tactical self-defense maneuvers.',
      content: 'Personal safety begins with situational awareness. Stay alert in low-light environments, trust your instincts, and keep emergency hotlines on speed dial...',
      author: 'SafeHaven Security Team',
      category: 'Self Defense',
      imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
      createdAt: new Date().toISOString()
    }],
    ['blog-2', {
      id: 'blog-2',
      title: 'Digital Safety: Protecting Your Location & Online Privacy',
      summary: 'How to prevent cyber-stalking, secure mobile permissions, and manage location sharing.',
      content: 'Your digital footprint can reveal your real-world routines. Review application permissions frequently, use multi-factor authentication, and avoid posting live check-ins...',
      author: 'Cyber Safety Expert',
      category: 'Digital Safety',
      imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
      createdAt: new Date().toISOString()
    }]
  ]),
  safetyTips: new Map([
    ['tip-1', { id: 'tip-1', title: 'Commuting at Night', category: 'Travel Safety', content: 'Stay in well-lit areas, share your live trip details with a trusted contact, and avoid wearing noise-canceling headphones.' }],
    ['tip-2', { id: 'tip-2', title: 'Ride-Sharing Security Checklist', category: 'Travel Safety', content: 'Verify driver identity, match license plate numbers before entering, and sit in the rear seat.' }],
    ['tip-3', { id: 'tip-3', title: 'Home Entrance Vigilance', category: 'Home Safety', content: 'Have your keys ready before reaching your front door. Look around before stepping inside.' }]
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
  res.status(200).json({ status: 'online', service: 'Women Safety Vercel API', timestamp: new Date().toISOString() });
});

// AUTH ROUTES
app.post(['/api/auth/register', '/auth/register'], (req, res) => {
  const { uid, email, fullName, phone, role } = req.body;
  const userId = uid || 'user_' + Date.now();
  const user = {
    uid: userId,
    email,
    fullName: fullName || email.split('@')[0],
    phone: phone || '',
    role: role || 'user',
    createdAt: new Date().toISOString()
  };
  dbData.users.set(userId, user);
  const token = generateToken({ uid: user.uid, email: user.email, role: user.role, fullName: user.fullName });
  return res.status(201).json({ success: true, message: 'User registered successfully', data: { user, token } });
});

app.post(['/api/auth/login', '/auth/login'], (req, res) => {
  const { email, uid } = req.body;
  let user = uid ? dbData.users.get(uid) : null;
  if (!user) {
    user = Array.from(dbData.users.values()).find(u => u.email === email);
  }
  if (!user) {
    user = {
      uid: uid || 'user_' + Date.now(),
      email,
      fullName: email.split('@')[0],
      role: email && email.includes('admin') ? 'admin' : 'user',
      createdAt: new Date().toISOString()
    };
    dbData.users.set(user.uid, user);
  }
  const token = generateToken({ uid: user.uid, email: user.email, role: user.role, fullName: user.fullName });
  return res.status(200).json({ success: true, message: 'Login successful', data: { user, token } });
});

// USER ROUTES
app.get(['/api/users/me', '/users/me'], authenticateToken, (req, res) => {
  const user = dbData.users.get(req.user.uid) || { uid: req.user.uid, email: req.user.email, fullName: req.user.fullName, role: req.user.role };
  return res.status(200).json({ success: true, data: user });
});

// CONTACTS ROUTES
app.get(['/api/contacts', '/contacts'], authenticateToken, (req, res) => {
  const contacts = Array.from(dbData.contacts.values()).filter(c => c.userId === req.user.uid);
  return res.status(200).json({ success: true, data: contacts });
});

app.post(['/api/contacts', '/contacts'], authenticateToken, (req, res) => {
  const { name, phone, relationship, isPrimary } = req.body;
  const id = 'contact_' + Date.now();
  const contact = { id, userId: req.user.uid, name, phone, relationship, isPrimary: !!isPrimary, createdAt: new Date().toISOString() };
  dbData.contacts.set(id, contact);
  return res.status(201).json({ success: true, message: 'Contact added', data: contact });
});

app.delete(['/api/contacts/:id', '/contacts/:id'], authenticateToken, (req, res) => {
  dbData.contacts.delete(req.params.id);
  return res.status(200).json({ success: true, message: 'Contact deleted' });
});

// SOS ROUTES
app.post(['/api/sos/trigger', '/sos/trigger'], authenticateToken, (req, res) => {
  const { latitude, longitude, address, contactsAlerted } = req.body;
  const id = 'sos_' + Date.now();
  const sos = {
    id,
    userId: req.user.uid,
    userName: req.user.fullName,
    latitude,
    longitude,
    address: address || `Lat: ${latitude}, Lng: ${longitude}`,
    status: 'ACTIVE',
    timestamp: new Date().toISOString(),
    contactsAlerted: contactsAlerted || []
  };
  dbData.sos.set(id, sos);
  return res.status(201).json({ success: true, message: 'SOS alert triggered', data: sos });
});

app.get(['/api/sos/history', '/sos/history'], authenticateToken, (req, res) => {
  const history = Array.from(dbData.sos.values()).filter(s => s.userId === req.user.uid);
  return res.status(200).json({ success: true, data: history });
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
  res.status(200).json({ status: 'online', service: 'SafeHaven API' });
});

export default app;
