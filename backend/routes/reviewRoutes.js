const express = require("express");
const router = express.Router();
// ✅ FIX: Import the entire controller object
const reviewController = require("../controllers/reviewController");
const { protect, authorizeRoles } = require("../middlewares/authMiddleware");

// ✅ FIX: Reference the functions from the imported object
router.post("/", protect, authorizeRoles("user"), reviewController.createReview);
router.get("/provider/:providerId", reviewController.getProviderReviews);

module.exports = router;