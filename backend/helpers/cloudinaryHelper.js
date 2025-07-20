const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// Configure Cloudinary with your credentials
// Make sure to set these environment variables in a .env file
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadToCloudinary = (filePath, folder) => {
  return new Promise((resolve, reject) => {
    // filePath is the path to the temporary file stored by multer
    cloudinary.uploader.upload(filePath, { folder: folder }, (error, result) => {
      // After upload, delete the temporary file from the server
      fs.unlinkSync(filePath);
      
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

module.exports = { uploadToCloudinary };
