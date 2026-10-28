const express = require('express');
const router = express.Router();
const {
  getPublicData,
  recordVisit,
  submitContactMessage,
  getResumeDownload,
  downloadResumeFile,
} = require('../controllers/publicController');
const { contactLimiter } = require('../middleware/rateLimiter');
const { contactValidator } = require('../middleware/validators');

// Public endpoints
router.get('/data', getPublicData);
router.post('/visit', recordVisit);
router.post('/contact', contactLimiter, contactValidator, submitContactMessage);
router.get('/resume', getResumeDownload);
router.get('/resume/file', downloadResumeFile);

module.exports = router;
