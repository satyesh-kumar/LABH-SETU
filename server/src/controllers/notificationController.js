const Notification = require('../models/Notification');

/**
 * Get all notifications for the authenticated user
 * Auto-creates helpful onboarding notifications if none exist
 */
const getMyNotifications = async (req, res, next) => {
  try {
    let notifications = await Notification.find({ userId: req.user.id })
      .sort('-createdAt')
      .limit(30);

    // If new user with no notifications, seed realistic initial alerts
    if (notifications.length === 0) {
      const initialAlerts = [
        {
          userId: req.user.id,
          title: 'Welcome to LabhSetu',
          message: 'Your citizen account is verified. Start by checking your preliminary eligibility for 6+ Central and State welfare schemes.',
          type: 'info',
          link: '/check-eligibility',
        },
        {
          userId: req.user.id,
          title: 'Document Readiness Reminder',
          message: 'Upload your Aadhaar Card and Income Certificate to compute your OCR Readiness Score.',
          type: 'reminder',
          link: '/documents',
        },
        {
          userId: req.user.id,
          title: 'Scheme Guidelines Updated',
          message: 'Official DBT verification guidelines for PM-KISAN have been published by Ministry of Agriculture.',
          type: 'success',
          link: '/find-schemes',
        },
      ];

      await Notification.insertMany(initialAlerts);
      notifications = await Notification.find({ userId: req.user.id }).sort('-createdAt');
    }

    const unreadCount = notifications.filter(n => !n.read).length;

    res.status(200).json({
      success: true,
      count: notifications.length,
      unreadCount,
      notifications,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Mark a single notification as read
 */
const markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found.',
      });
    }

    res.status(200).json({
      success: true,
      notification,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Mark all notifications as read for current user
 */
const markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { userId: req.user.id, read: false },
      { read: true }
    );

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a notification
 */
const deleteNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notification deleted.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};
