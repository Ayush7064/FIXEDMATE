import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useProviderProfileStore from "../store/useProviderProfileStore";
import { toast } from "react-toastify";

const EditProfilePage = () => {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user"));

  const { updateProfile, loading } = useProviderProfileStore();

  const [formData, setFormData] = useState({
    serviceType: "",
    description: "",
    city: "",
    pin: "",
    address: "",
    proilepic : null,
    servicePic: null,
  });

  useEffect(() => {
    if (storedUser) {
      setFormData((prev) => ({
        ...prev,
        serviceType: storedUser.serviceType || "",
        description: storedUser.description || "",
        city: storedUser.city || "",
        pin: storedUser.pin || "",
        address: storedUser.address || "",
      }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Made this handler generic to work for any file input
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files[0]) {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0], // Use the input's name to update state
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const locationRes = await fetch(
        `https://nominatim.openstreetmap.org/search?city=${formData.city}&postalcode=${formData.pin}&format=json`
      );
      const locationData = await locationRes.json();

      if (!locationData.length) {
        toast.error("❌ Location not found. Please check city and PIN.");
        return;
      }

      const coordinates = [
        parseFloat(locationData[0].lon),
        parseFloat(locationData[0].lat),
      ];

      const dataToSend = new FormData();
      dataToSend.append("id", storedUser?.id || "");
      console.log(formData);
      dataToSend.append("serviceType", formData.serviceType);
      dataToSend.append("description", formData.description);
      dataToSend.append("city", formData.city);
      dataToSend.append("pin", formData.pin);
      dataToSend.append("address", formData.address || "");
      dataToSend.append("coordinates", JSON.stringify(coordinates));
      
      // Append profile picture if it exists
      if (formData.profilePic) { // ✅ Add profilePic to FormData
        dataToSend.append("profilePic", formData.profilePic);
      }
      
      // Append service picture if it exists
      if (formData.servicePic) {
        dataToSend.append("servicePic", formData.servicePic);
      }

      for (let pair of dataToSend.entries()) {
        console.log(`${pair[0]}:`, pair[1]);
      }

      const res = await updateProfile(dataToSend);

      if (res) {
        toast.success("✅ Profile updated successfully!");
        navigate("/profile");
      } else {
        toast.error("❌ Failed to update profile.");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error("❌ An unexpected error occurred.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6">Edit Your Service Profile</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          name="serviceType"
          value={formData.serviceType}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
          required
        >
          <option value="">Select a service</option>
          <option value="ac technician">AC Technician</option>
          <option value="appliance repair">Appliance Repair</option>
          <option value="carpenter">Carpenter</option>
          <option value="electrician">Electrician</option>
          <option value="cleaner">House Cleaning</option>
          <option value="mechanic">Mechanic</option>
          <option value="painter">Painter</option>
          <option value="pest control">Pest Control</option>
          <option value="plumber">Plumber</option>
          <option value="driver">Driver</option>
          <option value="gardener">Gardener</option>
          <option value="technician">Technician</option>
          <option value="other">Other</option>
        </select>

        {/* Description */}
        <div>
          <label className="block font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
            required
          ></textarea>
        </div>

        {/* City */}
        <div>
          <label className="block font-medium">City</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
            required
          />
        </div>

        {/* PIN Code */}
        <div>
          <label className="block font-medium">PIN Code</label>
          <input
            type="number"
            name="pin"
            value={formData.pin}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
            required
          />
        </div>

        {/* Address */}
        <div>
          <label className="block font-medium">Full Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
            required
          />
        </div>

         {/* ✅ Profile Image Upload */}
        <div>
          <label className="block font-medium">Upload Profile Picture</label>
          <input
            type="file"
            name="profilePic" // Name matches state property
            onChange={handleFileChange}
            accept="image/*"
            className="w-full mt-1"
          />
        </div>

        {/* Service Image Upload */}
        <div>
          <label className="block font-medium">Upload Service Picture</label>
          <input
            type="file"
            name="servicePic"
            onChange={handleFileChange}
            accept="image/*"
            className="w-full mt-1"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default EditProfilePage;
