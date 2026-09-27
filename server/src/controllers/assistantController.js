const { answerUserQuery } = require('../services/ragAssistantService');
const Profile = require('../models/Profile');

const askAssistant = async (req, res, next) => {
  try {
    const { query, language = 'en', schemeContextId } = req.body;

    if (!query || !query.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a question or search query.',
      });
    }

    let userProfile = null;
    if (req.user) {
      userProfile = await Profile.findOne({ userId: req.user.id });
    }

    const response = await answerUserQuery({
      query,
      language: req.user ? req.user.preferredLanguage || language : language,
      profile: userProfile,
      schemeContextId,
    });

    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

const getSuggestedQuestions = (req, res) => {
  const isHindi = req.query.lang === 'hi';
  const suggestions = isHindi
    ? [
        'मेरे लिए कौन सी सरकारी योजनाएं उपयुक्त हैं?',
        'पीएम किसान सम्मान निधि के लिए क्या शर्तें हैं?',
        'आवेदन करने के लिए कौन से दस्तावेज़ तैयार रखने होंगे?',
        'पात्रता जांचने का सही तरीका क्या है?',
      ]
    : [
        'Which government schemes may be relevant to me?',
        'What are the eligibility conditions for PM-KISAN?',
        'Which documents do I need to apply for housing schemes?',
        'How does LabhSetu evaluate scheme eligibility?',
      ];

  res.status(200).json({
    success: true,
    suggestions,
  });
};

module.exports = {
  askAssistant,
  getSuggestedQuestions,
};
