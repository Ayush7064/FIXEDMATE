import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import useAuthStore from "../store/useAuthStore";

const formVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 60,
      damping: 12,
      delayChildren: 0.2,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const RegisterPage = () => {
  // eslint-disable-next-line no-unused-vars
  const { register, loading, error } = useAuthStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "user",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const success = await register(formData);

    if (success !== false) {
      toast.success("Registration successful!", { autoClose: 2000 });

      //const currentRole = formData.role;

      setFormData({
        name: "",
        email: "",
        password: "",
        phone: "",
        role: "user",
      });

      navigate("/login");
    } else {
      toast.error("Registration failed. Please check your details.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <motion.div
        className="w-full max-w-md bg-white rounded-lg p-2"
        variants={formVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h2
          className="text-3xl font-bold text-center mb-8 text-gray-800"
          variants={itemVariants}
        >
          Create an Account
        </motion.h2>

        <motion.form onSubmit={handleSubmit} className="space-y-6" variants={formVariants}>
          {/* Name */}
          <motion.div variants={itemVariants}>
            <label className="block text-base font-medium text-gray-800 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-[#4B27C4]"
              required
            />
          </motion.div>

          {/* Email */}
          <motion.div variants={itemVariants}>
            <label className="block text-base font-medium text-gray-800 mb-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-[#4B27C4]"
              required
            />
            <p className="text-sm text-gray-400 mt-1">e.g. user@email.com</p>
          </motion.div>

          {/* Phone */}
          <motion.div variants={itemVariants}>
            <label className="block text-base font-medium text-gray-800 mb-1">Phone</label>
            <input
              type="text"
              name="phone"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-[#4B27C4]"
              required
            />
          </motion.div>

          {/* Password */}
          <motion.div variants={itemVariants}>
            <label className="block text-base font-medium text-gray-800 mb-1">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-[#4B27C4]"
              required
            />
          </motion.div>

          {/* Role Selection (Radio Buttons) */}
          <motion.div variants={itemVariants}>
            <label className="block text-base font-medium text-gray-800 mb-1">Register As:</label>
            <div className="flex gap-8 mt-1">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="user"
                  checked={formData.role === "user"}
                  onChange={handleChange}
                  className="radio radio-primary scale-110"
                />
                <span className="text-base text-gray-700">User</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="provider"
                  checked={formData.role === "provider"}
                  onChange={handleChange}
                  className="radio radio-secondary scale-110"
                />
                <span className="text-base text-gray-700">Provider</span>
              </label>
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            className="w-full mt-4 text-white py-2.5 rounded-md font-semibold text-base transition duration-200"
            style={{ backgroundColor: "#4B27C4" }}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </motion.button>

         
        </motion.form>

        {/* Login Link */}
        <motion.p className="text-center mt-8 text-base text-gray-600" variants={itemVariants}>
          Already have an account?{" "}
          <NavLink to="/login" className="text-blue-600 font-medium hover:underline">
            Log In
          </NavLink>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
