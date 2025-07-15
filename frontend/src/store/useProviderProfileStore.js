import { create } from "zustand";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";

const useProviderProfileStore = create((set) => ({
  loading: false,
  error: null,
  success: null,

  updateProfile: async (profileData,Id) => {
    try {
      set({ loading: true, error: null, success: null });

      const locationRes = await fetch(
        `https://nominatim.openstreetmap.org/search?city=${profileData.city}&postalcode=${profileData.pin}&format=json`
      );
      const locationData = await locationRes.json();

      if (!locationData.length) throw new Error("Location not found");

      const coordinates = [
        parseFloat(locationData[0].lon),
        parseFloat(locationData[0].lat),
      ];

      const payload = {
        id:Id,
        serviceType: profileData.serviceType,
        description: profileData.description,
        location: {
          city: profileData.city,
          pin: profileData.pin,
          address: profileData.address || "",
          coordinates,
        },
      };
      console.log(payload);

      const res = await axiosInstance.patch("/provider/profile", payload);

      set({ loading: false, success: "Profile updated successfully" });
      //toast.success("✅ Profile updated successfully");
      return res.data;
    } catch (err) {
      const message =
        err?.response?.data?.message || err.message || "Failed to update profile";

      set({
        loading: false,
        error: message,
      });

      toast.error(`❌ ${message}`);
      return null;
    }
  },
}));

export default useProviderProfileStore;
