# Women Safety App - Backend API

Express Node.js RESTful API integrated with Firebase Admin SDK, Firestore Database, JWT authentication, and security middleware (Helmet, CORS, Rate Limiting, Input Validation).

## API Endpoints Summary

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Create user profile and sync with Firestore
- `POST /api/auth/login` - Authenticate user and issue JWT token
- `GET /api/auth/me` - Get current authenticated user profile
- `POST /api/auth/verify-token` - Verify Firebase ID Token

### Users (`/api/users`)
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:uid` - Get user by UID
- `PUT /api/users/:uid` - Update user profile
- `PATCH /api/users/:uid/status` - Update user status (Active/Suspended - Admin only)
- `DELETE /api/users/:uid` - Delete user account (Admin only)

### Emergency Contacts (`/api/contacts`)
- `GET /api/contacts` - List user emergency contacts (Max 5)
- `POST /api/contacts` - Add new contact
- `PUT /api/contacts/:id` - Update contact
- `DELETE /api/contacts/:id` - Delete contact

### SOS System (`/api/sos`)
- `POST /api/sos` - Trigger emergency SOS distress alert
- `GET /api/sos/history` - Get user SOS distress history
- `GET /api/sos/all` - Get all SOS alerts (Admin only)
- `PATCH /api/sos/:id/status` - Update SOS status (Active/Acknowledged/Resolved)

### Notifications (`/api/notifications`)
- `GET /api/notifications` - Get user notifications
- `PATCH /api/notifications/:id/read` - Mark notification as read
- `DELETE /api/notifications/:id` - Delete notification

### Announcements (`/api/announcements`)
- `GET /api/announcements` - Get active announcements
- `POST /api/announcements` - Create announcement (Admin only)
- `DELETE /api/announcements/:id` - Delete announcement (Admin only)

### Blogs (`/api/blogs`)
- `GET /api/blogs` - Get all blogs (Public)
- `GET /api/blogs/:id` - Get blog detail
- `POST /api/blogs` - Create blog post (Admin only)
- `PUT /api/blogs/:id` - Update blog (Admin only)
- `DELETE /api/blogs/:id` - Delete blog (Admin only)

### Safety Tips (`/api/safety-tips`)
- `GET /api/safety-tips` - Get safety tips (Filter by category/search)
- `POST /api/safety-tips` - Add safety tip (Admin only)
- `PUT /api/safety-tips/:id` - Update safety tip (Admin only)
- `DELETE /api/safety-tips/:id` - Delete safety tip (Admin only)

### Analytics (`/api/analytics`)
- `GET /api/analytics/dashboard` - Aggregated statistics & Chart.js data (Admin only)

---

## Local Running Instructions

```bash
npm install
npm run dev
```
