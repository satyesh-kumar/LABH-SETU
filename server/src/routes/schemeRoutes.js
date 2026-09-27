const express = require('express');
const router = express.Router();
const {
  getSchemes,
  getSchemeById,
  getSchemeBySlug,
  getCategories,
  compareSchemes,
} = require('../controllers/schemeController');

router.get('/', getSchemes);
router.get('/categories', getCategories);
router.post('/compare', compareSchemes);
router.get('/slug/:slug', getSchemeBySlug);
router.get('/:id', getSchemeById);

module.exports = router;
