import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/common/ProtectedRoute';

// Public Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import NotFoundPage from './pages/NotFoundPage';

// User Panel
import UserLayout from './user/UserLayout';
import UserDashboard from './user/pages/UserDashboard';
import UserSavedProjects from './user/pages/UserSavedProjects';
import UserTestimonials from './user/pages/UserTestimonials';
import UserMessages from './user/pages/UserMessages';
import UserProfile from './user/pages/UserProfile';

// Admin Panel
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/pages/AdminDashboard';
import AdminProjects from './admin/pages/AdminProjects';
import AdminSkills from './admin/pages/AdminSkills';
import AdminHackathons from './admin/pages/AdminHackathons';
import AdminEducationCertificates from './admin/pages/AdminEducationCertificates';
import AdminUsers from './admin/pages/AdminUsers';
import AdminTestimonials from './admin/pages/AdminTestimonials';
import AdminMessages from './admin/pages/AdminMessages';
import AdminSettings from './admin/pages/AdminSettings';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'var(--color-surface)',
                color: 'var(--color-text)',
                border: '1px solid var(--color-border)',
                borderRadius: '12px',
                fontSize: '13px',
                fontFamily: 'Inter, sans-serif',
                boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.15)',
              },
            }}
          />

          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* User Panel (Protected) */}
            <Route
              path="/user"
              element={
                <ProtectedRoute allowedRoles={['user', 'admin']}>
                  <UserLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<UserDashboard />} />
              <Route path="saved-projects" element={<UserSavedProjects />} />
              <Route path="testimonials" element={<UserTestimonials />} />
              <Route path="messages" element={<UserMessages />} />
              <Route path="profile" element={<UserProfile />} />
            </Route>

            {/* Admin Panel (Strictly Protected) */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="projects" element={<AdminProjects />} />
              <Route path="skills" element={<AdminSkills />} />
              <Route path="hackathons" element={<AdminHackathons />} />
              <Route path="experience" element={<AdminEducationCertificates />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="testimonials" element={<AdminTestimonials />} />
              <Route path="messages" element={<AdminMessages />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            {/* 404 Catch All */}
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
