const User = require('../models/User');
const Profile = require('../models/Profile');
const jwt = require('jsonwebtoken');
const { logAudit } = require('../middleware/auditLogger');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'labhsetu_default_secret_key', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

const register = async (req, res, next) => {
  try {
    const { name, email, password, phone, role, preferredLanguage } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.',
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: role && ['citizen', 'operator'].includes(role) ? role : 'citizen',
      preferredLanguage: preferredLanguage || 'en',
    });

    // Automatically create initial citizen profile
    await Profile.create({
      userId: user._id,
      fullName: name,
    });

    const token = signToken(user._id);

    await logAudit({
      req,
      action: 'USER_REGISTER',
      entity: 'User',
      entityId: user._id,
      details: { email: user.email, role: user.role },
    });

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        preferredLanguage: user.preferredLanguage,
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = signToken(user._id);

    await logAudit({
      req: { ...req, user },
      action: 'USER_LOGIN',
      entity: 'User',
      entityId: user._id,
      details: { email: user.email },
    });

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        preferredLanguage: user.preferredLanguage,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const profile = await Profile.findOne({ userId: req.user.id });

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        preferredLanguage: user.preferredLanguage,
      },
      profile,
    });
  } catch (error) {
    next(error);
  }
};

const updatePreferences = async (req, res, next) => {
  try {
    const { preferredLanguage } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { preferredLanguage },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      preferredLanguage: user.preferredLanguage,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  updatePreferences,
};
