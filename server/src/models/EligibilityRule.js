const mongoose = require('mongoose');

const eligibilityRuleSchema = new mongoose.Schema(
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
    description: {
      type: String,
      trim: true,
    },
    descriptionHi: {
      type: String,
      trim: true,
    },
    field: {
      type: String,
      required: true,
      trim: true, // e.g., 'annualIncome', 'age', 'gender', 'state', 'socialCategory', 'isFarmer', 'residenceType'
    },
    operator: {
      type: String,
      required: true,
      enum: [
        'EQUALS',
        'NOT_EQUALS',
        'GREATER_THAN',
        'GREATER_THAN_OR_EQUAL',
        'LESS_THAN',
        'LESS_THAN_OR_EQUAL',
        'IN',
        'NOT_IN',
        'CONTAINS',
        'BOOLEAN_TRUE',
        'BOOLEAN_FALSE',
        'DATE_BEFORE',
        'DATE_AFTER',
      ],
    },
    value: {
      type: mongoose.Schema.Types.Mixed, // Can be number, string, boolean, array
      required: false,
    },
    isMandatory: {
      type: Boolean,
      default: true,
    },
    missingInfoPrompt: {
      type: String, // Question to ask if this field is missing in citizen profile
    },
    missingInfoPromptHi: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('EligibilityRule', eligibilityRuleSchema);
