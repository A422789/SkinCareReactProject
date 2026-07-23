const express = require('express');
const router = express.Router();
const {
  getSettings,
  updateSettings,
  addTestimonial,
  updateTestimonial,
  deleteTestimonial,
} = require('../controllers/settingsController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');
const { demoGuard } = require('../middleware/demoMiddleware');

// Multer fields for all possible image uploads in settings
const settingsUploadFields = upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'sec2Image', maxCount: 1 },
  { name: 'sec3Image', maxCount: 1 },
  { name: 'leftBottle', maxCount: 1 },
  { name: 'rightBottle', maxCount: 1 },
]);

// Testimonial single image upload helper
const singleTestimonialUpload = upload.single('screenshot');

// All routes are private (Admin only)
router.get('/', getSettings);
router.put('/', protect, demoGuard, settingsUploadFields, updateSettings);

// Testimonials CRUD Routes
router.post('/testimonials', protect, demoGuard, singleTestimonialUpload, addTestimonial);
router.put('/testimonials/:id', protect, demoGuard, singleTestimonialUpload, updateTestimonial);
router.delete('/testimonials/:id', protect, demoGuard, deleteTestimonial);

module.exports = router;
