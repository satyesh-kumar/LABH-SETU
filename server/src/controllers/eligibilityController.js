const Scheme = require('../models/Scheme');
const Profile = require('../models/Profile');
const { evaluateSchemeEligibility, STATUSES } = require('../services/eligibilityEngine');

const checkEligibility = async (req, res, next) => {
  try {
    let profileData = null;

    // Use logged in user profile if available, or payload if guest/assisted mode
    if (req.user) {
      const userProfile = await Profile.findOne({ userId: req.user.id });
      profileData = userProfile ? userProfile.toObject() : {};
    }

    if (req.body.profile) {
      profileData = { ...profileData, ...req.body.profile };
    }

    if (!profileData) {
      return res.status(400).json({
        success: false,
        message: 'Citizen profile information is required for eligibility screening.',
      });
    }

    // Fetch all published schemes with populated rules and requirements
    const schemes = await Scheme.find({ status: 'published' })
      .populate('eligibilityRules')
      .populate('requirements')
      .populate('officialSources');

    const evaluations = schemes.map(scheme => evaluateSchemeEligibility(scheme, profileData));

    // Sort by match score descending
    evaluations.sort((a, b) => b.matchScore - a.matchScore);

    const potentiallyEligible = evaluations.filter(e => e.status === STATUSES.POTENTIALLY_ELIGIBLE);
    const needsVerification = evaluations.filter(e => e.status === STATUSES.NEEDS_VERIFICATION);
    const insufficientData = evaluations.filter(e => e.status === STATUSES.INSUFFICIENT_DATA);
    const notEligible = evaluations.filter(e => e.status === STATUSES.NOT_CURRENTLY_ELIGIBLE);

    res.status(200).json({
      success: true,
      totalEvaluated: evaluations.length,
      counts: {
        potentiallyEligible: potentiallyEligible.length,
        needsVerification: needsVerification.length,
        insufficientData: insufficientData.length,
        notEligible: notEligible.length,
      },
      results: {
        potentiallyEligible,
        needsVerification,
        insufficientData,
        notEligible,
      },
      allResults: evaluations,
    });
  } catch (error) {
    next(error);
  }
};

const evaluateSpecificScheme = async (req, res, next) => {
  try {
    const { schemeId } = req.params;
    let profileData = null;

    if (req.user) {
      const userProfile = await Profile.findOne({ userId: req.user.id });
      profileData = userProfile ? userProfile.toObject() : {};
    }

    if (req.body.profile) {
      profileData = { ...profileData, ...req.body.profile };
    }

    const scheme = await Scheme.findById(schemeId)
      .populate('eligibilityRules')
      .populate('requirements')
      .populate('officialSources');

    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: 'Scheme not found.',
      });
    }

    const evaluation = evaluateSchemeEligibility(scheme, profileData || {});

    res.status(200).json({
      success: true,
      evaluation,
    });
  } catch (error) {
    next(error);
  }
};

const getAdaptiveQuestions = async (req, res, next) => {
  try {
    let profile = {};
    if (req.user) {
      const userProfile = await Profile.findOne({ userId: req.user.id });
      if (userProfile) profile = userProfile.toObject();
    }

    // Standard adaptive question list with priority weighting
    const coreQuestions = [
      {
        field: 'dateOfBirth',
        label: 'Date of Birth (or Age)',
        labelHi: 'जन्म तिथि (या आयु)',
        type: 'date',
        isAnswered: Boolean(profile.dateOfBirth || profile.age),
        category: 'Personal',
      },
      {
        field: 'gender',
        label: 'Gender',
        labelHi: 'लिंग',
        type: 'select',
        options: ['male', 'female', 'other'],
        isAnswered: Boolean(profile.gender),
        category: 'Personal',
      },
      {
        field: 'state',
        label: 'State of Residence',
        labelHi: 'निवास का राज्य',
        type: 'select',
        options: [
          'All India',
          'Andhra Pradesh',
          'Bihar',
          'Delhi',
          'Gujarat',
          'Haryana',
          'Karnataka',
          'Madhya Pradesh',
          'Maharashtra',
          'Punjab',
          'Rajasthan',
          'Tamil Nadu',
          'Telangana',
          'Uttar Pradesh',
          'West Bengal',
        ],
        isAnswered: Boolean(profile.state),
        category: 'Residence',
      },
      {
        field: 'residenceType',
        label: 'Residence Area Type',
        labelHi: 'निवास क्षेत्र प्रकार',
        type: 'select',
        options: ['rural', 'urban', 'semi-urban'],
        isAnswered: Boolean(profile.residenceType),
        category: 'Residence',
      },
      {
        field: 'annualIncome',
        label: 'Annual Household Income (₹)',
        labelHi: 'वार्षिक पारिवारिक आय (₹)',
        type: 'number',
        isAnswered: profile.annualIncome !== undefined && profile.annualIncome !== null,
        category: 'Income',
      },
      {
        field: 'occupation',
        label: 'Primary Occupation',
        labelHi: 'मुख्य व्यवसाय',
        type: 'select',
        options: ['farmer', 'student', 'self_employed', 'daily_wage', 'salaried', 'artisan', 'unemployed'],
        isAnswered: Boolean(profile.occupation),
        category: 'Occupation',
      },
      {
        field: 'socialCategory',
        label: 'Social Category',
        labelHi: 'सामाजिक श्रेणी',
        type: 'select',
        options: ['general', 'obc', 'sc', 'st', 'ews'],
        isAnswered: Boolean(profile.socialCategory),
        category: 'Special Conditions',
      },
      {
        field: 'disabilityStatus',
        label: 'Person with Disability (PwD)?',
        labelHi: 'क्या आप दिव्यांग हैं?',
        type: 'boolean',
        isAnswered: profile.disabilityStatus !== undefined,
        category: 'Special Conditions',
      },
      {
        field: 'isBPL',
        label: 'BPL / Ration Card Holder?',
        labelHi: 'क्या आप बीपीएल / राशन कार्ड धारक हैं?',
        type: 'boolean',
        isAnswered: profile.isBPL !== undefined,
        category: 'Special Conditions',
      },
    ];

    const missingQuestions = coreQuestions.filter(q => !q.isAnswered);

    res.status(200).json({
      success: true,
      allQuestions: coreQuestions,
      missingQuestions,
      answeredCount: coreQuestions.length - missingQuestions.length,
      totalCount: coreQuestions.length,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  checkEligibility,
  evaluateSpecificScheme,
  getAdaptiveQuestions,
};
