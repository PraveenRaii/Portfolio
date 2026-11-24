const express = require('express');
const router = express.Router();
const {
  getStatus,
  getVoices,
  speakText,
  askPortfolioAssistant,
} = require('../controllers/voiceController');

// Public endpoints for portfolio visitors
router.get('/status', getStatus);
router.get('/voices', getVoices);
router.post('/speak', speakText);
router.post('/ask', askPortfolioAssistant);

module.exports = router;
