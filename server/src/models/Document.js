const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
    },
    schemeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Scheme',
    },
    documentType: {
      type: String,
      required: true,
      enum: [
        'aadhaar',
        'pan',
        'income_certificate',
        'caste_certificate',
        'residence_certificate',
        'ration_card',
        'bank_passbook',
        'disability_certificate',
        'land_record',
        'student_id',
        'age_proof',
        'other',
      ],
    },
    storageKey: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    ocrStatus: {
      type: String,
      enum: ['pending', 'processing', 'processed', 'needs_review', 'verified', 'failed'],
      default: 'pending',
    },
    verificationStatus: {
      type: String,
      enum: ['unverified', 'pending_review', 'verified', 'rejected'],
      default: 'unverified',
    },
    extractedFields: {
      name: String,
      dateOfBirth: String,
      gender: String,
      documentNumber: String,
      maskedDocumentNumber: String,
      address: String,
      issuedDate: String,
      validUntil: String,
      annualIncome: Number,
      issuingAuthority: String,
      confidenceScore: {
        type: Number,
        default: 0.95,
      },
      rawText: String,
    },
    userVerifiedFields: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Document', documentSchema);
