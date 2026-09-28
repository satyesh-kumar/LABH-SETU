const express = require('express');
const router = express.Router();
const { askAssistant, getSuggestedQuestions } = require('../controllers/assistantController');
const { optionalAuth } = require('../middleware/auth');

router.post('/query', optionalAuth, askAssistant);
router.post('/ask', optionalAuth, askAssistant);
router.get('/suggestions', getSuggestedQuestions);

module.exports = router;
