const Feedback = require('../models/Feedback');

const submitFeedback = async (req, res, next) => {
  try {
    const {
      rating,
      wasInformationUseful,
      wereQuestionsUnderstandable,
      foundSchemeLookingFor,
      comments,
      schemeId,
    } = req.body;

    if (!rating) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an overall experience rating.',
      });
    }

    const feedback = await Feedback.create({
      userId: req.user ? req.user.id : null,
      rating,
      wasInformationUseful: wasInformationUseful !== undefined ? wasInformationUseful : true,
      wereQuestionsUnderstandable: wereQuestionsUnderstandable !== undefined ? wereQuestionsUnderstandable : true,
      foundSchemeLookingFor: foundSchemeLookingFor !== undefined ? foundSchemeLookingFor : true,
      comments: comments || '',
      schemeId: schemeId || null,
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for your valuable feedback to improve LabhSetu.',
      feedback,
    });
  } catch (error) {
    next(error);
  }
};

const getFeedbackList = async (req, res, next) => {
  try {
    const list = await Feedback.find()
      .populate('userId', 'name email role')
      .populate('schemeId', 'name category')
      .sort('-createdAt')
      .limit(50);

    const stats = await Feedback.aggregate([
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$rating' },
          totalFeedbacks: { $sum: 1 },
          usefulCount: { $sum: { $cond: ['$wasInformationUseful', 1, 0] } },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      stats: stats[0] || { avgRating: 5, totalFeedbacks: 0, usefulCount: 0 },
      feedbacks: list,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitFeedback,
  getFeedbackList,
};
