const Scheme = require('../models/Scheme');
const EligibilityRule = require('../models/EligibilityRule');
const Requirement = require('../models/Requirement');
const OfficialSource = require('../models/OfficialSource');

const getSchemes = async (req, res, next) => {
  try {
    const {
      search,
      category,
      state,
      benefitType,
      sort = '-createdAt',
      page = 1,
      limit = 12,
    } = req.query;

    const filter = { status: 'published' };

    // Search query across name, description, department, tags
    if (search && search.trim()) {
      const cleanSearch = search.trim();
      filter.$or = [
        { name: { $regex: cleanSearch, $options: 'i' } },
        { nameHi: { $regex: cleanSearch, $options: 'i' } },
        { shortDescription: { $regex: cleanSearch, $options: 'i' } },
        { department: { $regex: cleanSearch, $options: 'i' } },
        { tags: { $regex: cleanSearch, $options: 'i' } },
      ];
    }

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (state && state !== 'All India' && state !== 'All') {
      filter.$and = filter.$and || [];
      filter.$and.push({
        $or: [{ stateScope: 'All India' }, { stateScope: state }],
      });
    }

    if (benefitType && benefitType !== 'All') {
      filter.benefitType = benefitType;
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const [schemes, total] = await Promise.all([
      Scheme.find(filter)
        .populate('officialSources', 'title url department status verifiedDate')
        .populate('eligibilityRules', 'title description field operator value isMandatory')
        .populate('requirements', 'title type documentType isMandatory')
        .sort(sort)
        .skip(skip)
        .limit(limitNum),
      Scheme.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      count: schemes.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      schemes,
    });
  } catch (error) {
    next(error);
  }
};

const getSchemeById = async (req, res, next) => {
  try {
    const scheme = await Scheme.findById(req.params.id)
      .populate('officialSources')
      .populate('eligibilityRules')
      .populate('requirements');

    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: 'Scheme not found.',
      });
    }

    // Increment view count asynchronously
    Scheme.findByIdAndUpdate(req.params.id, { $inc: { viewCount: 1 } }).exec();

    res.status(200).json({
      success: true,
      scheme,
    });
  } catch (error) {
    next(error);
  }
};

const getSchemeBySlug = async (req, res, next) => {
  try {
    const scheme = await Scheme.findOne({ slug: req.params.slug })
      .populate('officialSources')
      .populate('eligibilityRules')
      .populate('requirements');

    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: 'Scheme not found.',
      });
    }

    Scheme.findByIdAndUpdate(scheme._id, { $inc: { viewCount: 1 } }).exec();

    res.status(200).json({
      success: true,
      scheme,
    });
  } catch (error) {
    next(error);
  }
};

const getCategories = async (req, res, next) => {
  try {
    const categoriesWithCount = await Scheme.aggregate([
      { $match: { status: 'published' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const categories = categoriesWithCount.map(c => ({
      name: c._id,
      count: c.count,
    }));

    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    next(error);
  }
};

const compareSchemes = async (req, res, next) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide scheme IDs to compare.',
      });
    }

    const schemes = await Scheme.find({ _id: { $in: ids.slice(0, 3) } })
      .populate('eligibilityRules')
      .populate('requirements')
      .populate('officialSources');

    res.status(200).json({
      success: true,
      schemes,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSchemes,
  getSchemeById,
  getSchemeBySlug,
  getCategories,
  compareSchemes,
};
