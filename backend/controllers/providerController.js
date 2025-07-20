const ServiceProvider = require("../models/ServiceProvider");


exports.updateProviderProfile = async (req, res) => {
  try {
    const {
      id,
      serviceType,
      description,
      city,
      pin,
      address,
      coordinates, // stringified in frontend
    } = req.body;

    if (req.user._id.toString() !== id) {
      return res
        .status(403)
        .json({ message: "You can only update your own profile" });
    }

    // Parse coordinates safely
    let parsedCoordinates = [0, 0];
    try {
      parsedCoordinates = JSON.parse(coordinates);
    } catch (e) {
      return res.status(400).json({ message: "Invalid coordinates format" });
    }

    const updateData = {
      serviceType,
      description,
      location: {
        type: "Point",
        coordinates: parsedCoordinates,
        city,
        pin,
        address,
      },
    };

    // ✅ Use req.files to handle multiple, named file uploads
   // Handle Profile Picture
      if (req.files && req.files.profilePic) {
      const profilePicFile = req.files.profilePic[0];
     updateData.profilePic = {
      url: profilePicFile.path,
      public_id: profilePicFile.filename,
     };
    }
    // Handle uploaded image
    if (req.file && req.file.path && req.file.filename) {
      updateData.servicePic = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }

    const updatedProvider = await ServiceProvider.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    return res.status(200).json({
      message: "Profile updated",
      provider: updatedProvider,
    });
  } catch (err) {
    console.error("Update Profile Error:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};



// ✅ Route to get provider profile by token
exports.getLoggedInProviderProfile = async (req, res) => {
  try {
    res.status(200).json({
      message: "Provider profile fetched",
      provider: req.user,
    });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
};
// ✅ Route to get a specific provider by ID
exports.getProviderById = async (req, res) => {
  try {
    const provider = await ServiceProvider.findById(req.params.id).select("-password");
    if (!provider) return res.status(404).json({ message: "Provider not found" });

    res.status(200).json({
      message: "Provider profile fetched",
      provider,
    });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
};
exports.getNearbyProviders = async (req, res) => {
  const { lat, lng, maxDistance = 5000 } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ message: "Latitude and longitude are required" });
  }

  try {
    const providers = await ServiceProvider.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          distanceField: "distanceInMeters",
          spherical: true,
          maxDistance: parseInt(maxDistance),
        },
      },
      {
        $addFields: {
          distanceInKm: {
            $round: [{ $divide: ["$distanceInMeters", 1000] }, 2], // ✅ convert to km, round to 2 decimals
          },
        },
      },
      {
        $project: {
          password: 0,
          distanceInMeters: 0, // remove raw meters from final output
        },
      },
    ]);

    res.status(200).json({
      count: providers.length,
      providers,
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
