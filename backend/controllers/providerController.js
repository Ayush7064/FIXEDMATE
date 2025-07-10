const ServiceProvider = require("../models/ServiceProvider");

exports.updateProviderProfile = async (req, res) => {
  const providerId = req.params.id;

  if (req.user._id.toString() !== providerId) {
    return res.status(403).json({ message: "You can only update your own profile" });
  }

  const {
    serviceType,
    description,
    profilePic,
    servicePic,
    coordinates, // [lng, lat]
  } = req.body;

  try {
    const updatedProvider = await ServiceProvider.findByIdAndUpdate(
      providerId,
      {
        serviceType,
        description,
        profilePic,
        servicePic,
        location: {
          type: "Point",
          coordinates,
        },
      },
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json({
      message: "Profile updated",
      provider: updatedProvider,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getProviderProfile = async (req, res) => {
  try {
    res.status(200).json({
      message: "Provider profile fetched",
      provider: req.user,
    });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
};
exports.getNearbyProviders = async (req, res) => {
  const { lat, lng, maxDistance = 5000 } = req.query; // in meters

  if (!lat || !lng) {
    return res.status(400).json({ message: "Latitude and longitude are required" });
  }

  try {
    const nearbyProviders = await ServiceProvider.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: parseInt(maxDistance), // default 5 km
        },
      },
    }).select("-password");

    res.status(200).json({
      count: nearbyProviders.length,
      providers: nearbyProviders,
    });
  } catch (err) {
    res.status(500).json({ message: "Error finding nearby providers", error: err.message });
  }
};



exports.getProviderById = async (req, res) => {
  try {
    const provider = await ServiceProvider.findById(req.params.id).select("-password");

    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    res.status(200).json({
      message: "Provider fetched",
      provider,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching provider", error: err.message });
  }
};
