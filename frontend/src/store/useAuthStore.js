import { create } from "zustand";
import axiosInstance from "../api/axiosInstance";
// eslint-disable-next-line no-unused-vars
import { ToastContainer, toast } from 'react-toastify';

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem("token") || null,
  isAuthenticated: !!localStorage.getItem("token"),
  loading: false,
  error: null,

  login: async ({ email, password, role }) => {
  try {
    set({ loading: true, error: null });

    const res = await axiosInstance.post("/auth/login", {
      email,
      password,
      role,
    });
    console.log(res);

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user)); // ✅ Correct


    set({
      user: res.data.user,
      token: res.data.token,
      isAuthenticated: true,
      loading: false,
    });
    //console.log(res.data);

    return true; // ✅ success
  } catch (err) {
    set({
      error: err.response?.data?.message || "Login failed",
      loading: false,
    });

    return false; // ❌ failed
  }
},


  register: async ({ name, email, password, phone, role }) => {
    try {
      set({ loading: true, error: null });

      const res = await axiosInstance.post("/auth/register", {
        name, email, password, phone, role,
      });
      console.log(res);

      set({
        user: res.data.user,
        token: res.data.token,
        isAuthenticated: true,
        loading: false,
      });

      localStorage.setItem("token", res.data.token);
    } catch (err) {
      set({
        error: err.response?.data?.message || "Registration failed",
        loading: false,
      });
    }
  },
  initializeUser: async () => {

  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const res = await axiosInstance.get("/provider/me"); // ✅ token sent via interceptor
    set({
      user: res.data.provider,
      isAuthenticated: true,
    });
  } catch (err) {
    console.error("Failed to initialize provider", err.response?.data || err.message);
    set({ user: null, isAuthenticated: false });
  }
  },



  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null, isAuthenticated: false, error: null });
  },
}));

export default useAuthStore;
