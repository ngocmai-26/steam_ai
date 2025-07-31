import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import Loading from './Loading';

const RoleBasedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();

  console.log('RoleBasedRoute:', { 
    user: user?.role, 
    allowedRoles, 
    isAuthenticated, 
    pathname: location.pathname 
  });

  if (!isAuthenticated || !user) {
    console.log('RoleBasedRoute: Not authenticated, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // If the user's role is in the allowedRoles array, render the component
  if (allowedRoles.includes(user.role)) {
    console.log('RoleBasedRoute: Role allowed, rendering component');
    return children;
  }
  
  // If the role is not allowed, redirect to home page
  console.log('RoleBasedRoute: Role not allowed, redirecting to home');
  return <Navigate to="/" replace />;
};

export default RoleBasedRoute; 