const express = require("express");
const router = express.Router();
const { protect, authorizeRoles } = require("../middlewares/authMiddleware");
const {
  getUserDashboard,
  getProviderDashboard,
} = require("../controllers/dashboardController");

router.get("/user", protect, authorizeRoles("user"), getUserDashboard);
router.get("/provider", protect, authorizeRoles("service-provider"), getProviderDashboard);

module.exports = router;
