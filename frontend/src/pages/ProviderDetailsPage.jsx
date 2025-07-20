import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Tab } from "@headlessui/react";
import useProviderStore from "../store/useProviderStore";
import useBookingStore from "../store/useBookingStore";
import { toast } from 'react-toastify'; // For better notifications

const ServiceProviderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { fetchProviderById, selectedProvider, loading: providerLoading, error: providerError } = useProviderStore();
  const { createBooking, loading: bookingLoading, error: bookingError, success: bookingSuccess, resetBookingState } = useBookingStore();

  const [dateTime, setDateTime] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);

  useEffect(() => {
    fetchProviderById(id);
    return () => {
      resetBookingState();
    };
  }, [id, fetchProviderById, resetBookingState]);

  useEffect(() => {
    if (bookingSuccess) {
      // Using toast for a better user experience than alert()
      //toast.success("Booking request sent successfully!");
      navigate('/my-bookings');
    }
    if (bookingError) {
        toast.error(bookingError);
    }
  }, [bookingSuccess, bookingError, navigate]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    if (!dateTime || !description) {
      toast.warn("Please select a date, time, and provide a description.");
      return;
    }

    const formData = new FormData();
    const [datePart, timePart] = dateTime.split('T');

    formData.append('date', datePart);
    formData.append('time', timePart);
    formData.append('description', description);
    if (image) {
      formData.append('issueImage', image);
    }
    
    await createBooking(formData, id);
  };

  if (providerLoading) {
    return (
      <div className="flex justify-center items-center h-[200px] w-full">
        <span className="loading loading-dots loading-lg"></span>
      </div>
    );
  }

  if (providerError || !selectedProvider) {
    return <p className="text-center text-red-500 py-10">Failed to load provider details.</p>;
  }

  const provider = selectedProvider;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="flex items-center gap-6">
            <img
              src={provider.profilePic?.url || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
              alt={provider.name}
              className="w-24 h-24 rounded-full object-cover border"
            />
            <div>
              <h2 className="text-xl font-bold">{provider.name}</h2>
              <p className="text-blue-600 capitalize">{provider.serviceType}</p>
              <p className="text-gray-500 text-sm">Rating: {provider.rating || 0} ★</p>
              <p className="text-gray-400 text-sm">{provider.email}</p>
            </div>
          </div>
          
          <Tab.Group>
            <Tab.List className="flex space-x-6 border-b mt-8">
              {["Services", "Reviews", "About"].map((tab) => (
                <Tab
                  key={tab}
                  className={({ selected }) => `py-2 font-medium border-b-2 transition ${selected ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500"}`}
                >
                  {tab}
                </Tab>
              ))}
            </Tab.List>
            <Tab.Panels className="mt-4">
              <Tab.Panel>
                <ul className="space-y-4">
                  <li className="bg-blue-50 p-4 rounded border border-blue-100">
                    <h4 className="font-semibold text-blue-700">Main Service</h4>
                    <p className="text-sm text-gray-600 mt-1">{provider.serviceType.charAt(0).toUpperCase() + provider.serviceType.slice(1)}</p>
                  </li>
                  <li className="bg-blue-50 p-4 rounded border border-blue-100">
                    <h4 className="font-semibold text-blue-700">Location</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {provider.location?.address || "No address provided."}<br />
                      {provider.location?.city}, PIN: {provider.location?.pin}
                    </p>
                  </li>
                </ul>
              </Tab.Panel>
              <Tab.Panel>
                <p className="text-gray-600 text-sm">No reviews yet.</p>
              </Tab.Panel>
              <Tab.Panel>
                <p className="text-gray-700 leading-relaxed">{provider.description || "No about info provided."}</p>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>

        <div className="bg-base-100 shadow-xl border rounded-2xl p-6 space-y-5">
          <h3 className="text-xl font-semibold text-gray-800">📅 Book Service</h3>
          <form onSubmit={handleBookingSubmit} className="space-y-4">
            <div>
              <label className="label"><span className="label-text text-sm font-medium text-gray-600">Date & Time</span></label>
              <input
                type="datetime-local"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                className="input input-bordered w-full border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                required
              />
            </div>
            <div>
              <label className="label"><span className="label-text text-sm font-medium text-gray-600">Problem Description</span></label>
              <textarea
                className="textarea textarea-bordered w-full border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                rows={4}
                placeholder="Describe the issue you're facing..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>
            <div>
              <label className="label"><span className="label-text text-sm font-medium text-gray-600">Upload Image (Optional)</span></label>
              <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
                className="file-input file-input-bordered w-full"
                accept="image/*"
              />
            </div>
            <button type="submit" className="btn btn-info bg-blue-500 hover:bg-blue-600 text-white w-full p-2 rounded-lg" disabled={bookingLoading}>
              {bookingLoading ? 'Submitting...' : 'Submit Booking Request'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ServiceProviderDetail;
