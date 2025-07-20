const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
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
    date: {
      type: Date,
      required: [true, "Please select a booking date"],
    },
    time: {
      type: String,
      required: [true, "Please select a time slot"],
    },
    description: {
      type: String,
      required: [true, "Please describe the issue"],
    },
    // --- ADDED THIS FIELD ---
    // This will store the details of the uploaded image from Cloudinary
    issueImage: {
      public_id: {
        type: String,
        required: false, // Set to true if an image is always required
      },
      url: {
        type: String,
        required: false, // Set to true if an image is always required
      },
    },
    // -----------------------
    status: {
      type: String,
      enum: ["pending", "accepted", "in-progress", "completed", "rejected"],
      default: "pending",
    },
    contactShared: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("Booking", bookingSchema);
