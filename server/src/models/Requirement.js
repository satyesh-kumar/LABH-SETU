const mongoose = require('mongoose');

const requirementSchema = new mongoose.Schema(
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
    titleHi: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: ['document', 'condition', 'information'],
      default: 'document',
    },
    documentType: {
      type: String,
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
      default: 'other',
    },
    description: {
      type: String,
      trim: true,
    },
    descriptionHi: {
      type: String,
      trim: true,
    },
    isMandatory: {
      type: Boolean,
      default: true,
    },
    helpText: {
      type: String,
    },
    helpTextHi: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Requirement', requirementSchema);
