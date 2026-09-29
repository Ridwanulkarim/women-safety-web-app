import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import admin from 'firebase-admin';
import nodemailer from 'nodemailer';

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

Was this you?
If you recently signed in, you can safely ignore this notification.
If you did not initiate this login, please reset your password immediately:
https://women-safety-web-app.vercel.app/forgot-password

SafeHaven Women Emergency & Distress Network
Dhaka, Bangladesh
This is an automated mission-critical security alert sent to ${email}.`;

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
          <div class="info-row">
            <span class="label">Account Email:</span>
            <span class="val">${email}</span>
          </div>
          <div class="info-row">
            <span class="label">Date & Time:</span>
            <span class="val">${time}</span>
          </div>
          <div class="info-row">
            <span class="label">Status:</span>
            <span class="val" style="color: #34d399;">Authenticated</span>
          </div>
        </div>

        <div class="warning">
          <strong style="color: #f43f5e;">Was this you?</strong><br>
          If you recently signed in, you can safely ignore this notification. If you did NOT sign in, someone else may have gained access to your credentials. Please secure your account immediately.
        </div>

        <a href="https://women-safety-web-app.vercel.app/forgot-password" class="btn">
          Change / Reset Password
        </a>

        <div class="footer">
          SafeHaven Women Emergency & Distress Network • Dhaka, Bangladesh<br>
          This is an automated mission-critical security alert sent to ${email}.
        </div>
      </div>
    </body>
    </html>
  `;

  // 1. Gmail SMTP (Direct 100% Inbox Delivery via Nodemailer)
  const emailUser = process.env.EMAIL_USER || process.env.SMTP_USER || 'ridwanulk08@gmail.com';
  const emailPass = process.env.EMAIL_PASS || process.env.SMTP_PASS || 'palhriailsrlllro';
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
        html: htmlContent,
        headers: {
          'X-Priority': '3',
          'X-Entity-Ref-ID': 'safehaven-login-alert',
          'List-Unsubscribe': `<mailto:${emailUser}?subject=unsubscribe>`
        }
      });
      console.log(`[Gmail SMTP] Login alert successfully dispatched to ${email}`);
      return;
    } catch (e) {
      console.warn('Gmail SMTP notice:', e.message);
    }
  }

  // 2. Resend API
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
      console.log(`[Resend] Login alert dispatched to ${email}`);
      return;
    } catch (e) {
      console.warn('Resend dispatch notice:', e.message);
    }
  }

  console.log(`[Simulated Login Alert Email] Dispatched to: ${email} | Subject: "${subject}"`);
};

app.post(['/api/auth/login', '/auth/login'], async (req, res) => {
  const { email, uid, isSessionRestore } = req.body;
  const cleanEmail = email ? email.toLowerCase().trim() : '';
  let user = uid ? dbData.users.get(uid) : null;
  if (!user) {
    user = Array.from(dbData.users.values()).find(u => u.email === cleanEmail);
  }
  const isAdmin = cleanEmail === 'ridwanulk08@gmail.com' || cleanEmail.startsWith('admin@') || cleanEmail.includes('admin');
  if (!user) {
    user = {
      uid: uid || 'user_' + Date.now(),
      email: cleanEmail,
      fullName: cleanEmail.split('@')[0],
      role: isAdmin ? 'admin' : 'user',
      createdAt: new Date().toISOString()
    };
    dbData.users.set(user.uid, user);
  }

  // Dispatch automated security alert email only on REAL sign-in, NOT on page refresh / session restore!
  if (!isSessionRestore) {
    try {
      await dispatchLoginAlertEmail(user.email, user.fullName);
    } catch (err) {
      console.warn('Email dispatch notice:', err.message);
    }
  }

  const token = generateToken({ uid: user.uid, email: user.email, role: user.role, fullName: user.fullName });
  return res.status(200).json({ success: true, message: 'Login successful', data: { user, token } });
});

// USER ROUTES
app.get(['/api/users', '/users'], (req, res) => {
  return res.status(200).json({ success: true, data: Array.from(dbData.users.values()) });
});

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
