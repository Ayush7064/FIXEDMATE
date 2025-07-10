const express = require("express");
const router = express.Router();
const { protect, authorizeRoles } = require("../middlewares/authMiddleware");
const {
  submitReview,
  getProviderReviews,
} = require("../controllers/reviewController");

router.post("/", protect, authorizeRoles("user"), submitReview);
router.get("/:providerId", getProviderReviews);

module.exports = router;
