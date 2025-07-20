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
      const response = await axiosInstance.get(`/bookings/${bookingId}`);
      
      // ✅ DEBUGGING: Log the entire response from the API
      console.log("API Response for Booking:", response.data);

      // This is where the problem might be. We expect response.data.booking
      const bookingData = response.data.booking;

      if (bookingData) {
        set({
          selectedBooking: bookingData,
          loading: false,
        });
      } else {
        // If bookingData is null or undefined, we set an error.
        throw new Error("Booking data not found in the API response.");
      }

    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Could not fetch booking details.";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },
  // --------------------


  // --- NEW: Action for the provider to update a booking's status ---
  updateBookingStatus: async (bookingId, status) => {
    // We can set a specific loading state for this action if needed
    set({ loading: true, error: null });
    try {
      // This matches the backend route PUT /api/bookings/:bookingId/status
      const response = await axiosInstance.put(`/bookings/${bookingId}/status`, { status });
      
      // Update the booking in the local state to reflect the change immediately
      set((state) => ({
        selectedBooking: response.data.booking,
        // Also update the main bookings list if it's loaded
        bookings: state.bookings.map((b) =>
          b._id === bookingId ? response.data.booking : b
        ),
        loading: false,
      }));
      toast.success(`Booking has been ${status}.`);
      return true; // Indicate success
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to update status.";
      set({ loading: false, error: errorMessage });
      toast.error(errorMessage);
      return false; // Indicate failure
    }
  },



  // Utility function to reset the store state
  resetBookingState: () => set({ loading: false, error: null, success: false }),
}));

export default useBookingStore;