const mongoose = require('mongoose');

const schemeVersionSchema = new mongoose.Schema(
  {
    schemeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Scheme',
      required: true,
      index: true,
    },
    versionNumber: {
      type: Number,
      required: true,
    },
    changesSummary: {
      type: String,
      required: true,
    },
    snapshot: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    verifiedBy: {
      type: String,
      required: true,
    },
    verifiedDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['Published', 'Archived', 'Superceded'],
      default: 'Published',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SchemeVersion', schemeVersionSchema);
