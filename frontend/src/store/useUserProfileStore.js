import { create } from "zustand";
import axiosInstance from "../api/axiosInstance";

const useUserProfileStore = create((set) => ({
  loading: false,
  error: null,
  
  updateUserProfile: async (formData) => {
    set({ loading: true, error: null });
    try {
      // The backend route will be PUT /api/users/profile
      const res = await axiosInstance.put("/user/profile", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      set({ loading: false });
      return res.data.user; // Return the updated user object on success
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Profile update failed.";
      set({ loading: false, error: errorMessage });
      return null; // Return null on failure
    }
  },
}));

export default useUserProfileStore;
