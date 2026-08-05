# Women Safety Application - Frontend

Modern, Glassmorphic React 19 Single Page Application built with Vite, Tailwind CSS, Framer Motion, Leaflet / Google Maps, and Firebase SDK.

## Key Modules & Routes

- **Public Pages**:
  - `/` - Landing Page with SOS quick activation, safety features, hotline cards.
  - `/about` - SafeHaven mission, initiative details, and core principles.
  - `/features` - Comprehensive feature showcase.
  - `/safety-tips` - Interactive safety manual with category search.
  - `/emergency-help` - Direct speed-dial emergency hotline numbers.
  - `/blog` - Safety blog platform with detail reader.
  - `/contact` - Support form & emergency assistance dispatch request.
  - `/login` / `/register` / `/forgot-password` - Authentication pages.

- **User Dashboard** (`/dashboard`):
  - Overview stats & recent distress alerts.
  - Profile Management (blood group, address, profile image URL).
  - Emergency Contacts (up to 5 contacts with direct dial).
  - SOS Panic History with interactive distress location map.
  - Live Location tracking & location sharing.
  - Real-time Notifications system.

- **Admin Panel** (`/admin`):
  - Analytics Overview (Chart.js monthly distress charts, user growth).
  - User Directory (Suspend, Reactivate, Delete users).
  - Emergency SOS Alerts monitor with map & status toggle (Active/Acknowledged/Resolved).
  - System Announcements broadcaster.
  - Blog & Safety Tips CMS management.

## Running Locally

```bash
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173).
