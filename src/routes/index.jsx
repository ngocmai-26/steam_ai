import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from '../components/PrivateRoute';

// Public pages
import Login from '../pages/Login';
import Verification from '../pages/Verification';

// Private pages
import Dashboard from '../pages/Dashboard';
import Students from '../pages/Students';
import Courses from '../pages/Courses';
import Classes from '../pages/Classes';
import Evaluations from '../pages/Evaluations';
import Attendance from '../pages/Attendance';
import Accounts from '../pages/Accounts';

// Layouts
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/verify" element={<Verification />} />
      </Route>

      {/* Private Routes */}
      <Route
        element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }
      >
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/students" element={<Students />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/classes" element={<Classes />} />
        <Route path="/evaluations" element={<Evaluations />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/accounts" element={<Accounts />} />
      </Route>

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes; 