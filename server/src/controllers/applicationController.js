const Application = require('../models/Application');
const Scheme = require('../models/Scheme');
const { calculateDocumentReadiness } = require('../services/readinessService');

const createApplication = async (req, res, next) => {
  try {
    const { schemeId, notes } = req.body;
    if (!schemeId) {
      return res.status(400).json({
        success: false,
        message: 'Scheme ID is required to start an application guidance pathway.',
      });
    }

    const scheme = await Scheme.findById(schemeId);
    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: 'Scheme not found.',
      });
    }

    // Check if application already exists for this scheme and user
    let application = await Application.findOne({
      userId: req.user.id,
      schemeId,
    });

    if (application) {
      return res.status(200).json({
        success: true,
        message: 'Existing application pathway retrieved.',
        application,
      });
    }

    // Calculate initial document readiness
    const readiness = await calculateDocumentReadiness(req.user.id, scheme);

    application = await Application.create({
      userId: req.user.id,
      schemeId,
      status: readiness.isFullyReady ? 'documents_prepared' : 'draft',
      readinessScore: readiness.readinessPercentage,
      officialApplicationUrl: scheme.officialPortalUrl || 'https://india.gov.in',
      userNotes: notes || '',
      timeline: [
        {
          status: 'Application Pathway Initiated',
          title: 'Guidance Pathway Started',
          description: `Citizen initiated preparation for ${scheme.name}.`,
          timestamp: new Date(),
          source: 'SYSTEM_GENERATED',
        },
      ],
      stepsCompleted: [1],
    });

    // Increment scheme application count
    Scheme.findByIdAndUpdate(schemeId, { $inc: { applicationCount: 1 } }).exec();

    res.status(201).json({
      success: true,
      message: 'Application guidance pathway created successfully.',
      application,
    });
  } catch (error) {
    next(error);
  }
};

const getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ userId: req.user.id })
      .populate('schemeId', 'name nameHi department category benefitSummary officialPortalUrl stateScope')
      .sort('-updatedAt');

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    next(error);
  }
};

const getApplicationById = async (req, res, next) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      userId: req.user.id,
    }).populate({
      path: 'schemeId',
      populate: ['officialSources', 'requirements', 'eligibilityRules'],
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application pathway not found.',
      });
    }

    // Refresh document readiness
    const readiness = await calculateDocumentReadiness(req.user.id, application.schemeId);
    application.readinessScore = readiness.readinessPercentage;
    await application.save();

    res.status(200).json({
      success: true,
      application,
      readiness,
    });
  } catch (error) {
    next(error);
  }
};

const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, referenceNumber, userNotes, stepCompleted } = req.body;
    const application = await Application.findOne({
      _id: req.params.id,
      userId: req.user.id,
    }).populate('schemeId', 'name');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found.',
      });
    }

    if (referenceNumber) {
      application.referenceNumber = referenceNumber;
    }
    if (userNotes !== undefined) {
      application.userNotes = userNotes;
    }
    if (stepCompleted && !application.stepsCompleted.includes(stepCompleted)) {
      application.stepsCompleted.push(stepCompleted);
    }

    if (status && status !== application.status) {
      application.status = status;
      if (status === 'submitted_to_official' && !application.submissionDate) {
        application.submissionDate = new Date();
      }

      // Add to timeline with clear USER_ENTERED label (Section 24)
      application.timeline.push({
        status: status.replace(/_/g, ' ').toUpperCase(),
        title: `Status Updated: ${status.replace(/_/g, ' ')}`,
        description: referenceNumber
          ? `Reference Number logged: ${referenceNumber}`
          : 'User updated application progress in tracker.',
        timestamp: new Date(),
        source: 'USER_ENTERED',
      });
    }

    await application.save();

    res.status(200).json({
      success: true,
      message: 'Application updated successfully.',
      application,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createApplication,
  getMyApplications,
  getApplicationById,
  updateApplicationStatus,
};
