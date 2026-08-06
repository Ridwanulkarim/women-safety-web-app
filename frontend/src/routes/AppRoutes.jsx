import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layouts
import PublicLayout from '../layouts/PublicLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import AdminLayout from '../layouts/AdminLayout';

// Route Guards
import { ProtectedRoute, AdminRoute } from './RouteGuards';

// Pages
import Home from '../pages/public/Home';
import About from '../pages/public/About';
import Features from '../pages/public/Features';
import SafetyTips from '../pages/public/SafetyTips';
import EmergencyHelp from '../pages/public/EmergencyHelp';
import Blog from '../pages/public/Blog';
import BlogDetail from '../pages/public/BlogDetail';
import Contact from '../pages/public/Contact';
import Login from '../pages/public/Login';
import Register from '../pages/public/Register';
import ForgotPassword from '../pages/public/ForgotPassword';
import NotFound from '../pages/public/NotFound';

// User Dashboard Pages
import UserDashboard from '../pages/user/UserDashboard';
import Profile from '../pages/user/Profile';
import Settings from '../pages/user/Settings';
import EmergencyContacts from '../pages/user/EmergencyContacts';
import SOSHistoryPage from '../pages/user/SOSHistoryPage';
import LiveLocationPage from '../pages/user/LiveLocationPage';
import NotificationsPage from '../pages/user/NotificationsPage';

// Admin Dashboard Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminAnalytics from '../pages/admin/AdminAnalytics';
import AdminAlerts from '../pages/admin/AdminAlerts';
import AdminAnnouncements from '../pages/admin/AdminAnnouncements';
import AdminSOSReports from '../pages/admin/AdminSOSReports';
import AdminSettings from '../pages/admin/AdminSettings';

const AppRoutes = () => {
  return (
    <Routes>
      {/* UNAUTHENTICATED PUBLIC ROUTES: Accessible without login */}
      <Route element={<PublicLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* AUTHENTICATED PROTECTED APPLICATION ROUTES: Requires Login */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/about"
          element={
            <ProtectedRoute>
              <About />
            </ProtectedRoute>
          }
        />
        <Route
          path="/features"
          element={
            <ProtectedRoute>
              <Features />
            </ProtectedRoute>
          }
        />
        <Route
          path="/safety-tips"
          element={
            <ProtectedRoute>
              <SafetyTips />
            </ProtectedRoute>
          }
        />
        <Route
          path="/emergency-help"
          element={
            <ProtectedRoute>
              <EmergencyHelp />
            </ProtectedRoute>
          }
        />
        <Route
          path="/blog"
          element={
            <ProtectedRoute>
              <Blog />
            </ProtectedRoute>
          }
        />
        <Route
          path="/blog/:id"
          element={
            <ProtectedRoute>
              <BlogDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contact"
          element={
            <ProtectedRoute>
              <Contact />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Route>

      {/* User Dashboard Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<UserDashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
        <Route path="contacts" element={<EmergencyContacts />} />
        <Route path="sos-history" element={<SOSHistoryPage />} />
        <Route path="live-location" element={<LiveLocationPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
      </Route>

      {/* Admin Dashboard Protected Routes */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="alerts" element={<AdminAlerts />} />
        <Route path="announcements" element={<AdminAnnouncements />} />
        <Route path="sos-reports" element={<AdminSOSReports />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
