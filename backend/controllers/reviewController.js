/* eslint-disable */

// =================================================================
// 1. Create a new file: backend/controllers/reviewController.js
// =================================================================
const Review = require('../models/Review');
const Booking = require('../models/Booking');
const ServiceProvider = require('../models/ServiceProvider');

// --- Define controller functions ---

const createReview = async (req, res) => {
  const { bookingId, rating, comment } = req.body;
  const userId = req.user._id;

  try {
    const booking = await Booking.findById(bookingId);

    // 1. Validations
    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }
    if (booking.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "You can only review your own bookings." });
    }
    const existingReview = await Review.findOne({ booking: bookingId });
    if (existingReview) {
      return res.status(400).json({ message: "You have already reviewed this booking." });
    }

    // 2. Create and save the new review
    const review = await Review.create({
      user: userId,
      provider: booking.provider,
      booking: bookingId,
      rating,
      comment,
    });

    // 3. Update the provider's average rating
    const providerReviews = await Review.find({ provider: booking.provider });
    const totalRating = providerReviews.reduce((acc, item) => item.rating + acc, 0);
    const averageRating = totalRating / providerReviews.length;

    await ServiceProvider.findByIdAndUpdate(booking.provider, {
      rating: averageRating.toFixed(1), // Keep one decimal place
    });

    res.status(201).json({ message: "Review submitted successfully", review });

  } catch (err) {
    console.error("Create Review Error:", err);
    res.status(500).json({ message: "Server error while creating review." });
  }
};

const getProviderReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ provider: req.params.providerId })
            .populate('user', 'name profilePic') // Get user's name and picture
            .sort({ createdAt: -1 }); // Show newest reviews first

        res.status(200).json({
            count: reviews.length,
            reviews,
        });
    } catch (err) {
        console.error("Get Reviews Error:", err);
        res.status(500).json({ message: "Server error while fetching reviews." });
    }
};

// --- Export all functions in a single object ---
module.exports = {
    createReview,
    getProviderReviews,
};

