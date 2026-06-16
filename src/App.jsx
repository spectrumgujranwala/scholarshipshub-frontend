import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/layout/Navbar';
import AdminLayout from './components/layout/AdminLayout';
import './styles/index.css';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ApplicationForm from './pages/ApplicationForm';
import AdminDashboard from './pages/AdminDashboard';
import AdminApplications from './pages/AdminApplications';
import AdminApplicationDetail from './pages/AdminApplicationDetail';
import AdminUniversityApps from './pages/AdminUniversityApps';
import AdminScholarships from './pages/AdminScholarships';
import NotificationsPage from './pages/NotificationsPage';
import HomePage from './pages/HomePage';
import VerifyEmailPage from './pages/VerifyEmailPage';
const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;

  return children;
};

const App = () => {
  const googleClientId = "925269195030-i82urots4gofo9icclh6u1250dme1eqa.apps.googleusercontent.com";

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <Router>
        <AuthProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/application/edit" element={<ProtectedRoute><ApplicationForm /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/applications" element={<ProtectedRoute role="admin"><AdminApplications /></ProtectedRoute>} />
            <Route path="/admin/applications/:id" element={<ProtectedRoute role="admin"><AdminApplicationDetail /></ProtectedRoute>} />
            <Route path="/admin/university-apps" element={<ProtectedRoute role="admin"><AdminUniversityApps /></ProtectedRoute>} />
            <Route path="/admin/scholarships" element={<ProtectedRoute role="admin"><AdminScholarships /></ProtectedRoute>} />
          </Routes>
        </AuthProvider>
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;
