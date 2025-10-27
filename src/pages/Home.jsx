import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Loading from '../components/Loading';

const Home = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated || !user) {
    // Show loading or redirect to login if not authenticated for some reason
    return <Loading />;
  }

  // Redirect based on role to appropriate page
  const role = user?.role?.toLowerCase();
  let redirectPath = '/courses';
  
  if (role === 'manager') {
    redirectPath = '/classes';
  } else if (role === 'student') {
    redirectPath = '/courses';
  } else if (role === 'teacher') {
    redirectPath = '/classes';
  } else if (role === 'admin') {
    redirectPath = '/classes';
  }

  return <Navigate to={redirectPath} replace />;
};

export default Home; 