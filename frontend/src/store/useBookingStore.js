import { create } from 'zustand';
import axiosInstance from '../api/axiosInstance'; // 1. Use the shared axios instance
import { toast } from 'react-toastify'; // Optional: for user feedback

const useBookingStore = create((set) => ({
  loading: false,
  error: null,
  success: false,

  // Action to create a new booking
  createBooking: async (bookingData, providerId) => {
    set({ loading: true, error: null, success: false });
    try {
      // 2. The axiosInstance interceptor should handle the auth token.
      // The browser will automatically set the correct 'Content-Type' for FormData.
      const response = await axiosInstance.post(
        `/bookings?providerId=${providerId}`,
        bookingData // Send FormData directly
      );

      set({ loading: false, success: true, error: null });
      toast.success("Booking request sent successfully!"); // User feedback
      console.log("Booking created successfully:", response.data);

    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to create booking.";
      set({ loading: false, error: errorMessage, success: false });
      toast.error(errorMessage); // User feedback
      console.error("Booking creation error:", err);
    }
  },

  // --- NEW ACTION ---
  // Action to fetch the current user's bookings
  fetchMyBookings: async () => {
    set({ loading: true, error: null });
    try {
      // Your backend route for this is GET /api/bookings/my
      const response = await axiosInstance.get('/bookings/my');
      set({
        bookings: response.data.bookings,
        loading: false,
      });
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Could not fetch bookings.";
      set({
        error: errorMessage,
        loading: false,
        bookings: [], // Clear bookings on error
      });
      toast.error(errorMessage);
    }
  },
  // ---

  // --- NEW ACTION ---
  // Action to fetch a single booking by its ID
  fetchBookingById: async (bookingId) => {
    set({ loading: true, error: null, selectedBooking: null });
    try {
      // Assuming your backend route is GET /api/bookings/:id
      const response = await axiosInstance.get(`/bookings/${bookingId}`);
      set({
        selectedBooking: response.data.booking,
        loading: false,
      });
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Could not fetch booking details.";
      set({
        error: errorMessage,
        loading: false,
      });
      toast.error(errorMessage);
    }
  },
  // --------------------


  // Utility function to reset the store state
  resetBookingState: () => set({ loading: false, error: null, success: false }),
}));

export default useBookingStore;