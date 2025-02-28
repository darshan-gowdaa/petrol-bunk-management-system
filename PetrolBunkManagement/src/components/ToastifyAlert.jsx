// src/components/ToastifyAlert.jsx
import React, { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastifyAlert = () => {
  return <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark" />;
};

// Utility function to show different types of toasts
export const showToast = (message, type = 'success') => {
  switch (type) {
    case 'added':
      toast.success(message);
      break;
    case 'edited':
      toast.info(message);
      break;
    case 'deleted':
    case 'error':
      toast.error(message);
      break;
    default:
      toast.success(message);
  }
};

export default ToastifyAlert;