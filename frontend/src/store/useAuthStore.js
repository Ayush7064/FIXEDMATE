import { create } from "zustand";
import axiosInstance from "../api/axiosInstance";
// eslint-disable-next-line no-unused-vars
import { toast } from 'react-toastify';

const useAuthStore = create((set) => ({
  // FIX 1: Initialize user from localStorage
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  isAuthenticated: !!localStorage.getItem("token"),
  loading: false,
  error: null,


  setUser: (user) => set({ user }),

  login: async ({ email, password, role }) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.post("/auth/login", { email, password, role });
      
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      set({
        user: res.data.user,
        token: res.data.token,
        isAuthenticated: true,
        loading: false,
      });
      return true;
    } catch (err) {
      set({
        error: err.response?.data?.message || "Login failed",
        loading: false,
      });
      return false;
    }
  },

  register: async ({ name, email, password, phone, role }) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.post("/auth/register", { name, email, password, phone, role });
      
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      
      set({
        user: res.data.user,
        token: res.data.token,
        isAuthenticated: true,
        loading: false,
      });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Registration failed",
        loading: false,
      });
    }
  },

  // FIX 3: This function can be called once when the app loads to verify the token
  // and get the latest user data. It assumes you have a GET /api/auth/me endpoint.
  initializeUser: async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      set({ isAuthenticated: false, user: null });
      return;
    }

    try {
      // This endpoint should return user details based on the token
      const res = await axiosInstance.get("/auth/me"); 
      set({
        user: res.data.user,
        isAuthenticated: true,
      });
    } catch (err) {
      // If the token is invalid, log the user out
      console.error("Failed to initialize user", err.response?.data || err.message);
      set({ user: null, token: null, isAuthenticated: false });
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    // FIX 2: Also remove the user from localStorage on logout
    localStorage.removeItem("user");
    set({ user: null, token: null, isAuthenticated: false, error: null });
  },
}));

export default useAuthStore;
