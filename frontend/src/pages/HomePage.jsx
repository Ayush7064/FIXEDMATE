import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import HeroSection from '../components/HeroSection';
import PopularService from '../components/PopularService';
import InfoCards from '../components/InfoCards';
import ProviderButtons from '../components/ProviderButtons';

function HomePage() {
  return (
    <>
      <HeroSection />

      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12 py-10 space-y-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Popular Services Section */}
        <motion.div>
          <motion.h1
            className="text-xl sm:text-2xl font-semibold mb-4"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Popular Services
          </motion.h1>

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <PopularService />
          </motion.div>
        </motion.div>

        {/* How It Works Section */}
        <motion.div>
          <motion.h1
            className="text-xl sm:text-2xl font-semibold"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            How FixMate Works
          </motion.h1>

          <motion.h2
            className="mt-4 text-3xl sm:text-5xl font-semibold leading-tight"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Connecting you with the best
          </motion.h2>

          <motion.p
            className="mt-4 text-gray-600 text-md sm:text-xl"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            Our platform simplifies the process of finding and hiring service providers,
          </motion.p>

          <motion.p
            className="text-gray-600 text-md sm:text-xl"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            ensuring a seamless experience from start to finish.
          </motion.p>
        </motion.div>

        {/* Info Cards Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <InfoCards />
        </motion.div>

        {/* Provider CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <ProviderButtons />
        </motion.div>
      </motion.div>
    </>
  );
}

export default HomePage;
