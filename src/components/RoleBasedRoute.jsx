import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import Loading from './Loading';

const RoleBasedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated || !user) {
    // This case should ideally be handled by a general PrivateRoute wrapping this one
    // But as a fallback, we can show loading or redirect.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // If the user's role is in the allowedRoles array, render the component
  if (allowedRoles.includes(user.role)) {
    return children;
  }
  
  // If the role is not allowed, redirect to the default home page
  // The Home page will then redirect them to their correct dashboard.
  return <Navigate to="/" replace />;
};

export default RoleBasedRoute; 