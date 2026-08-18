<div align="center">

# 🛡️ SafeHaven — Women Emergency & Distress Network

**Mission-Critical Personal Safety & Real-Time Distress Telemetry Platform**

[![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.4.3-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-rose?style=for-the-badge&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![Android TWA](https://img.shields.io/badge/Android_TWA-Target_SDK_36-3DDC84?style=for-the-badge&logo=android&logoColor=white)](https://developer.android.com/)
[![Vercel Deployed](https://img.shields.io/badge/Vercel-Live_Production-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://women-safety-web-app-three.vercel.app)

[🌐 Live Production Web App](https://women-safety-web-app-three.vercel.app) • [📱 Android App Bundle (.aab)](/Users/apple/.gemini/antigravity/scratch/safehaven-android/app/build/outputs/bundle/release/app-release.aab) • [📖 Documentation](#-table-of-contents)

</div>

---

## 📋 Table of Contents

- [🌟 Overview](#-overview)
- [✨ Core Capabilities & Features](#-core-capabilities--features)
- [💻 Tech Stack](#-tech-stack)
- [📱 Progressive Web App (PWA) & Android TWA](#-progressive-web-app-pwa--android-twa)
- [📁 Project Architecture](#-project-architecture)
- [⚡ Quick Start & Local Setup](#-quick-start--local-setup)
- [🔑 Environment Variables](#-environment-variables)
- [📦 Building for Production](#-building-for-production)
- [🤖 Android TWA Build Instructions](#-android-twa-build-instructions)
- [🔒 Security & Digital Asset Links](#-security--digital-asset-links)
- [📄 License](#-license)

---

## 🌟 Overview

**SafeHaven** is an enterprise-grade, mission-critical personal safety and emergency telemetry network designed specifically for women empowerment and rapid distress response. 

The platform bridges real-time geolocation tracking, one-tap SOS emergency broadcasting, encrypted digital evidence recording, national helpline speed-dials, and an administrative emergency operations command center.

### Why SafeHaven?
- **< 3-Second SOS Dispatch**: Instant transmission of high-accuracy GPS coordinates to up to 5 designated priority emergency contacts.
- **Offline-First Resilience**: Full PWA offline capability, caching essential emergency guides and speed-dial directories even in low-connectivity environments.
- **Native Android Integration**: Built as a Trusted Web Activity (TWA) target SDK 36, signed and ready for Google Play Store distribution.
- **Bilingual Accessibility**: Full English (`EN`) and Bengali (`BN`) localization support for emergency accessibility.

---

## ✨ Core Capabilities & Features

### 🚨 1. Instant SOS Panic Telemetry
- **One-Tap Beacon**: Immediate SOS dispatch trigger from header, mobile bottom nav, or dashboard.
- **Live GPS Tracking**: Captures and continuously streams real-time latitude, longitude, and accuracy radius to emergency contacts.
- **Countdown Safety Protocol**: 5-second cancel delay to prevent accidental activations.

### 🛡️ 2. Priority Emergency Contacts
- Add and manage up to 5 priority contacts with custom relationship tags.
- Direct speed-dial buttons and instant SMS/Webhook location dispatch.

### 📸 3. Encrypted Evidence Vault
- **Voice Recorder**: Emergency background audio capture.
- **Camera Capture**: Photo snapshots and video evidence recording during distress situations.
- Local media storage with timestamped cryptographic identification.

### 📞 4. National Emergency Speed-Dial Directory
- **999**: National Emergency Services (Police, Fire, Ambulance).
- **109 / 10921**: National Women & Child Violence Prevention Helplines.
- **1098**: Child Rights Helpline.
- **16263**: Shasthyo Batayon 24/7 Doctor & Ambulance Helpline.

### 📊 5. Administrative Operations Command Center (`/admin`)
- **Live Emergency Monitor**: Interactive map displaying active SOS distress signals with real-time status management (`Active` -> `Acknowledged` -> `Resolved`).
- **User Management**: Searchable directory to review user status, elevate permissions, or deactivate accounts.
- **Analytics & Incident Metrics**: Visual distress trend analytics with monthly distribution charts.
- **CMS Content Manager**: Publish safety tips, tactical self-defense guides, and emergency announcements.

---

## 💻 Tech Stack

| Domain | Technology |
| :--- | :--- |
| **Core Framework** | [React 19](https://react.dev/) + [Vite 6](https://vitejs.dev/) |
| **Styling & UI** | [Tailwind CSS 3](https://tailwindcss.com/) + Custom Glassmorphism Theme |
| **Icons & Motion** | [Lucide React](https://lucide.dev/), [React Icons](https://react-icons.github.io/react-icons/), [Framer Motion](https://www.framer.com/motion/) |
| **Maps & Telemetry** | [Leaflet.js](https://leafletjs.com/) + [React-Leaflet](https://react-leaflet.js.org/) + HTML5 Geolocation API |
| **Authentication & Sync** | [Firebase Auth](https://firebase.google.com/) + RESTful API Layer |
| **PWA & Service Worker** | [Vite PWA Plugin](https://vite-pwa-org.netlify.app/) + Workbox |
| **Android Packaging** | [Google Bubblewrap TWA CLI](https://github.com/GoogleChromeLabs/bubblewrap) + Gradle 8.11 |

---

## 📱 Progressive Web App (PWA) & Android TWA

SafeHaven is engineered as both a PWA and a native Android TWA:

```text
               ┌─────────────────────────────────────┐
               │         SafeHaven Web App           │
               └──────────────────┬──────────────────┘
                                  │
                  ┌───────────────┴───────────────┐
                  ▼                               ▼
       ┌────────────────────┐          ┌────────────────────┐
       │   PWA Mode (Web)   │          │  Android TWA App   │
       │ - Offline Service  │          │ - Package ID:      │
       │   Worker (sw.js)   │          │   com.ridwan.      │
       │ - Add to Home      │          │   safehaven        │
       │ - Web Manifest     │          │ - Target SDK 36    │
       └────────────────────┘          └────────────────────┘
```

- **Manifest**: Located at `public/manifest.webmanifest`.
- **Service Worker**: Auto-generated via Vite PWA plugin (`sw.js`).
- **Asset Links**: Verified domain verification via `.well-known/assetlinks.json`.

---

## 📁 Project Architecture

```text
women-safety-app/
├── public/
│   ├── .well-known/
│   │   └── assetlinks.json          # Digital Asset Links SHA-256 Fingerprint
│   ├── manifest.webmanifest         # PWA Web Manifest
│   ├── pwa-192x192.png              # App Launcher Icon (192x192)
│   └── pwa-512x512.png              # App Launcher Icon (512x512)
├── src/
│   ├── components/
│   │   ├── admin/                   # Admin Panel Charts, Incident Tables & CMS
│   │   ├── common/                  # Navbar, Footer, MobileBottomBar, ThemeToggle
│   │   ├── home/                    # Hero Section, Hotline Cards, Quick Tools
│   │   └── sos/                     # SOS Panic Beacon Modal & Live Broadcast Map
│   ├── context/
│   │   ├── AuthContext.jsx          # Firebase Auth & User Session State
│   │   ├── LanguageContext.jsx      # Internationalization (EN / BN)
│   │   ├── NotificationContext.jsx  # Real-Time Notifications & Deduplication
│   │   ├── SOSContext.jsx           # SOS Trigger & Emergency Dispatch State
│   │   └── ThemeContext.jsx         # Dark / Light Glassmorphic Theme Engine
│   ├── i18n/
│   │   └── locales/                 # English (en.json) & Bengali (bn.json)
│   ├── layouts/
│   │   ├── AdminLayout.jsx          # Admin Sidebar Layout
│   │   ├── DashboardLayout.jsx      # User Control Panel Layout
│   │   └── PublicLayout.jsx         # Public Responsive Web Layout
│   ├── pages/                       # Public, User Dashboard & Admin Pages
│   ├── routes/                      # Protected Route Navigation Guards
│   └── services/                    # Axios API Client & Firebase Auth Service
├── vite.config.js                   # Vite & PWA Configuration
└── package.json
```

---

## ⚡ Quick Start & Local Setup

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher

### Installation

1. **Clone Repository**:
   ```bash
   git clone https://github.com/Ridwanulkarim/women-safety-web-app.git
   cd women-safety-web-app
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173`.

---

## 🔑 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_API_BASE_URL=https://your-backend-api.com/api
```

---

## 📦 Building for Production

To compile optimized production assets and generate the PWA service worker:

```bash
npm run build
```

To preview the production build locally:
```bash
npm run preview
```

---

## 🤖 Android TWA Build Instructions

The Android application bundle (`.aab`) is initialized with Google Bubblewrap:

- **Package ID**: `com.ridwan.safehaven`
- **Host**: `women-safety-web-app-three.vercel.app`
- **Keystore**: `safehaven-release.keystore` (Alias: `safehaven`)
- **Target SDK**: `36` (Android 16)

To rebuild the signed release bundle:

```bash
cd safehaven-android
./gradlew bundleRelease
```

The output signed bundle will be located at:
`safehaven-android/app/build/outputs/bundle/release/app-release.aab`

---

## 🔒 Security & Digital Asset Links

SafeHaven uses Android Digital Asset Links to verify ownership between the web domain and the native Android app.

Live `.well-known/assetlinks.json`:
```json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.ridwan.safehaven",
    "sha256_cert_fingerprints": [
      "22:0C:5E:AC:9C:43:D2:C6:54:92:ED:73:85:A0:08:93:15:D6:1F:53:07:BB:48:92:77:6F:8A:4C:33:8F:A1:50"
    ]
  }
}]
```

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for details.

<div align="center">

**Built with ❤️ for Women Safety, Dignity & Empowerment**

</div>
