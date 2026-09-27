const Profile = require('../models/Profile');
const User = require('../models/User');

const getProfile = async (req, res, next) => {
  try {
    let profile = await Profile.findOne({ userId: req.user.id });
    if (!profile) {
      profile = await Profile.create({
        userId: req.user.id,
        fullName: req.user.name,
      });
    }

    res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const allowedFields = [
      'fullName',
      'dateOfBirth',
      'age',
      'gender',
      'maritalStatus',
      'state',
      'district',
      'residenceType',
      'annualIncome',
      'occupation',
      'employmentStatus',
      'education',
      'socialCategory',
      'disabilityStatus',
      'disabilityPercentage',
      'isBPL',
      'isFarmer',
      'landHoldingHectares',
      'isStudent',
      'hasBankAccount',
      'familyMembersCount',
      'familyDetails',
    ];

    const updates = {};
    for (const key of allowedFields) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    let profile = await Profile.findOne({ userId: req.user.id });
    if (!profile) {
      profile = new Profile({ userId: req.user.id, ...updates });
    } else {
      Object.assign(profile, updates);
    }

    await profile.save();

    // If user's name is updated, update User table too
    if (updates.fullName) {
      await User.findByIdAndUpdate(req.user.id, { name: updates.fullName });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      profile,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
};
