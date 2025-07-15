import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import useProviderProfileStore from "../store/useProviderProfileStore";
import { toast } from "react-toastify";

const EditProfilePage = () => {
  const { updateProfile, loading, error, success } = useProviderProfileStore();

  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

  const isAuthenticated = !!storedUser;

  const [formData, setFormData] = useState({
    serviceType: "",
    description: "",
    city: "",
    pin: "",
    address: "",
  });

  useEffect(() => {
    if (storedUser?.role === "provider") {
      setFormData({
        serviceType: storedUser.serviceType || "",
        description: storedUser.description || "",
        city: storedUser.location?.city || "",
        pin: storedUser.location?.pin || "",
        address: storedUser.location?.address || "",
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    const res = await updateProfile(formData, storedUser?.id); // ✅ Send ID
    if (res) toast.success("Profile updated!");
    console.log(res);
  };

  if (!isAuthenticated || storedUser?.role !== "provider") {
    return (
      <div className="text-center mt-10 text-lg font-semibold text-red-500">
        Access Denied. Only service providers can access this page.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <motion.h2
        className="text-3xl font-bold text-gray-800 mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Edit Your Service Profile
      </motion.h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl space-y-6 border border-gray-100"
      >
        {/* Service Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Service Type
          </label>
          <select
            name="serviceType"
            value={formData.serviceType}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
            required
          >
            <option value="">Select a service</option>
            <option value="electrician">Electrician</option>
            <option value="plumber">Plumber</option>
            <option value="carpenter">Carpenter</option>
            <option value="ac technician">AC Technician</option>
            <option value="painter">Painter</option>
            <option value="driver">Driver</option>
            <option value="mechanic">Mechanic</option>
            <option value="cleaner">Cleaner</option>
            <option value="technician">Technician</option>
            <option value="pest control">Pest Control</option>
            <option value="appliance repair">Appliance Repair</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
            required
          />
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
            required
          />
        </div>

        {/* PIN Code */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            PIN Code
          </label>
          <input
            type="text"
            name="pin"
            value={formData.pin}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
            required
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address <span className="text-xs text-gray-400">(optional)</span>
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
          />
        </div>

        {/* Error / Success */}
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">{success}</p>}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition duration-200 shadow-sm"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
}



export default EditProfilePage;
