const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const providerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter provider name"],
    },
    email: {
      type: String,
      required: [true, "Please enter email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please enter a password"],
    },
    phone: {
      type: String,
      required: [true, "Please enter phone number"],
    },
    serviceType: {
      type: String,
      enum: [
        "electrician",
        "plumber",
        "carpenter",
        "ac technician",
        "painter",
        "driver",
        "mechanic",
        "cleaner",
        "technician",
        "pest control",
        "appliance repair",
        "other",
      ],
      default: "other",
    },
    description: {
      type: String,
      default: "",
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
      city: {
        type: String,
        default: "",
      },
      pin: {
        type: String,
        default: "",
      },
      address: {
        type: String,
        default: "",
      },
    },
    // CORRECTED: Changed from String to an Object to store URL and public_id
    profilePic: {
      url: { type: String, default: "" },
      public_id: { type: String, default: "" }
    },
    // CORRECTED: Changed from String to an Object to store URL and public_id
    servicePic: {
      url: { type: String, default: "" },
      public_id: { type: String, default: "" }
    },
    rating: {
      type: Number,
      default: 0,
    },
    role: {
      type: String,
      default: "provider",
    },
  },
  {
    timestamps: true,
  }
);

// --- Mongoose Middleware & Methods ---

providerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

providerSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// --- Geospatial Index ---
providerSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("ServiceProvider", providerSchema);
