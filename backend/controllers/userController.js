const User = require("../models/User");
const cloudinary = require('cloudinary').v2;

exports.getUserProfile = async (req, res) => {
  try {
    res.status(200).json({
      message: "User profile fetched",
      user: req.user,
    });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
};

exports.getProviderProfile = async (req, res) => {
  try {
    res.status(200).json({
      message: "Provider profile fetched",
      provider: req.user,
    });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
};




exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update text fields from the form
    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    // You can add location updates here in the same way if needed

    // Handle profile picture upload
    if (req.file) {
      // If user already has a profile picture, delete the old one from Cloudinary
      if (user.profilePic && user.profilePic.public_id) {
        await cloudinary.uploader.destroy(user.profilePic.public_id);
      }

      // Upload the new image
      const fileStr = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
      const uploadResponse = await cloudinary.uploader.upload(fileStr, {
        folder: "fixmate/user_profiles",
        resource_type: "image",
      });

      user.profilePic = {
        public_id: uploadResponse.public_id,
        url: uploadResponse.secure_url,
      };
    }

    const updatedUser = await user.save();

    // Send back the updated user object, excluding the password
    const userResponse = updatedUser.toObject();
    delete userResponse.password;

    res.status(200).json({
      message: "Profile updated successfully",
      user: userResponse,
    });

  } catch (err) {
    console.error("User profile update failed:", err);
    res.status(500).json({ message: "Server error during profile update." });
  }
};