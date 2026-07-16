const express = require('express');
const router = express.Router();
const { getOverview, recordVisit } = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

router.get('/overview', protect, getOverview);
router.post('/visit', recordVisit); // Public route for front-end website visitors

module.exports = router;
