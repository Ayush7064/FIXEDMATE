const express = require("express");
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  updateBookingStatus,
  getBookingContact,
  getBookingById,
} = require("../controllers/bookingController");

const { protect, authorizeRoles } = require("../middlewares/authMiddleware");
const { singleUpload } = require("../middlewares/multer2"); // 1. Import the multer middleware

// 2. Add the 'singleUpload' middleware to the POST route.
// It must come AFTER auth but BEFORE the controller.
router.post("/", protect, authorizeRoles("user"), singleUpload, createBooking);

// --- NO CHANGES TO OTHER ROUTES ---
router.get("/my", protect, getMyBookings);

// This is the new route you need to add
router.get("/:bookingId", protect, getBookingById);

router.put(
  "/:bookingId/status",
  protect,
  authorizeRoles("provider"),
  updateBookingStatus
);
router.get(
  "/:bookingId/contact",
  protect,
  authorizeRoles("user"),
  getBookingContact
);

module.exports = router;
