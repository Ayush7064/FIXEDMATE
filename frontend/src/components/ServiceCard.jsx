import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

function ServiceCard({ name, image }) {
  return (
    <motion.div
      className="rounded-lg p-4 flex flex-col items-center"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05 }}
    >
      <motion.img
        src={image}
        alt={name}
        className="w-50 h-40 object-cover rounded mb-2"
        whileHover={{ scale: 1.1 }}
        transition={{ type: "spring", stiffness: 300 }}
      />
      <div className="text-center font-medium">{name}</div>
    </motion.div>
  );
}

export default ServiceCard;
