import React, { useEffect } from 'react';
import { 
  CheckCircle, 
  AlertCircle, 
  X, 
  Edit, 
  Trash 
} from 'lucide-react';

const Alert = ({ message, type = 'success', onClose }) => {
  if (typeof message !== 'string') {
    console.error('Alert message must be a string');
    message = 'An unexpected error occurred.';
  }

  useEffect(() => {
    if (message) {
      const timer = setTimeout(onClose, 1300);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  const getStyles = () => {
    switch (type) {
      case 'added':
        return {
          icon: <CheckCircle className="w-5 h-5" />,
          background: 'bg-blue-100',
          text: 'text-blue-800',
          border: 'border-blue-200',
          shadow: 'shadow-blue-500/10'
        };
      case 'edited':
        return {
          icon: <Edit className="w-5 h-5" />,
          background: 'bg-yellow-100',
          text: 'text-yellow-800',
          border: 'border-yellow-200',
          shadow: 'shadow-yellow-500/10'
        };
      case 'deleted':
        return {
          icon: <Trash className="w-5 h-5" />,
          background: 'bg-red-100',
          text: 'text-red-800',
          border: 'border-red-200',
          shadow: 'shadow-red-500/10'
        };
      case 'error':
        return {
          icon: <AlertCircle className="w-5 h-5" />,
          background: 'bg-red-100',
          text: 'text-red-800',
          border: 'border-red-200',
          shadow: 'shadow-red-500/10'
        };
      default:
        return {
          icon: <CheckCircle className="w-5 h-5" />,
          background: 'bg-green-100',
          text: 'text-green-800',
          border: 'border-green-200',
          shadow: 'shadow-green-500/10'
        };
    }
  };

  const styles = getStyles();

  return (
    <div className="fixed z-50 transition-all duration-300 ease-out transform top-4 right-4 animate-popup">
      <div className={`flex items-center p-4 rounded-lg ${styles.background} ${styles.text} ${styles.border} border shadow-md ${styles.shadow} max-w-md`}>
        <div className="mr-3">
          {styles.icon}
        </div>
        <p className="font-medium">{message}</p>
        <button
          onClick={onClose}
          className={`ml-auto -mx-1.5 -my-1.5 ${styles.background} ${styles.text} rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 inline-flex items-center justify-center h-8 w-8 hover:bg-opacity-80`}
          aria-label="Close"
        >
          <span className="sr-only">Close</span>
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Alert;