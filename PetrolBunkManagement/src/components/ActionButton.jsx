import React from 'react';
import { motion } from 'framer-motion';

const ActionButton = ({ 
  onClick, 
  icon, 
  text = null, 
  buttonVariants,
  className = "text-white bg-blue-600"
}) => {
  return (
    <motion.button
      variants={buttonVariants}
      whileHover="hover"
      whileTap="tap"
      onClick={onClick}
      className={`flex items-center justify-center px-4 py-2 rounded-md ${className}`}
    >
      {icon}
      {text && <span className="ml-2">{text}</span>}
    </motion.button>
  );
};

export default ActionButton;