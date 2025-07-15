import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

import heroImage from '/heroimg.png'; // Adjust the path as needed

function HeroSection() {
  return (
    <div className="relative m-8 flex items-center justify-center rounded-2xl h-[32rem] overflow-hidden">
      {/* Animated Background Image Container */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center rounded-2xl"
        style={{
          backgroundImage: `url(${heroImage})`,
        }}
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      ></motion.div>

      {/* Optional: You can add heading/text content here with animation too */}
      <motion.h1
        className="z-10 text-white text-5xl font-bold text-center"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        Welcome to FixMate
      </motion.h1>
    </div>
  );
}

export default HeroSection;
