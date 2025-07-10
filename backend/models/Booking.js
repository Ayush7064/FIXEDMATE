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
    timestamps: true,
  }
);

module.exports = mongoose.model("Booking", bookingSchema);
