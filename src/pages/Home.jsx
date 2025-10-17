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

  // Redirect all users to profile page
  return <Navigate to="/profile" replace />;
};

export default Home; 