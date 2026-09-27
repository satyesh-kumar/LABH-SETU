const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const {
  uploadDocument,
  getMyDocuments,
  getDocumentById,
  reviewExtractedFields,
  getSchemeReadiness,
  deleteDocument,
} = require('../controllers/documentController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/upload', upload.single('file'), uploadDocument);
router.get('/', getMyDocuments);
router.get('/readiness/:schemeId', getSchemeReadiness);
router.get('/:id', getDocumentById);
router.patch('/:id/review', reviewExtractedFields);
router.delete('/:id', deleteDocument);

module.exports = router;
