const Booking = require("../models/Booking");
const cloudinary = require("cloudinary").v2;


// --- createBooking (with Enhanced Debugging & Robustness) ---
exports.createBooking = async (req, res) => {
  const { date, time, description } = req.body;
  const providerId = req.query.providerId;
  const { io, getUserSocket } = req;

  try {
    const bookingPayload = {
      user: req.user._id,
      provider: providerId,
      date,
      time,
      description,
      // ... your image upload logic ...
    };
    
    let booking = await Booking.create(bookingPayload);
    
    // ✅ FIX: Populate user details to send a complete object in the notification
    booking = await booking.populate('user', 'name profilePic');

    // --- REAL-TIME LOGIC ---
    console.log(`--- New Booking Created ---`);
    console.log(`Attempting to notify provider with ID: ${providerId}`);
    
    const providerSocketId = getUserSocket(providerId.toString());
    
    console.log(`Is provider online? Socket ID: ${providerSocketId}`);
    
    if (providerSocketId) {
      console.log(`✅ Emitting 'newBookingRequest' to provider at socket ${providerSocketId}`);
      io.to(providerSocketId).emit("newBookingRequest", booking);
    } else {
      console.log(`❌ Provider with ID ${providerId} is not online. No notification sent.`);
    }
    console.log(`--------------------------`);

    res.status(201).json({
      message: "Booking request sent",
      booking,
    });
  } catch (err) {
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


// --- updateBookingStatus (with Enhanced Debugging & Robustness) ---
exports.updateBookingStatus = async (req, res) => {
  const { bookingId } = req.params;
  const { status } = req.body;
  const { io, getUserSocket } = req;

  try {
    let booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    
    // ... (your existing authorization and update logic) ...
    booking.status = status;
    if (status === "accepted") {
      booking.contactShared = true;
    }
    
    let updatedBooking = await booking.save();

    // ✅ FIX: Populate provider details to send a complete object in the notification
    updatedBooking = await updatedBooking.populate('provider', 'name profilePic');

    // --- REAL-TIME LOGIC ---
    const userIdToNotify = updatedBooking.user.toString();
    console.log(`--- Booking Status Updated ---`);
    console.log(`Attempting to notify user with ID: ${userIdToNotify}`);

    const userSocketId = getUserSocket(userIdToNotify);
    
    console.log(`Is user online? Socket ID: ${userSocketId}`);

    if (userSocketId) {
      console.log(`✅ Emitting 'bookingStatusUpdate' to user at socket ${userSocketId}`);
      io.to(userSocketId).emit("bookingStatusUpdate", updatedBooking);
    } else {
      console.log(`❌ User with ID ${userIdToNotify} is not online. No notification sent.`);
    }
    console.log(`---------------------------`);

    res.status(200).json({
      message: "Booking status updated",
      booking: updatedBooking,
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
