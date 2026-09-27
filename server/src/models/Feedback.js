const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    wasInformationUseful: {
      type: Boolean,
      required: true,
    },
    wereQuestionsUnderstandable: {
      type: Boolean,
      required: true,
    },
    foundSchemeLookingFor: {
      type: Boolean,
      required: true,
    },
    comments: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    schemeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Scheme',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Feedback', feedbackSchema);
