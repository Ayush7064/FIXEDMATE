const express = require("express");
const router = express.Router();
const { getUserProfile } = require("../controllers/userController");
const { protect, authorizeRoles } = require("../middlewares/authMiddleware");

router.get("/profile", protect, authorizeRoles("user"), getUserProfile);

module.exports = router;
