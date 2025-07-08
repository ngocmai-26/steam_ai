import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../components/PrivateRoute';
import RoleBasedRoute from '../components/RoleBasedRoute';

// Public pages
import Login from '../pages/Login';
import Verification from '../pages/Verification';
import Home from '../pages/Home';
import CreateUser from '../pages/CreateUser';

// Private pages
import Dashboard from '../pages/Dashboard';
import Students from '../pages/Students';
import Courses from '../pages/Courses';
import Classes from '../pages/Classes';
import Evaluations from '../pages/Evaluations';
import Attendance from '../pages/Attendance';
import Accounts from '../pages/Accounts';
import Modules from '../pages/Modules';
import Lessons from '../pages/Lessons';

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
      <Route element={<PrivateRoute><MainLayout /></PrivateRoute>}>
        {/* Entry point after login, redirects based on role */}
        <Route path="/" element={<Home />} />

        {/* Manager-only routes */}
        <Route path="/dashboard" element={<RoleBasedRoute allowedRoles={['manager']}><Dashboard /></RoleBasedRoute>} />
        <Route path="/students" element={<RoleBasedRoute allowedRoles={['manager', 'teacher']}><Students /></RoleBasedRoute>} />
        <Route path="/courses" element={<RoleBasedRoute allowedRoles={['manager']}><Courses /></RoleBasedRoute>} />
        <Route path="/classes" element={<RoleBasedRoute allowedRoles={['manager', 'teacher']}><Classes /></RoleBasedRoute>} />
        <Route path="/modules" element={<RoleBasedRoute allowedRoles={['manager', 'teacher']}><Modules /></RoleBasedRoute>} />
        <Route path="/evaluations" element={<RoleBasedRoute allowedRoles={['manager', 'teacher']}><Evaluations /></RoleBasedRoute>} />
        <Route path="/attendance" element={<RoleBasedRoute allowedRoles={['manager', 'teacher']}><Attendance /></RoleBasedRoute>} />
        <Route path="/accounts" element={<RoleBasedRoute allowedRoles={['admin']}><Accounts /></RoleBasedRoute>} />
        <Route path="/lessons" element={<RoleBasedRoute allowedRoles={['manager', 'teacher']}><Lessons /></RoleBasedRoute>} />

        {/* Root-only routes */}
        <Route path="/create-user" element={<RoleBasedRoute allowedRoles={['root']}><CreateUser /></RoleBasedRoute>} />
      </Route>
    </Routes>
  );
};

export default AppRoutes; 