import { create } from "zustand";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";

const useProviderProfileStore = create((set) => ({
  loading: false,
  error: null,
  success: null,

  updateProfile: async (formData) => {
    try {
      set({ loading: true, error: null, success: null });

      // Debug log
      console.log("📤 Sending to backend:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const res = await axiosInstance.patch("/provider/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      set({ loading: false, success: "Profile updated successfully" });
      return res.data;
    } catch (err) {
      const message =
        err?.response?.data?.message || err.message || "Failed to update profile";

      set({ loading: false, error: message });
      toast.error(`❌ ${message}`);
      return null;
    }
  },
}));

export default useProviderProfileStore;
