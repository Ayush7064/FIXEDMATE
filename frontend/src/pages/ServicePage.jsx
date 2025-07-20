import React, { useEffect, useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import useProviderStore from '../store/useProviderStore';
import ErrorMessage from '../components/ErrorMessage';
import { Link } from 'react-router-dom'; // ⬅️ Add at top


const ServicePage = () => {
  const {
    fetchProvidersWithGeo,
    providers,
    filterProviders,
    allProviders,
    loading,
    error,
  } = useProviderStore();

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [minRating, setMinRating] = useState(0);

  // ✅ Fetch providers using geolocation on initial load
  useEffect(() => {
    fetchProvidersWithGeo();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ Filter providers whenever filters change
  useEffect(() => {
    filterProviders(selectedCategory, minRating);
  }, [selectedCategory, minRating, filterProviders]);

  const handleRefresh = () => {
    fetchProvidersWithGeo(); // 🔄 Manual refresh
  };
  

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[200px] w-full">
        <span className="loading loading-dots loading-xs mr-1"></span>
        <span className="loading loading-dots loading-sm mr-1"></span>
        <span className="loading loading-dots loading-md mr-1"></span>
        <span className="loading loading-dots loading-lg mr-1"></span>
        <span className="loading loading-dots loading-xl"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <ErrorMessage />
      </div>
    );
  }

  const serviceTypes = [...new Set(allProviders.map((p) => p.serviceType))];

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
      
      <div className="flex flex-row justify-between items-center mb-8">
        <motion.h1
          className="text-2xl sm:text-3xl font-semibold"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Find Local Service Providers
        </motion.h1>

        <button
          className="btn btn-sm btn-outline text-blue-600 border-blue-400 hover:bg-blue-100"
          onClick={handleRefresh}
        >
          🔄 Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center">
        <select
          className="select select-info"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          {serviceTypes.map((type) => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>

        <select
          className="select select-info"
          value={minRating}
          onChange={(e) => setMinRating(parseFloat(e.target.value))}
        >
          <option value={0}>All Ratings</option>
          <option value={1}>1★ & up</option>
          <option value={2}>2★ & up</option>
          <option value={3}>3★ & up</option>
          <option value={4}>4★ & up</option>
        </select>
      </div>

      {/* Providers List */}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full p-4">
  {providers.map((provider) => (
    <Link to={`/provider/${provider._id}`} key={provider._id}>
      <motion.div
        className="bg-white rounded-lg overflow-hidden gap-12 w-90 h-96 transition-transform duration-300 hover:shadow-lg hover:scale-[1.02]"
        whileHover={{ scale: 1.02 }}
      >
        <div className="relative w-full h-70 group rounded-t-lg overflow-hidden">
          <img
            src={provider.servicePic?.url || provider.servicePic || 'https://via.placeholder.com'}
            alt={provider.name}
            className="w-full h-full object-cover transition duration-300"
          />
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 truncate">
            {provider.name}
          </h3>
          <p className="text-sm text-blue-600 capitalize">
            {provider.serviceType || 'Service'}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            ⭐ {provider.rating?.toFixed(1) || 0} • {provider.distanceInKm} km away
          </p>
        </div>
      </motion.div>
    </Link>
  ))}
</div>

    </div>
  );
};

export default ServicePage;
