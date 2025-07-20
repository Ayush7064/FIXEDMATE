// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { ToastContainer } from "react-toastify";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ServicePage from "./pages/ServicePage";
import ProtectedRoute from "./components/ProtectedRoute";
import EditProfilePage from "./pages/EditProfilePage";
import ProviderDetails from './pages/ProviderDetailsPage';
import MyBookingsPage from "./pages/MyBookingPage";
import BookingDetailPage from "./pages/BookingDetailPage";
import ProfilePage from "./pages/ProfilePage";




function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* ✅ Protected services route */}
          <Route
            path="/services"
            element={
              <ProtectedRoute>
                <ServicePage />
              </ProtectedRoute>
            }
          />
          <Route path="/provider/profile/:id" element={<EditProfilePage/>} />
          <Route path="/provider/:id" element={<ProviderDetails />} />
          <Route path = "/my-bookings" element ={<MyBookingsPage/>} />
          <Route path="/booking/:bookingId" element={<BookingDetailPage />} />
          <Route path = "/profile" element ={<ProfilePage/>} />

        </Routes>
        <Footer />
      </Router>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
