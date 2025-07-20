import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useBookingStore from '../store/useBookingStore'; // 1. Import the store

// --- Icon Components for UI ---
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const WrenchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;

// --- Helper for Status Badge Styles ---
const getStatusStyles = (status) => {
  switch (status) {
    case 'pending': return 'bg-amber-100 text-amber-800';
    case 'accepted': return 'bg-blue-100 text-blue-800';
    case 'completed': return 'bg-green-100 text-green-800';
    case 'rejected': return 'bg-red-100 text-red-800';
    default: return 'bg-slate-100 text-slate-800';
  }
};

// --- Main Component ---
const ProviderBookingsPage = () => {
  // 2. Get state and actions from the store
  const { bookings, loading, error, fetchMyBookings } = useBookingStore();
  const [activeFilter, setActiveFilter] = useState('pending');

  // 3. Fetch the provider's specific bookings when the component mounts
  useEffect(() => {
    fetchMyBookings();
  }, [fetchMyBookings]);

  // 4. Filter the live data from the store
  const filteredBookings = (bookings || []).filter(booking => {
    if (activeFilter === 'all') return true;
    return booking.status === activeFilter;
  });

  const filterTabs = ['all', 'pending', 'accepted', 'completed', 'rejected'];

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 tracking-tight">Your Bookings</h1>
          <p className="text-slate-500 mt-2 text-lg">Manage all incoming service requests from clients.</p>
        </header>

        <div className="flex items-center border-b border-slate-200 mb-8">
          {filterTabs.map(tab => (
             <button
                key={tab}
                className={`px-4 py-2 -mb-px text-sm sm:text-base font-semibold border-b-2 transition-colors duration-200 capitalize ${
                  activeFilter === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-blue-600'
                }`}
                onClick={() => setActiveFilter(tab)}
              >
                {tab}
              </button>
          ))}
        </div>

        <main>
          {loading && (
            <div className="text-center py-20"><span className="loading loading-spinner text-primary loading-lg"></span></div>
          )}

          {!loading && error && (
            <div className="text-center py-20 px-6 bg-red-50 rounded-lg border-2 border-dashed border-red-200">
                <h3 className="text-xl font-semibold text-red-700">Something Went Wrong</h3>
                <p className="text-red-600 mt-2">{error}</p>
                <button onClick={fetchMyBookings} className="mt-6 inline-block bg-red-600 text-white font-semibold px-5 py-2 rounded-lg hover:bg-red-700 transition-colors">
                  Try Again
                </button>
            </div>
          )}

          {!loading && !error && (
            <>
              {filteredBookings.length > 0 ? (
                <ul className="space-y-6">
                  {filteredBookings.map((booking) => (
                    <li key={booking._id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                      <div className="p-5 sm:p-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            {/* Note: The backend must populate the 'user' field for this to work */}
                            <img src={booking.user?.profilePic?.url || `https://ui-avatars.com/api/?name=${booking.user?.name}`} alt={booking.user?.name} className="w-14 h-14 rounded-full object-cover border-2 border-white ring-2 ring-slate-100" />
                            <div>
                              <p className="font-semibold text-slate-800 text-lg">{booking.user?.name}</p>
                              <p className="text-slate-500 text-sm">{booking.user?.email}</p>
                            </div>
                          </div>
                          <div className={`px-3 py-1 text-sm font-medium rounded-full inline-block ${getStatusStyles(booking.status)}`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </div>
                        </div>
                        <div className="border-t border-dashed border-slate-200 my-5"></div>
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <CalendarIcon />
                            <p className="text-slate-700">
                              {new Date(booking.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} at {booking.time}
                            </p>
                          </div>
                          <div className="flex items-start gap-3">
                            <WrenchIcon />
                            <p className="text-slate-700">{booking.description}</p>
                          </div>
                        </div>
                         <div className="card-actions justify-end mt-4">
                            <Link to={`/booking/${booking._id}`} className="btn btn-primary btn-sm">
                                View Details & Respond
                            </Link>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-20 px-6 bg-white rounded-lg border-2 border-dashed">
                    <h3 className="text-xl font-semibold text-slate-700">No Bookings Found</h3>
                    <p className="text-slate-500 mt-2">
                      {activeFilter === 'all'
                        ? "You haven't received any bookings yet."
                        : `You don't have any bookings with the status "${activeFilter}".`
                      }
                    </p>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProviderBookingsPage;
