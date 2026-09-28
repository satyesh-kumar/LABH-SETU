const Document = require('../models/Document');
const Scheme = require('../models/Scheme');
const Profile = require('../models/Profile');
const { extractDocumentData } = require('../services/ocrService');
const { calculateDocumentReadiness } = require('../services/readinessService');
const path = require('path');
const fs = require('fs');

const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a document file (PDF, JPG, JPEG, or PNG).',
      });
    }

    const { documentType, schemeId, applicationId } = req.body;
    if (!documentType) {
      return res.status(400).json({
        success: false,
        message: 'Please specify the document type (e.g. aadhaar, pan, income_certificate).',
      });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    const storageKey = req.file.filename;

    // Create document record with pending status
    const doc = await Document.create({
      userId: req.user.id,
      applicationId: applicationId || null,
      schemeId: schemeId || null,
      documentType,
      storageKey,
      fileUrl,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      fileSize: req.file.size,
      ocrStatus: 'processing',
    });

    // Run OCR / extraction
    try {
      const extracted = await extractDocumentData(req.file.path, documentType, req.file.originalname);
      doc.extractedFields = extracted;
      doc.ocrStatus = 'processed';
      doc.verificationStatus = 'pending_review';
      await doc.save();

      // Trigger user notification
      const Notification = require('../models/Notification');
      await Notification.create({
        userId: req.user.id,
        title: `Document Uploaded: ${doc.originalName}`,
        message: `Your ${doc.documentType.replace('_', ' ').toUpperCase()} was uploaded and analyzed via OCR with ${Math.round((extracted?.confidenceScore || 0.95) * 100)}% confidence.`,
        type: 'success',
        link: '/documents',
      }).catch(() => {});
    } catch (err) {
      doc.ocrStatus = 'needs_review';
      await doc.save();
    }

    res.status(201).json({
      success: true,
      message: 'Document uploaded and analyzed successfully.',
      document: doc,
    });
  } catch (error) {
    next(error);
  }
};

const getMyDocuments = async (req, res, next) => {
  try {
    const documents = await Document.find({ userId: req.user.id }).sort('-uploadedAt');
    res.status(200).json({
      success: true,
      count: documents.length,
      documents,
    });
  } catch (error) {
    next(error);
  }
};

const getDocumentById = async (req, res, next) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found.',
      });
    }

    res.status(200).json({
      success: true,
      document,
    });
  } catch (error) {
    next(error);
  }
};

// Accept or Edit extracted fields (Section 22)
const reviewExtractedFields = async (req, res, next) => {
  try {
    const { accepted, updatedFields, syncToProfile } = req.body;
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found.',
      });
    }

    if (updatedFields) {
      document.extractedFields = {
        ...document.extractedFields,
        ...updatedFields,
      };
    }

    document.userVerifiedFields = true;
    document.verificationStatus = accepted ? 'verified' : 'pending_review';
    await document.save();

    // Optionally sync verified extracted fields into citizen profile if requested
    if (syncToProfile && document.extractedFields) {
      const profileUpdates = {};
      if (document.extractedFields.name) profileUpdates.fullName = document.extractedFields.name;
      if (document.extractedFields.dateOfBirth) profileUpdates.dateOfBirth = new Date(document.extractedFields.dateOfBirth);
      if (document.extractedFields.annualIncome) profileUpdates.annualIncome = document.extractedFields.annualIncome;
      
      await Profile.findOneAndUpdate(
        { userId: req.user.id },
        { $set: profileUpdates }
      );
    }

    res.status(200).json({
      success: true,
      message: 'Extracted fields updated and verified.',
      document,
    });
  } catch (error) {
    next(error);
  }
};

const getSchemeReadiness = async (req, res, next) => {
  try {
    const { schemeId } = req.params;
    const scheme = await Scheme.findById(schemeId);
    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: 'Scheme not found.',
      });
    }

    const readiness = await calculateDocumentReadiness(req.user.id, scheme);

    res.status(200).json({
      success: true,
      schemeId: scheme._id,
      schemeName: scheme.name,
      readiness,
    });
  } catch (error) {
    next(error);
  }
};

const deleteDocument = async (req, res, next) => {
  try {
    const document = await Document.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found.',
      });
    }

    // Attempt to unlink local file if exists
    if (document.storageKey) {
      const filePath = path.join(__dirname, '../../uploads', document.storageKey);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Document removed successfully.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadDocument,
  getMyDocuments,
  getDocumentById,
  reviewExtractedFields,
  getSchemeReadiness,
  deleteDocument,
};
