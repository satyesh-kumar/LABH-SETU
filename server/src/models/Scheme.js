const mongoose = require('mongoose');

const schemeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    nameHi: {
      type: String,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    ministry: {
      type: String,
      trim: true,
    },
    shortDescription: {
      type: String,
      required: true,
      trim: true,
    },
    shortDescriptionHi: {
      type: String,
      trim: true,
    },
    fullDescription: {
      type: String,
      required: true,
    },
    fullDescriptionHi: {
      type: String,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Agriculture',
        'Education',
        'Employment',
        'Health',
        'Housing',
        'Social Welfare',
        'Entrepreneurship',
        'Women & Child',
        'Financial Inclusion',
      ],
    },
    benefitType: {
      type: String,
      enum: ['Direct Cash Transfer', 'Subsidized Loan', 'Free Service', 'In-Kind Benefit', 'Training & Placement', 'Scholarship', 'Insurance'],
      default: 'Direct Cash Transfer',
    },
    benefitSummary: {
      type: String,
      required: true,
    },
    benefitSummaryHi: {
      type: String,
    },
    detailedBenefits: [
      {
        title: String,
        amount: String,
        frequency: String, // e.g. One-time, Monthly, Annual, Per Hectare
        description: String,
      },
    ],
    stateScope: {
      type: String, // 'All India' or specific state name like 'Uttar Pradesh', 'Maharashtra', 'Karnataka', etc.
      default: 'All India',
    },
    applicableDistricts: [String],
    eligibilityRules: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EligibilityRule',
      },
    ],
    requirements: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Requirement',
      },
    ],
    applicationSteps: [
      {
        stepNumber: Number,
        title: String,
        titleHi: String,
        description: String,
        descriptionHi: String,
        sourceUrl: String,
        isOnline: Boolean,
      },
    ],
    officialSources: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OfficialSource',
      },
    ],
    officialPortalUrl: {
      type: String,
    },
    verificationDate: {
      type: Date,
      default: Date.now,
    },
    verifiedBy: {
      type: String,
      default: 'Central Verification Cell',
    },
    version: {
      type: Number,
      default: 1,
    },
    status: {
      type: String,
      enum: ['published', 'draft', 'archived'],
      default: 'published',
    },
    isDemo: {
      type: Boolean,
      default: true,
    },
    tags: [String],
    viewCount: {
      type: Number,
      default: 0,
    },
    applicationCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

schemeSchema.index({ name: 'text', shortDescription: 'text', department: 'text', tags: 'text' });

module.exports = mongoose.model('Scheme', schemeSchema);
