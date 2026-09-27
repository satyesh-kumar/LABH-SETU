const Scheme = require('../models/Scheme');
const EligibilityRule = require('../models/EligibilityRule');
const Requirement = require('../models/Requirement');
const OfficialSource = require('../models/OfficialSource');
const SchemeVersion = require('../models/SchemeVersion');
const User = require('../models/User');
const Application = require('../models/Application');
const Document = require('../models/Document');
const AuditLog = require('../models/AuditLog');
const { logAudit } = require('../middleware/auditLogger');

// Section 32: Dashboard Metrics & Charts
const getDashboardMetrics = async (req, res, next) => {
  try {
    const [
      totalSchemes,
      publishedSchemes,
      totalUsers,
      totalApplications,
      totalDocuments,
      categoryStats,
      appStatusStats,
      recentAuditLogs,
    ] = await Promise.all([
      Scheme.countDocuments(),
      Scheme.countDocuments({ status: 'published' }),
      User.countDocuments(),
      Application.countDocuments(),
      Document.countDocuments(),
      Scheme.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
      ]),
      Application.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      AuditLog.find().sort('-timestamp').limit(8),
    ]);

    const formattedCategoryStats = categoryStats.map(c => ({
      name: c._id || 'Uncategorized',
      count: c.count,
    }));

    const formattedAppStatusStats = appStatusStats.map(s => ({
      status: s._id || 'Unknown',
      count: s.count,
    }));

    res.status(200).json({
      success: true,
      metrics: {
        totalSchemes,
        publishedSchemes,
        pendingVerification: totalSchemes - publishedSchemes,
        totalUsers,
        totalApplications,
        totalDocuments,
      },
      charts: {
        schemesByCategory: formattedCategoryStats,
        applicationsByStatus: formattedAppStatusStats,
      },
      recentAuditLogs,
    });
  } catch (error) {
    next(error);
  }
};

// Section 33 & 34: Create Scheme with versioning
const createScheme = async (req, res, next) => {
  try {
    const {
      name,
      nameHi,
      slug,
      department,
      ministry,
      shortDescription,
      shortDescriptionHi,
      fullDescription,
      fullDescriptionHi,
      category,
      benefitType,
      benefitSummary,
      benefitSummaryHi,
      stateScope,
      officialPortalUrl,
      isDemo = true,
      tags = [],
    } = req.body;

    const generatedSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    const scheme = await Scheme.create({
      name,
      nameHi,
      slug: generatedSlug,
      department,
      ministry,
      shortDescription,
      shortDescriptionHi,
      fullDescription,
      fullDescriptionHi,
      category,
      benefitType,
      benefitSummary,
      benefitSummaryHi,
      stateScope: stateScope || 'All India',
      officialPortalUrl,
      isDemo,
      tags,
      version: 1,
      status: 'published',
    });

    // Create Initial Version 1
    await SchemeVersion.create({
      schemeId: scheme._id,
      versionNumber: 1,
      changesSummary: 'Initial creation and publication of scheme.',
      snapshot: scheme.toObject(),
      verifiedBy: req.user ? req.user.name : 'Administrator',
    });

    await logAudit({
      req,
      action: 'SCHEME_CREATED',
      entity: 'Scheme',
      entityId: scheme._id,
      details: { name: scheme.name, category: scheme.category },
    });

    res.status(201).json({
      success: true,
      message: 'Scheme created successfully with Version 1.',
      scheme,
    });
  } catch (error) {
    next(error);
  }
};

