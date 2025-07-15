import React from "react";
import ProviderCard from "./ProviderCard";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const ProviderGrid = ({ providers }) => {
  return (
    <motion.div
      className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {providers.map((provider, idx) => (
        <ProviderCard key={idx} provider={provider} />
      ))}
    </motion.div>
  );
};

export default ProviderGrid;
