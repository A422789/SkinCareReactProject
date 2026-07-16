const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { ThirdPartyIntegrationError } = require('../utils/customErrors');

// Cloudinary configures itself automatically using process.env.CLOUDINARY_URL
cloudinary.config();

// Store files temporarily in memory as Buffer objects
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

/**
 * Uploads a file buffer directly to Cloudinary using streams
 * @param {Buffer} fileBuffer 
 * @param {string} folder - Cloudinary folder name (default: 'products')
 * @returns {Promise<string>} The secure URL of the uploaded image
 */
const uploadToCloudinary = (fileBuffer, folder = 'products') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) {
          reject(new ThirdPartyIntegrationError(`Cloudinary Upload Failed: ${error.message}`));
        } else {
          resolve(result.secure_url);
        }
      }
    );
    uploadStream.end(fileBuffer);
  });
};

module.exports = {
  upload,
  uploadToCloudinary,
};
