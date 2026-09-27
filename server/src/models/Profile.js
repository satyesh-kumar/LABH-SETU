const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    fullName: {
      type: String,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'prefer_not_to_say'],
    },
    maritalStatus: {
      type: String,
      enum: ['single', 'married', 'widowed', 'divorced'],
    },
    state: {
      type: String,
      trim: true,
    },
    district: {
      type: String,
      trim: true,
    },
    residenceType: {
      type: String,
      enum: ['rural', 'urban', 'semi-urban'],
    },
    annualIncome: {
      type: Number,
      default: 0,
    },
    occupation: {
      type: String, // e.g., 'farmer', 'student', 'self_employed', 'daily_wage', 'salaried', 'unemployed', 'artisan'
    },
    employmentStatus: {
      type: String,
      enum: ['employed', 'unemployed', 'self_employed', 'student', 'retired', 'homemaker'],
    },
    education: {
      type: String, // 'illiterate', 'primary', 'secondary', 'higher_secondary', 'graduate', 'post_graduate'
    },
    socialCategory: {
      type: String,
      enum: ['general', 'obc', 'sc', 'st', 'ews'],
    },
    disabilityStatus: {
      type: Boolean,
      default: false,
    },
    disabilityPercentage: {
      type: Number,
      default: 0,
    },
    isBPL: {
      type: Boolean,
      default: false,
    },
    isFarmer: {
      type: Boolean,
      default: false,
    },
    landHoldingHectares: {
      type: Number,
      default: 0,
    },
    isStudent: {
      type: Boolean,
      default: false,
    },
    hasBankAccount: {
      type: Boolean,
      default: true,
    },
    familyMembersCount: {
      type: Number,
      default: 1,
    },
    familyDetails: [
      {
        relationship: String,
        age: Number,
        gender: String,
        occupation: String,
      },
    ],
    verifiedDocuments: [
      {
        documentType: String,
        verified: Boolean,
        verifiedAt: Date,
        documentNumberMasked: String,
      },
    ],
    completionScore: {
      type: Number,
      default: 20, // Initial completion score
    },
  },
  { timestamps: true }
);

// Virtual age calculator if dateOfBirth is present
profileSchema.pre('save', function (next) {
  if (this.dateOfBirth) {
    const diffMs = Date.now() - new Date(this.dateOfBirth).getTime();
    const ageDt = new Date(diffMs);
    this.age = Math.abs(ageDt.getUTCFullYear() - 1970);
  }

  // Calculate profile completion score
  const fields = [
    this.fullName,
    this.dateOfBirth || this.age,
    this.gender,
    this.state,
    this.annualIncome !== undefined,
    this.occupation,
    this.education,
    this.socialCategory,
    this.residenceType,
  ];
  const filledCount = fields.filter(Boolean).length;
  this.completionScore = Math.round((filledCount / fields.length) * 100);

  next();
});

module.exports = mongoose.model('Profile', profileSchema);
