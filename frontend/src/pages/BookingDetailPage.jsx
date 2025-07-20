import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import useBookingStore from "../store/useBookingStore";

// --- Helper Components for Icons ---
const CalendarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);
const WrenchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);
const PhoneIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
    />
  </svg>
);
const MailIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

// --- Booking Progress Component ---
const BookingProgress = ({ status }) => {
  const statuses = ["pending", "accepted", "in-progress", "completed"];
  const currentStatusIndex = statuses.indexOf(status);
  const progressPercentage =
    status === "rejected"
      ? 0
      : ((currentStatusIndex + 1) / statuses.length) * 100;

  let progressColor = "progress-info";
  if (status === "completed") progressColor = "progress-success";
  if (status === "rejected") progressColor = "progress-error";

  return (
    <div className="my-6">
      <h3 className="font-semibold text-slate-800 mb-2">Booking Progress</h3>
      <progress
        className={`progress ${progressColor} w-full rounded-full shadow-inner [&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-value]:rounded-full`}
        value={progressPercentage}
        max="100"
      />

      <div className="flex justify-between text-xs text-slate-500 mt-1">
        {statuses.map((s) => (
          <span key={s} className="capitalize">
            {s}
          </span>
        ))}
      </div>
    </div>
  );
};

const BookingDetailPage = () => {
  const { bookingId } = useParams();
  const { selectedBooking, loading, error, fetchBookingById } =
    useBookingStore();

  useEffect(() => {
    if (bookingId) {
      fetchBookingById(bookingId);
    }
  }, [bookingId, fetchBookingById]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner text-primary loading-lg"></span>
      </div>
    );
  }

  if (error || !selectedBooking) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold text-red-600">Error</h2>
        <p className="text-slate-500 mt-2">{error || "Booking not found."}</p>
        <Link to="/my-bookings" className="btn btn-primary mt-6">
          Go Back to Bookings
        </Link>
      </div>
    );
  }

  const booking = selectedBooking;
  const canShowContact = ["accepted", "in-progress", "completed"].includes(
    booking.status
  );

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      <div className="max-w-4xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        

        {/* Header */}
        <header className="mb-4">
          <h1 className="text-4xl font-bold text-slate-800">Booking Details</h1>
          <p className="text-slate-400 mt-1">Booking ID: #{booking._id}</p>
        </header>

        <div className="bg-white p-6 sm:p-8 rounded-5xl shadow-sm border border-slate-200">
          <BookingProgress status={booking.status} />

          {/* Booking Info Section */}
          <div className="space-y-6 mt-8">
            <div className="flex items-start rounded-2xl gap-4">
              <div className="bg-slate-100 p-3 rounded-full">
                <WrenchIcon />
              </div>
              <div>
                <p className="font-semibold text-slate-800">Service Request</p>
                <p className="text-slate-600">{booking.description}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-slate-100 p-3 rounded-full">
                <CalendarIcon />
              </div>
              <div>
                <p className="font-semibold text-slate-800">Date & Time</p>
                <p className="text-slate-600">
                  {new Date(booking.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}{" "}
                  at {booking.time}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <img
                src={
                  booking.provider.profilePic?.url ||
                  "https://placehold.co/100x100/E2E8F0/4A5568?text=??"
                }
                alt={booking.provider.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold text-slate-800">Service Provider</p>
                <p className="text-slate-600">{booking.provider.name}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-dashed border-slate-200 my-8"></div>

          {/* Contact Information Section */}
          <div>
            <h3 className="text-xl font-bold text-slate-800 mb-4">
              Contact Information
            </h3>
            {canShowContact ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="bg-slate-100 p-3 rounded-full">
                    <PhoneIcon />
                  </div>
                  <p className="text-slate-600">
                    {booking.provider.phone || "Not provided"}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-slate-100 p-3 rounded-full">
                    <MailIcon />
                  </div>
                  <p className="text-slate-600">{booking.provider.email}</p>
                </div>
              </div>
            ) : (
              <div
                className="bg-blue-50 border-l-4 border-blue-400 text-blue-700 p-4 rounded-r-lg"
                role="alert"
              >
                <p className="font-bold">Contact Info Locked</p>
                <p>
                  Provider's contact details will be shared once they accept
                  your booking request.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailPage;
