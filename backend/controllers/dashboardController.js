const Booking = require("../models/Booking");
const Review = require("../models/Review");

exports.getUserDashboard = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments({ user: req.user._id });

    const statusCounts = await Booking.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const recentBookings = await Booking.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("provider", "name serviceType");

    const totalReviews = await Review.countDocuments({ user: req.user._id });

    res.status(200).json({
      totalBookings,
      statusBreakdown: statusCounts,
      recentBookings,
      totalReviews,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching user dashboard", error: err.message });
  }
};

exports.getProviderDashboard = async (req, res) => {
  try {
    const totalJobs = await Booking.countDocuments({ provider: req.user._id });
    const completedJobs = await Booking.countDocuments({
      provider: req.user._id,
      status: "completed"
    });

    const recentBookings = await Booking.find({ provider: req.user._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name");

    const reviews = await Review.find({ provider: req.user._id });
    const totalReviews = reviews.length;
    const avgRating =
      reviews.reduce((acc, r) => acc + r.rating, 0) / (totalReviews || 1);

    const statusCounts = await Booking.aggregate([
      { $match: { provider: req.user._id } },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      totalJobs,
      completedJobs,
      averageRating: avgRating.toFixed(1),
      totalReviews,
      recentBookings,
      statusBreakdown: statusCounts,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching provider dashboard", error: err.message });
  }
};
