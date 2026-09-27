const express = require('express');
const router = express.Router();
const {
  checkEligibility,
  evaluateSpecificScheme,
  getAdaptiveQuestions,
} = require('../controllers/eligibilityController');
const { optionalAuth } = require('../middleware/auth');

router.post('/check', optionalAuth, checkEligibility);
router.post('/scheme/:schemeId', optionalAuth, evaluateSpecificScheme);
router.get('/questions', optionalAuth, getAdaptiveQuestions);

module.exports = router;
