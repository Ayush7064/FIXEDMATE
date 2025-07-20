import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import useBookingStore from '../store/useBookingStore';
import useAuthStore from '../store/useAuthStore'; // 1. Import auth store to know the user's role
import { Calendar, Clock, User, FileText, ArrowLeft, Check, X, Phone, Mail } from 'lucide-react';

// --- Helper Components ---
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const WrenchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const BookingProgress = ({ status }) => {
  const statuses = ["pending", "accepted", "in-progress", "completed"];
  const currentStatusIndex = statuses.indexOf(status);
  const progressPercentage = status === "rejected" ? 0 : ((currentStatusIndex + 1) / statuses.length) * 100;
  let progressColor = "progress-info";
  if (status === "completed") progressColor = "progress-success";
  if (status === "rejected") progressColor = "progress-error";
  return (
    <div className="my-6">
      <h3 className="font-semibold text-slate-800 mb-2">Booking Progress</h3>
      <progress className={`progress ${progressColor} w-full`} value={progressPercentage} max="100" />
      <div className="flex justify-between text-xs text-slate-500 mt-1">
        {statuses.map((s) => <span key={s} className="capitalize">{s}</span>)}
      </div>
    </div>
  );
};

// This component is now generic for both User and Provider
const BookingDetailPage = () => {
  const { bookingId } = useParams();
  const { selectedBooking, loading, error, fetchBookingById, updateBookingStatus } = useBookingStore();
  const { user: loggedInUser } = useAuthStore(); // 2. Get the logged-in user's info

  useEffect(() => {
    if (bookingId) {
      fetchBookingById(bookingId);
    }
  }, [bookingId, fetchBookingById]);

  const handleStatusUpdate = async (newStatus) => {
    await updateBookingStatus(bookingId, newStatus);
  };

  if (loading || (!selectedBooking && !error)) {
    return <div className="flex justify-center items-center h-screen"><span className="loading loading-spinner text-primary loading-lg"></span></div>;
  }

  if (error || !selectedBooking) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold text-red-600">Error</h2>
        <p className="text-slate-500 mt-2">{error || "Booking not found."}</p>
        <Link to="/" className="btn btn-primary mt-6">Go Home</Link>
      </div>
    );
  }

  const booking = selectedBooking;

  if (!booking.user || !booking.provider) {
    return <div className="text-center p-10 text-red-500">Error: Booking data is incomplete. User or Provider details are missing.</div>;
  }
  
  // 3. Create dynamic variables based on role
  const isProvider = loggedInUser?.role === 'provider';
  const backLink = isProvider ? '/provider/bookings' : '/my-bookings';
  const canShowContact = !isProvider && ["accepted", "in-progress", "completed"].includes(booking.status);

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      <div className="max-w-4xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <Link to={backLink} className="btn btn-ghost mb-6 text-slate-600 hover:bg-slate-100">
            <ArrowLeft size={20} />
            Back to Bookings
        </Link>

        <header className="mb-4">
          <h1 className="text-4xl font-bold text-slate-800">Booking Details</h1>
          <p className="text-slate-400 mt-1">Booking ID: #{booking._id}</p>
        </header>

        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200">
          {/* Show Progress Bar only for Users */}
          {loggedInUser?.role === 'user' && <BookingProgress status={booking.status} />}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
                <div className="flex items-start gap-4">
                    <div className="bg-slate-100 p-3 rounded-full"><User /></div>
                    <div>
                        <p className="font-semibold text-slate-800">{isProvider ? 'Client Details' : 'Provider Details'}</p>
                        <p className="text-slate-600">{isProvider ? booking.user.name : booking.provider.name}</p>
                        <p className="text-slate-500 text-sm">{isProvider ? booking.user.email : booking.provider.email}</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="bg-slate-100 p-3 rounded-full"><CalendarIcon /></div>
                    <div>
                        <p className="font-semibold text-slate-800">Date & Time</p>
                        <p className="text-slate-600">{new Date(booking.date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })} at {booking.time}</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="bg-slate-100 p-3 rounded-full"><WrenchIcon /></div>
                    <div>
                        <p className="font-semibold text-slate-800">Service Request</p>
                        <p className="text-slate-600">{booking.description}</p>
                    </div>
                </div>
            </div>
            <div className="space-y-4">
                <p className="font-semibold text-slate-800">Uploaded Image</p>
                {booking.issueImage?.url ? (
                    <img src={booking.issueImage.url} alt="Issue provided by client" className="w-full h-auto max-h-80 object-cover rounded-lg border" />
                ) : (
                    <div className="w-full h-48 flex items-center justify-center bg-slate-50 border-2 border-dashed rounded-lg">
                        <p className="text-slate-400">No image provided</p>
                    </div>
                )}
            </div>
          </div>

          <div className="border-t border-dashed border-slate-200 my-8"></div>

          {/* 4. Conditionally render the correct action/info section */}
          {isProvider && (
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">Respond to Request</h3>
              {booking.status === 'pending' ? (
                <div className="p-4 bg-amber-50 rounded-lg">
                  <p className="text-amber-800 mb-4">This request is awaiting your response.</p>
                  <div className="flex gap-4">
                    <button onClick={() => handleStatusUpdate('accepted')} className="btn btn-success flex-1" disabled={loading}><Check size={18} className="mr-2"/> Accept</button>
                    <button onClick={() => handleStatusUpdate('rejected')} className="btn btn-error flex-1" disabled={loading}><X size={18} className="mr-2"/> Reject</button>
                  </div>
                </div>
              ) : (
                <div className="alert alert-info"><span>This booking has already been <span className="font-bold capitalize">{booking.status}</span>.</span></div>
              )}
            </div>
          )}

          {!isProvider && (
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">Contact Information</h3>
              {canShowContact ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4"><div className="bg-slate-100 p-3 rounded-full"><Phone /></div><p className="text-slate-600">{booking.provider.phone || "Not provided"}</p></div>
                  <div className="flex items-center gap-4"><div className="bg-slate-100 p-3 rounded-full"><Mail /></div><p className="text-slate-600">{booking.provider.email}</p></div>
                </div>
              ) : (
                <div className="bg-blue-50 border-l-4 border-blue-400 text-blue-700 p-4 rounded-r-lg" role="alert">
                  <p className="font-bold">Contact Info Locked</p>
                  <p>Provider's contact details will be shared once they accept your booking request.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingDetailPage;
