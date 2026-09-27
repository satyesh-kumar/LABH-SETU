const mongoose = require('mongoose');

const officialSourceSchema = new mongoose.Schema(
  {
    schemeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Scheme',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    portalName: {
      type: String,
      trim: true,
    },
    applicationPortalUrl: {
      type: String,
      trim: true,
    },
    verifiedDate: {
      type: Date,
      default: Date.now,
    },
    verifiedBy: {
      type: String,
      default: 'Government Content Auditor',
    },
    status: {
      type: String,
      enum: ['VERIFIED', 'NEEDS_REVIEW', 'OUTDATED', 'DRAFT'],
      default: 'VERIFIED',
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('OfficialSource', officialSourceSchema);
