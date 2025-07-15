import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

function CardInfo({ icon, title, description }) {
  return (
    <motion.div
      className="h-full w-full border-2 border-slate-600 rounded-xl shadow-md p-4 flex flex-col justify-start bg-white hover:bg-slate-50 transition-colors duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)" }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="text-2xl mb-2 text-indigo-600"
        initial={{ rotate: 0 }}
        transition={{ duration: 0.5 }}
      >
        {icon}
      </motion.div>
      <h3 className="font-semibold text-xl mb-1 text-gray-900">{title}</h3>
      <p className="text-slate-600 text-lg leading-relaxed">{description}</p>
    </motion.div>
  );
}

export default CardInfo;