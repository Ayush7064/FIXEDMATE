const express = require("express");
const router = express.Router();

const {
  updateProviderProfile,
  getLoggedInProviderProfile,
  getNearbyProviders,
  getProviderById,
} = require("../controllers/providerController");
const upload = require("../middlewares/multer");

const { protect, authorizeRoles } = require("../middlewares/authMiddleware");

// 🔄 Update provider profile (only the owner can do this)
router.patch(
  "/profile",
  protect,
  authorizeRoles("provider"),
  // ✅ CHANGED: Use .fields() to accept two different image files
  upload.fields([
    { name: "profilePic", maxCount: 1 },
    { name: "servicePic", maxCount: 1 },
  ]),
  
  updateProviderProfile
);

// ✅ Get logged-in provider profile using token
router.get(
  "/me",
  protect,
  authorizeRoles("provider"),
  getLoggedInProviderProfile
);

// ✅ Get nearby providers based on location query params
router.get("/nearby", getNearbyProviders);

// ✅ Get specific provider by ID (no auth required)
router.get("/:id", getProviderById);

module.exports = router;
