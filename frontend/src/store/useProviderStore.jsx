// useProviderStore.js
import { create } from "zustand";
import axiosInstance from "../api/axiosInstance";

const useProviderStore = create((set) => ({
  providers: [],
  allProviders: [],
  loading: false,
  error: false,

  fetchProvidersWithGeo: async () => {
  try {
    set({ loading: true, error: null });

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const res = await axiosInstance.get(
          `/provider/nearby?lat=${latitude}&lng=${longitude}`
        );
        await new Promise((resolve) => setTimeout(resolve, 1000));

        set({
          providers: res.data.providers,
          allProviders: res.data.providers,
          loading: false,
        });
      },
      () => {
        set({ error: "Geolocation permission denied", loading: false });
      }
    );
  } catch (err) {
    set({ error: err.response?.data?.message || "Failed to fetch", loading: false });
  }
  },


  fetchProviders: async ({ lat, lng }) => {
     // ✅ move outside try

    try {

      set({ loading: true, error: false });
      const res = await axiosInstance.get(`/provider/nearby?lat=${lat}&lng=${lng}`);

      
       // ✅ simulate delay
       console.log(res);

      set({
        providers: res.data.providers,
        allProviders: res.data.providers,
        loading: false,
      });
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      set({
        error: true,
        loading: false,
      });
    }
  },

  filterProviders: (category, rating) =>
    set((state) => {
      let filtered = [...state.allProviders];

      if (category && category !== "all") {
        filtered = filtered.filter((p) => p.serviceType === category);
      }

      if (rating && rating > 0) {
        filtered = filtered.filter((p) => p.rating >= rating);
      }

      return { providers: filtered };
    }),

    
    fetchProviderById: async (id) => {
    try {
      set({ loading: true, error: null });

      const res = await axiosInstance.get(`/provider/${id}`);

      set({
        selectedProvider: res.data.provider,
        loading: false,
      });
    } catch (err) {
      console.error("Error fetching provider by ID:", err);
      set({ selectedProvider: null, error: true, loading: false });
    }
  },
}));

export default useProviderStore;
