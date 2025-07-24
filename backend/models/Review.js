// Create a new file: backend/models/Review.js

const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceProvider",
      required: true,
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      unique: true, // A user can only review a specific booking once
    },
    rating: {
      type: Number,
      required: [true, "Please provide a rating between 1 and 5"],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, "Please provide a comment for your review"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Review", reviewSchema);
