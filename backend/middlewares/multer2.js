// File: middlewares/multer.js

const multer = require("multer");

// We will store the image in memory as a buffer before uploading it to Cloudinary
const storage = multer.memoryStorage();

// Middleware to handle a single file upload with the field name "issueImage"
// This field name MUST match the name you use in your frontend FormData
exports.singleUpload = multer({ storage }).single("issueImage");
