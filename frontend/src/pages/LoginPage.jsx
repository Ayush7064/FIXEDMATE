import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import useAuthStore from "../store/useAuthStore";
import { toast } from "react-toastify";

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

const LoginPage = () => {
  const { login, loading, error } = useAuthStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
  console.log(formData);

  const success = await login(formData);

  if (success) {
    toast.success("Login successful!", { autoClose: 2000 });

    // ✅ 1. Save role temporarily
    const currentRole = formData.role;

    // ✅ 2. Reset form
    setFormData({
      email: "",
      password: "",
      role: "user",
    });

    // ✅ 3. Navigate using saved role
    navigate(currentRole === "user" ? "/services" : "/provider/dashboard");
  } else {
    toast.error("Invalid credentials. Please try again.");
  }
};



  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <motion.div
        className="w-full max-w-lg bg-white rounded-lg p-8"
        variants={formVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h2
          className="text-3xl font-bold text-center mb-8 text-gray-800"
          variants={itemVariants}
        >
          Welcome Back
        </motion.h2>

        <motion.form
          onSubmit={handleSubmit}
          className="space-y-6"
          variants={formVariants}
        >
          {/* Email */}
          <motion.div variants={itemVariants}>
            <label className="block text-base font-medium text-gray-800 mb-1">
              Email
            </label>
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

          {/* Password */}
          <motion.div variants={itemVariants}>
            <label className="block text-base font-medium text-gray-800 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-[#4B27C4]"
              required
            />
            <p className="text-sm text-gray-400 mt-1">Use correct password</p>
          </motion.div>

          {/* Role Selection (Radio Buttons) */}
          <motion.div variants={itemVariants}>
            <label className="block text-base font-medium text-gray-800 mb-1">
              Login As:
            </label>
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
            style={{
              backgroundColor: "#4B27C4",
            }}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            disabled={loading}
          >
            {loading ? "Logging In..." : "Log In"}
          </motion.button>

          {/* Error */}
          {error && (
            <p className="text-sm text-red-600 text-center mt-2">{error}</p>
          )}
        </motion.form>

        {/* Register Link */}
        <motion.p
          className="text-center mt-8 text-base text-gray-600"
          variants={itemVariants}
        >
          Don’t have an account?{" "}
          <NavLink
            to="/register"
            className="text-blue-600 font-medium hover:underline"
          >
            Register
          </NavLink>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
