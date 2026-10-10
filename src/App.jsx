import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import UserLoginPage from './pages/UserLoginPage';
import UserDashboardPage from './pages/UserDashboardPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminAppointmentsPage from './pages/AdminAppointmentsPage';
import AdminServicesPage from './pages/AdminServicesPage';
import AdminSettingsPage from './pages/AdminSettingsPage';
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  return (
    <Routes>
      {/* Public Dental Clinic Website */}
      <Route path="/" element={<HomePage />} />

      {/* Patient Portal Authentication & Dashboard */}
      <Route path="/login" element={<UserLoginPage />} />
      <Route path="/register" element={<UserLoginPage />} />
      <Route path="/my-appointments" element={<UserDashboardPage />} />

      {/* Admin Authentication */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* Protected Clinic Admin Portal */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/appointments"
        element={
          <ProtectedRoute>
            <AdminAppointmentsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/services"
        element={
          <ProtectedRoute>
            <AdminServicesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute>
            <AdminSettingsPage />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
