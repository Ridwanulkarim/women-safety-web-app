# 🛡️ SafeHaven - Women Safety Web Application

A full-stack, production-ready, glassmorphic **Women Safety Web Application** designed to provide instant emergency assistance, SOS distress broadcasting, live location tracking, emergency contacts management, emergency hotlines, safety knowledge base, and an administrative emergency response dashboard.

---

## 🌟 Key Features

- 🚨 **One-Tap SOS Panic System**: Instant distress trigger with location capture, reverse geocoding, and alert notifications.
- 📍 **Dual Location Engine**: Automatic smart fall-back between Google Maps JS API and Leaflet + OpenStreetMap (no paid API key required).
- 📞 **Emergency Contacts**: Manage up to 5 priority contacts with direct speed dial.
- 📱 **Quick Emergency Hotlines**: One-touch speed dial for 999 (National Emergency), Police, Fire, Ambulance, and Women Helpline.
- 🔐 **Authentication & Authorization**: Firebase Auth (Email/Password, Google Sign-In, Password Reset) with Role-Based Access Control (User & Admin) and backend JWT support.
- 📚 **Safety Tips & Blog Platform**: Interactive safety guides, categorization, search, and admin CMS.
- 🔔 **Real-Time Notifications**: Unread notification counter, mark read, and instant emergency alerts.
- 📊 **Admin Dashboard & Analytics**: System overview, user management (suspend/activate/delete), SOS incident logs, announcement broadcaster, and Chart.js analytics.
- 🎨 **Modern Glassmorphic UI**: Vibrant theme (`#E91E63` primary, `#7C3AED` secondary), dark/light mode toggle, mobile-first responsive layout, smooth Framer Motion animations.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 + Vite
- **Routing**: React Router DOM v7
- **Styling**: Tailwind CSS + Vanilla CSS Glassmorphism
- **Animations**: Framer Motion
- **Form Handling**: React Hook Form
- **Notifications**: React Hot Toast
- **Icons**: React Icons (Heroicons / Lucide / FontAwesome)
- **HTTP Client**: Axios
- **Maps**: Leaflet / React-Leaflet + Google Maps JS API
- **Charts**: Chart.js + react-chartjs-2
- **Backend Services**: Firebase SDK v11 (Auth & Firestore)

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database & Auth**: Firebase Admin SDK + Firestore
- **Security**: Helmet, CORS, Express Rate Limit, Express Validator, Cookie Parser, JWT

---

## 📁 Repository Structure

```
women-safety-app/
├── README.md                 # Project Overview & Deployment Guide
├── vercel.json               # Vercel Monorepo Deployment Config
├── .gitignore                # Git Ignore Rules
├── frontend/                 # React 19 + Vite Application
│   ├── src/
│   │   ├── components/       # UI Components (Common, SOS, Map, Contacts, Admin, Charts)
│   │   ├── context/          # React Context (Auth, Theme, Notifications, SOS)
│   │   ├── firebase/         # Firebase Frontend Config & Services
│   │   ├── hooks/            # Custom Hooks (useAuth, useGeolocation, useTheme, etc.)
│   │   ├── layouts/          # Page Layouts (PublicLayout, DashboardLayout, AdminLayout)
│   │   ├── pages/            # Public, User Dashboard & Admin Dashboard Pages
│   │   ├── routes/           # App Routing & Protected Route Guards
│   │   ├── services/         # Axios API Services
│   │   └── styles/           # Tailwind Directives & Custom CSS Utilities
│   ├── package.json
│   ├── vercel.json
│   ├── .env.example
│   └── README.md
└── backend/                  # Node.js + Express API Server
    ├── src/
    │   ├── config/           # Firebase Admin & Security Configurations
    │   ├── controllers/      # Route Controllers
    │   ├── middleware/       # JWT Auth, Admin Guards, Rate Limiting, Validation
    │   ├── routes/           # Express API Endpoints
    │   ├── services/         # Firestore Admin SDK Helpers
    │   └── validators/       # Request Input Validation Rules
    ├── server.js
    ├── package.json
    ├── vercel.json
    ├── .env.example
    └── README.md
```

---

## ⚡ Quick Start (Local Setup)

### Prerequisites
- Node.js >= 18.x
- npm >= 9.x

### 1. Clone & Setup Frontend
```bash
cd frontend
npm install
cp .env.example .env
```

### 2. Setup Backend
```bash
cd ../backend
npm install
cp .env.example .env
```

### 3. Environment Variables

#### Frontend (`frontend/.env`)
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_API_BASE_URL=http://localhost:5000/api
# Optional: Google Maps API key (if omitted, automatically falls back to Leaflet + OpenStreetMap)
VITE_GOOGLE_MAPS_API_KEY=
```

#### Backend (`backend/.env`)
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key_here
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY_HERE\n-----END PRIVATE KEY-----"
FRONTEND_URL=http://localhost:5173
```

---

## 🚀 Running Locally

### Start Backend API Server
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

### Start Frontend Dev Server
```bash
cd frontend
npm run dev
# App runs on http://localhost:5173
```

---

## 🌍 Vercel Deployment Guide

1. Push your repository to GitHub / GitLab.
2. Import the repository in [Vercel](https://vercel.com).
3. Set root directory or configure monorepo settings.
4. Add environment variables in Vercel project settings (`VITE_*` for frontend and `FIREBASE_*` for backend).
5. Deploy!

---

## 🔒 Security Best Practices

- All backend routes are validated using `express-validator`.
- Strict CORS policies restrict origins.
- Rate limiting prevents brute force / DDoS attempts.
- Firebase Admin verifies ID tokens on protected endpoints.
- No secrets or credentials are hardcoded into source code.
