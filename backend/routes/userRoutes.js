const express = require("express");
const router = express.Router();
const { getUserProfile ,updateUserProfile} = require("../controllers/userController");
const { protect, authorizeRoles } = require("../middlewares/authMiddleware");
const { singleUpload } = require("../middlewares/multer2");

router.get("/profile", protect, authorizeRoles("user"), getUserProfile);

router.put('/profile', protect,authorizeRoles("user"), singleUpload, updateUserProfile);

module.exports = router;
