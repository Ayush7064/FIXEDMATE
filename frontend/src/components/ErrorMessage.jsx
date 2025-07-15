import React from 'react';
import { AlertTriangle } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const ErrorMessage = ({ message = "Something went wrong. Please try again." }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-md mx-auto mt-6"
    >
      <div className="alert alert-error shadow-lg">
        <div className="flex items-center">
          <AlertTriangle className="w-6 h-6 mr-2 text-white" />
          <span className="text-white font-medium">{message}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ErrorMessage;
