const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    schemeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Scheme',
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: [
        'draft',
        'documents_prepared',
        'submitted_to_official',
        'under_review',
        'approved',
        'rejected',
        'requires_action',
      ],
      default: 'draft',
    },
    readinessScore: {
      type: Number,
      default: 0,
    },
    documents: [
      {
        documentType: String,
        documentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Document',
        },
        isReady: Boolean,
      },
    ],
    officialApplicationUrl: {
      type: String,
    },
    referenceNumber: {
      type: String, // Entered by user when submitted to official government portal
    },
    submissionDate: {
      type: Date,
    },
    userNotes: {
      type: String,
    },
    timeline: [
      {
        status: String,
        title: String,
        description: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
        source: {
          type: String,
          enum: ['USER_ENTERED', 'SYSTEM_GENERATED', 'OFFICIAL_CONFIRMATION'],
          default: 'SYSTEM_GENERATED',
        },
      },
    ],
    stepsCompleted: [Number],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Application', applicationSchema);
