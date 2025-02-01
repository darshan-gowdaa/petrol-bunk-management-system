import React, { useEffect } from 'react';

const Alert = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(onClose, 1300);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  const getBackgroundColor = () => {
    switch (type) {
      case 'added':
        return 'bg-blue-500';
      case 'edited':
        return 'bg-yellow-500';
      case 'deleted':
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-green-500';
    }
  };

  return (
    <div className={`fixed top-5 left-1/2 transform -translate-x-1/2 p-4 rounded shadow-lg transition-opacity duration-300 ease-in-out ${getBackgroundColor()} text-white opacity-100`}>
      {type === 'added' && '✅ '}{type === 'edited' && '✏️ '}{type === 'deleted' && '❌ '}{type === 'error' && '⚠️ '}{message}
    </div>
  );
};

export default Alert;
