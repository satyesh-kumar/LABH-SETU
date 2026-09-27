const express = require('express');
const router = express.Router();
const { submitFeedback, getFeedbackList } = require('../controllers/feedbackController');
const { optionalAuth, protect } = require('../middleware/auth');
const { restrictTo } = require('../middleware/rbac');

router.post('/', optionalAuth, submitFeedback);
router.get('/', protect, restrictTo('admin', 'superadmin', 'analyst'), getFeedbackList);

module.exports = router;
