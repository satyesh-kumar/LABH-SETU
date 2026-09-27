const express = require('express');
const router = express.Router();
const {
  createApplication,
  getMyApplications,
  getApplicationById,
  updateApplicationStatus,
} = require('../controllers/applicationController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/', createApplication);
router.get('/', getMyApplications);
router.get('/:id', getApplicationById);
router.patch('/:id/status', updateApplicationStatus);

module.exports = router;
