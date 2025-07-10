const Booking = require("../models/Booking");


exports.createBooking = async (req, res) => {
  const { date, time, description } = req.body;
  const providerId = req.query.providerId;

  if (!providerId) {
    return res.status(400).json({ message: "Provider ID is required in query params" });
  }

  try {
    const booking = await Booking.create({
      user: req.user._id,
      provider: providerId,
      date,
      time,
      description,
    });

    res.status(201).json({
      message: "Booking request sent",
      booking,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to create booking", error: err.message });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    let bookings;

    if (req.role === "user") {
      bookings = await Booking.find({ user: req.user._id }).populate("provider", "-password");
    } else if (req.role === "service-provider") {
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

    // Only provider who owns the booking can update it
    if (booking.provider.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this booking" });
    }

    booking.status = status;

    // Share contact only if accepted
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

    // Only the user who made the booking can view contact
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
