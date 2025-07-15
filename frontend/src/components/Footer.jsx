import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Twitter, Facebook, Instagram } from 'lucide-react';

function Footer() {
  return (
    <motion.footer
      className="text-[#5A7A99] px-6 py-12 bg-gray-200 text-[15px] sm:text-base"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <motion.div
        className="w-[90%] max-w-6xl mx-auto flex flex-col gap-10"
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        {/* Top Grid Sections */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          {/* FixMate Links */}
          <div>
            <h3 className="font-bold mb-4 text-lg text-gray-800">FixMate</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:underline">About</a></li>
              <li><a href="#" className="hover:underline">Careers</a></li>
              <li><a href="#" className="hover:underline">Contact</a></li>
              <li><a href="#" className="hover:underline">Help Center</a></li>
            </ul>
          </div>

          {/* Popular Services */}
          <div>
            <h3 className="font-bold mb-4 text-lg text-gray-800">Popular Services</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:underline">Electrician</a></li>
              <li><a href="#" className="hover:underline">Plumber</a></li>
              <li><a href="#" className="hover:underline">Carpenter</a></li>
              <li><a href="#" className="hover:underline">AC Technician</a></li>
              <li><a href="#" className="hover:underline">More Services</a></li>
            </ul>
          </div>

          {/* Legal + Region */}
          <div>
            <h3 className="font-bold mb-4 text-lg text-gray-800">Legal & Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:underline">Privacy Policy</a></li>
              <li><a href="#" className="hover:underline">Terms of Service</a></li>
              <li><a href="#" className="hover:underline">Service Availability</a></li>
              <li><span className="text-sm">Serving: India 🇮🇳</span></li>
            </ul>
          </div>
        </div>

        {/* Social Icons */}
        <motion.div
          className="flex gap-6 justify-center mt-4"
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <a href="#" aria-label="Twitter" className="hover:text-[#1DA1F2]">
            <Twitter size={22} />
          </a>
          <a href="#" aria-label="Facebook" className="hover:text-[#1877F2]">
            <Facebook size={22} />
          </a>
          <a href="#" aria-label="Instagram" className="hover:text-[#E1306C]">
            <Instagram size={22} />
          </a>
        </motion.div>

        {/* Copyright */}
        <motion.div
          className="text-center text-sm text-gray-500"
          initial={{ y: 10, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          viewport={{ once: true }}
        >
          © 2025 <span className="font-medium text-gray-700">FixMate</span>. All rights reserved.
        </motion.div>
      </motion.div>
    </motion.footer>
  );
}

export default Footer;
