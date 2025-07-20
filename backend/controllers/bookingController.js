const Booking = require("../models/Booking");
const cloudinary = require("cloudinary").v2;

// IMPORTANT: Configure Cloudinary in your main app file (e.g., server.js)
// with your credentials. You can get these from your Cloudinary dashboard.
// cloudinary.config({
//   cloud_name: 'YOUR_CLOUD_NAME',
//   api_key: 'YOUR_API_KEY',
//   api_secret: 'YOUR_API_SECRET',
// });


// This is the corrected createBooking function
exports.createBooking = async (req, res) => {
  // Thanks to multer, req.body will now contain the text fields
  const { date, time, description } = req.body;
  const providerId = req.query.providerId;

  if (!providerId) {
    return res.status(400).json({ message: "Provider ID is required in query params" });
  }

  try {
    const bookingPayload = {
      user: req.user._id,
      provider: providerId,
      date,
      time,
      description,
    };

    // Check if a file was uploaded (req.file is added by multer)
    if (req.file) {
      // Create a base64 string from the file buffer
      const fileStr = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

      // Upload the image to Cloudinary
      const uploadResponse = await cloudinary.uploader.upload(fileStr, {
        folder: "fixmate/bookings", // Optional: organize uploads in a folder
        resource_type: "image",
      });

      // Add image details to our payload
      bookingPayload.issueImage = {
        public_id: uploadResponse.public_id,
        url: uploadResponse.secure_url,
      };
    }

    const booking = await Booking.create(bookingPayload);

    res.status(201).json({
      message: "Booking request sent",
      booking,
    });
  } catch (err) {
    console.error("Booking creation failed:", err);
    res.status(500).json({ message: "Failed to create booking", error: err.message });
  }
};


// --- NO CHANGES NEEDED FOR OTHER CONTROLLER FUNCTIONS ---
// (getMyBookings, updateBookingStatus, etc. remain the same)

exports.getMyBookings = async (req, res) => {
  try {
    let bookings;

    if (req.role === "user") {
      bookings = await Booking.find({ user: req.user._id }).populate("provider", "-password");
    } else if (req.role === "provider") {
      bookings = await Booking.find({ provider: req.user._id }).populate("user", "-password");
    } else {
      return res.status(403).json({ message: "Invalid role" });
    }

    res.status(200).json({
      count: bookings.length,
      bookings,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching bookings", error: err.message });
  }
};

// =================================================================
// ✅ NEW CONTROLLER FUNCTION
// --- GET A SINGLE BOOKING BY ID ---
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId)
      .populate("provider", "-password") // Populate provider details
      .populate("user", "-password");     // Populate user details

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Security check: Ensure the person requesting is either the user or the provider
    const isUser = booking.user._id.toString() === req.user._id.toString();
    const isProvider = booking.provider._id.toString() === req.user._id.toString();

    if (!isUser && !isProvider) {
        return res.status(403).json({ message: "Not authorized to view this booking" });
    }

    res.status(200).json({ booking });
  } catch (err) {
    res.status(500).json({ message: "Error fetching booking details", error: err.message });
  }
};
// =================================================================

exports.updateBookingStatus = async (req, res) => {
  const { bookingId } = req.params;
  const { status } = req.body;

  const validStatuses = ["accepted", "rejected", "in-progress", "completed"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.provider.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this booking" });
    }

    booking.status = status;

    if (status === "accepted") {
      booking.contactShared = true;
    }

    await booking.save();

    res.status(200).json({
      message: "Booking status updated",
      booking,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to update booking", error: err.message });
  }
};

exports.getBookingContact = async (req, res) => {
  const { bookingId } = req.params;

  try {
    const booking = await Booking.findById(bookingId).populate("provider", "-password");

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (!booking.contactShared) {
      return res.status(403).json({ message: "Contact not available until provider accepts" });
    }

    res.status(200).json({
      providerContact: {
        name: booking.provider.name,
        phone: booking.provider.phone,
        email: booking.provider.email,
        location: booking.provider.location,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching contact", error: err.message });
  }
};
