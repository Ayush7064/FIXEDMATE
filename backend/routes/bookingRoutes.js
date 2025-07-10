const express = require("express");
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  updateBookingStatus,
} = require("../controllers/bookingController");

const { getBookingContact } = require("../controllers/bookingController");

const { protect, authorizeRoles } = require("../middlewares/authMiddleware");

router.post("/", protect, authorizeRoles("user"), createBooking);
router.get("/my", protect, getMyBookings);
router.put(
  "/:bookingId/status",
  protect,
  authorizeRoles("service-provider"),
  updateBookingStatus
);

router.get(
  "/:bookingId/contact",
  protect,
  authorizeRoles("user"),
  getBookingContact
);

module.exports = router;
