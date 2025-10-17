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
import Students from '../pages/Students';
import Courses from '../pages/Courses';
import Classes from '../pages/Classes';
import Evaluations from '../pages/Evaluations';
import Attendance from '../pages/Attendance';
import Accounts from '../pages/Accounts';
import Modules from '../pages/Modules';
import Lessons from '../pages/Lessons';
import LessonDetail from '../pages/LessonDetail';
import Profile from '../pages/Profile';
import CalendarPage from '../pages/Calendar';
import StudentRegistrations from '../pages/StudentRegistrations';
import Facilities from '../pages/Facilities';

// Layouts
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import News from '../pages/News';

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
        <Route path="/students" element={<RoleBasedRoute allowedRoles={['manager', 'teacher']}><Students /></RoleBasedRoute>} />
        <Route path="/courses" element={<RoleBasedRoute allowedRoles={['manager']}><Courses /></RoleBasedRoute>} />
        <Route path="/classes" element={<RoleBasedRoute allowedRoles={['manager', 'teacher']}><Classes /></RoleBasedRoute>} />
        <Route path="/modules" element={<RoleBasedRoute allowedRoles={['manager', 'teacher']}><Modules /></RoleBasedRoute>} />
        <Route path="/evaluations" element={<RoleBasedRoute allowedRoles={['manager', 'teacher']}><Evaluations /></RoleBasedRoute>} />
        <Route path="/attendance" element={<RoleBasedRoute allowedRoles={['manager', 'teacher']}><Attendance /></RoleBasedRoute>} />
        <Route path="/accounts" element={<RoleBasedRoute allowedRoles={['admin', 'root']}><Accounts /></RoleBasedRoute>} />
        <Route path="/lessons" element={<RoleBasedRoute allowedRoles={['manager', 'teacher']}><Lessons /></RoleBasedRoute>} />
        <Route path="/lessons/:id" element={<RoleBasedRoute allowedRoles={['manager', 'teacher']}><LessonDetail /></RoleBasedRoute>} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/news" element={<RoleBasedRoute allowedRoles={['manager']}><News /></RoleBasedRoute>} />
        <Route path="/calendar" element={<RoleBasedRoute allowedRoles={['manager', 'teacher']}><CalendarPage /></RoleBasedRoute>} />
        <Route path="/student-registrations" element={<RoleBasedRoute allowedRoles={['manager']}><StudentRegistrations /></RoleBasedRoute>} />
        <Route path="/facilities" element={<RoleBasedRoute allowedRoles={['manager']}><Facilities /></RoleBasedRoute>} />

        {/* Root-only routes */}

      </Route>
    </Routes>
  );
};

export default AppRoutes; 