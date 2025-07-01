import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import AppRoutes from './routes';
import ModalManager from './components/ModalManager';
import Toast from './components/Toast';
import { checkAuthThunk } from './thunks/AuthThunks';
import './App.css';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Check for existing authentication when the app loads
    dispatch(checkAuthThunk());
  }, [dispatch]);

  return (
    <>
      <AppRoutes />
      <ModalManager />
      <Toast />
    </>
  );
}

export default App;
