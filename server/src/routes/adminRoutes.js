const express = require('express');
const router = express.Router();
const {
  getDashboardMetrics,
  createScheme,
  updateScheme,
  deleteScheme,
  addRuleToScheme,
  deleteRule,
  addRequirementToScheme,
  getAuditLogs,
} = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { restrictTo } = require('../middleware/rbac');

// All admin routes require authentication and admin/superadmin role
router.use(protect);
router.use(restrictTo('admin', 'superadmin', 'analyst'));

router.get('/metrics', getDashboardMetrics);
router.get('/audit-logs', getAuditLogs);

// Scheme management
router.post('/schemes', restrictTo('admin', 'superadmin'), createScheme);
router.put('/schemes/:id', restrictTo('admin', 'superadmin'), updateScheme);
router.delete('/schemes/:id', restrictTo('admin', 'superadmin'), deleteScheme);

// Rules management
router.post('/schemes/:schemeId/rules', restrictTo('admin', 'superadmin'), addRuleToScheme);
router.delete('/rules/:ruleId', restrictTo('admin', 'superadmin'), deleteRule);

// Requirements management
router.post('/schemes/:schemeId/requirements', restrictTo('admin', 'superadmin'), addRequirementToScheme);

module.exports = router;
