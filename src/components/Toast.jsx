import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Toast = () => {
  const alert = useSelector((state) => state.alert.msg);

  useEffect(() => {
    if (alert && alert.message) {
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
    }
  }, [alert]);

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