// Update Scheme with Versioning
const updateScheme = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { changesSummary = 'General information update', ...updates } = req.body;

    const existingScheme = await Scheme.findById(id);
    if (!existingScheme) {
      return res.status(404).json({
        success: false,
        message: 'Scheme not found.',
      });
    }

    const newVersion = (existingScheme.version || 1) + 1;
    updates.version = newVersion;
    updates.verificationDate = new Date();
    if (req.user) updates.verifiedBy = req.user.name;

    const updatedScheme = await Scheme.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    // Store version record
    await SchemeVersion.create({
      schemeId: id,
      versionNumber: newVersion,
      changesSummary,
      snapshot: updatedScheme.toObject(),
      verifiedBy: req.user ? req.user.name : 'Administrator',
    });

    await logAudit({
      req,
      action: 'SCHEME_EDITED',
      entity: 'Scheme',
      entityId: id,
      details: { changesSummary, version: newVersion },
    });

    res.status(200).json({
      success: true,
      message: `Scheme updated to Version ${newVersion}.`,
      scheme: updatedScheme,
    });
  } catch (error) {
    next(error);
  }
};

const deleteScheme = async (req, res, next) => {
  try {
    const { id } = req.params;
    const scheme = await Scheme.findByIdAndDelete(id);

    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: 'Scheme not found.',
      });
    }

    // Also remove associated rules, requirements, sources
    await Promise.all([
      EligibilityRule.deleteMany({ schemeId: id }),
      Requirement.deleteMany({ schemeId: id }),
      OfficialSource.deleteMany({ schemeId: id }),
      SchemeVersion.deleteMany({ schemeId: id }),
    ]);

    await logAudit({
      req,
      action: 'SCHEME_DELETED',
      entity: 'Scheme',
      entityId: id,
      details: { name: scheme.name },
    });

    res.status(200).json({
      success: true,
      message: 'Scheme and associated metadata deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// Rules management
const addRuleToScheme = async (req, res, next) => {
  try {
    const { schemeId } = req.params;
    const { title, description, descriptionHi, field, operator, value, isMandatory, missingInfoPrompt } = req.body;

    const rule = await EligibilityRule.create({
      schemeId,
      title,
      description,
      descriptionHi,
      field,
      operator,
      value,
      isMandatory: isMandatory !== undefined ? isMandatory : true,
      missingInfoPrompt,
    });

    await Scheme.findByIdAndUpdate(schemeId, {
      $push: { eligibilityRules: rule._id },
    });

    await logAudit({
      req,
      action: 'RULE_ADDED',
      entity: 'EligibilityRule',
      entityId: rule._id,
      details: { schemeId, field, operator },
    });

    res.status(201).json({
      success: true,
      message: 'Eligibility rule added successfully.',
      rule,
    });
  } catch (error) {
    next(error);
  }
};

const deleteRule = async (req, res, next) => {
  try {
    const { ruleId } = req.params;
    const rule = await EligibilityRule.findByIdAndDelete(ruleId);
    if (!rule) {
      return res.status(404).json({ success: false, message: 'Rule not found.' });
    }

    await Scheme.findByIdAndUpdate(rule.schemeId, {
      $pull: { eligibilityRules: rule._id },
    });

    res.status(200).json({ success: true, message: 'Rule removed successfully.' });
  } catch (error) {
    next(error);
  }
};

// Requirements management
const addRequirementToScheme = async (req, res, next) => {
  try {
    const { schemeId } = req.params;
    const { title, titleHi, type, documentType, description, descriptionHi, isMandatory } = req.body;

    const reqRecord = await Requirement.create({
      schemeId,
      title,
      titleHi,
      type: type || 'document',
      documentType: documentType || 'other',
      description,
      descriptionHi,
      isMandatory: isMandatory !== undefined ? isMandatory : true,
    });

    await Scheme.findByIdAndUpdate(schemeId, {
      $push: { requirements: reqRecord._id },
    });

    res.status(201).json({
      success: true,
      message: 'Requirement added to scheme.',
      requirement: reqRecord,
    });
  } catch (error) {
    next(error);
  }
};

const getAuditLogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      AuditLog.find().sort('-timestamp').skip(skip).limit(parseInt(limit, 10)),
      AuditLog.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      total,
      logs,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardMetrics,
  createScheme,
  updateScheme,
  deleteScheme,
  addRuleToScheme,
  deleteRule,
  addRequirementToScheme,
  getAuditLogs,
};
