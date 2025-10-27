import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { clearAlert } from '../slices/alertSlice';

const Toast = () => {
  const dispatch = useDispatch();
  const alert = useSelector((state) => state.alert.msg);
  const previousAlertRef = useRef(null);

  useEffect(() => {
    if (alert && alert.message && previousAlertRef.current !== alert.message) {
      previousAlertRef.current = alert.message;
      
      switch (alert.type) {
        case 'success':
          toast.success(alert.message);
          break;
        case 'error':
          toast.error(alert.message);
          break;
        case 'info':
          toast.info(alert.message);
          break;
        case 'warning':
          toast.warn(alert.message);
          break;
        default:
          toast(alert.message);
          break;
      }
      
      // Clear alert after showing
      setTimeout(() => {
        dispatch(clearAlert());
        previousAlertRef.current = null;
      }, 50);
    }
  }, [alert, dispatch]);

  return (
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored"
    />
  );
};

export default Toast;
