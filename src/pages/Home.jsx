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

  if (user.role === 'root') {
    return <Navigate to="/create-user" replace />;
  }

  // Default redirection for other roles like 'manager'
  return <Navigate to="/dashboard" replace />;
};

export default Home; 