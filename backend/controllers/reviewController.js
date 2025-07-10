const Review = require("../models/Review");
const Booking = require("../models/Booking");

// ✅ Submit Review (User only)
exports.submitReview = async (req, res) => {
  const { providerId, rating, comment } = req.body;

  try {
    // Ensure booking is completed
    const booking = await Booking.findOne({
      user: req.user._id,
      provider: providerId,
      status: "completed",
    });

    if (!booking) {
      return res.status(400).json({ message: "You can only review after completing a booking" });
    }

    // Check if already reviewed
    const existing = await Review.findOne({
      user: req.user._id,
      provider: providerId,
    });

    if (existing) {
      return res.status(400).json({ message: "You have already reviewed this provider" });
    }

    const review = await Review.create({
      user: req.user._id,
      provider: providerId,
      rating,
      comment,
    });

    res.status(201).json({ message: "Review submitted", review });
  } catch (err) {
    res.status(500).json({ message: "Failed to submit review", error: err.message });
  }
};

// ✅ Get All Reviews for Provider
exports.getProviderReviews = async (req, res) => {
  const providerId = req.params.providerId;

  try {
    const reviews = await Review.find({ provider: providerId })
      .populate("user", "name");

    const avgRating =
      reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1);

    res.status(200).json({
      averageRating: avgRating.toFixed(1),
      totalReviews: reviews.length,
      reviews,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching reviews", error: err.message });
  }
};
