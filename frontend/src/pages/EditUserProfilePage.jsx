import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore"; // Adjust path if needed
import useUserProfileStore from "../store/useUserProfileStore";

const EditUserProfilePage = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuthStore();
  const { updateUserProfile, loading, error } = useUserProfileStore();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    city: "",
    pin: "",
    address: "",
  });
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(user?.profilePic?.url || "");

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        city: user.location?.city || "",
        pin: user.location?.pin || "",
        address: user.location?.address || "",
      });
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicFile(file);
      setProfilePicPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // ✅ UPDATED: Geocoding logic moved directly here as requested
      const locationRes = await fetch(
        `https://nominatim.openstreetmap.org/search?city=${formData.city}&postalcode=${formData.pin}&format=json`
      );
      const locationData = await locationRes.json();

      if (!locationData.length) {
        toast.error("Location not found. Please check city and PIN code.");
        return; // Stop submission if location is not found
      }

      const coordinates = {
        lng: parseFloat(locationData[0].lon),
        lat: parseFloat(locationData[0].lat),
      };

      const submissionData = new FormData();
      submissionData.append('name', formData.name);
      submissionData.append('phone', formData.phone);
      
      // Append location text fields
      submissionData.append('location[city]', formData.city);
      submissionData.append('location[pin]', formData.pin);
      submissionData.append('location[address]', formData.address);
      
      // Append the fetched coordinates
      submissionData.append('location[coordinates][0]', coordinates.lng);
      submissionData.append('location[coordinates][1]', coordinates.lat);

      if (profilePicFile) {
        submissionData.append('profilePic', profilePicFile);
      }

      const updatedUser = await updateUserProfile(submissionData);
      
      if (updatedUser) {
        const newUserState = { ...user, ...updatedUser };
        setUser(newUserState); 
        localStorage.setItem('user', JSON.stringify(newUserState));
        
        toast.success("Profile updated successfully!");
        navigate("/profile"); 
      } else {
        toast.error(error || "Failed to update profile.");
      }
    } catch (err) {
        console.error("Geocoding or Profile Update Error:", err);
        toast.error("An error occurred. Please try again.");
    }
  };

  if (!user) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <motion.h2
        className="text-3xl font-bold text-gray-800 mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Complete Your Profile
      </motion.h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl space-y-6 border border-gray-100"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
          <div className="flex items-center gap-4">
            <div className="avatar">
              <div className="w-16 rounded-full ring ring-blue-200 ring-offset-2">
                <img src={profilePicPreview || `https://ui-avatars.com/api/?name=${formData.name}`}
                 alt="Avatar Preview"
                 className="w-16 rounded-full ring ring-blue-200 ring-offset-2" />
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} className="input input-bordered w-full" required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="input input-bordered w-full" required />
        </div>
        
        <div className="divider">Location Details</div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
          <input type="text" name="city" value={formData.city} onChange={handleChange} className="input input-bordered w-full" required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">PIN Code</label>
          <input type="text" name="pin" value={formData.pin} onChange={handleChange} className="input input-bordered w-full" required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
          <input type="text" name="address" value={formData.address} onChange={handleChange} className="input input-bordered w-full" required/>
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <button type="submit" className="btn btn-primary w-full" disabled={loading}>
          {loading ? <span className="loading loading-spinner"></span> : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

export default EditUserProfilePage;
