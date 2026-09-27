/**
 * Role-Based Access Control Middleware
 */
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required before checking permissions.',
      });
    }

    if (!roles.includes(req.user.role) && req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: `Forbidden. Role '${req.user.role}' is not authorized to access this resource.`,
      });
    }

    next();
  };
};

module.exports = {
  restrictTo,
};
