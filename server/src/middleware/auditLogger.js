const AuditLog = require('../models/AuditLog');
const logger = require('../utils/logger');

const logAudit = async ({ req, action, entity, entityId, details }) => {
  try {
    const actorId = req.user ? req.user._id : null;
    const actorName = req.user ? req.user.name : 'Anonymous';
    const actorRole = req.user ? req.user.role : 'unauthenticated';
    const ipAddress = req && req.headers ? (req.headers['x-forwarded-for'] || (req.socket ? req.socket.remoteAddress : '127.0.0.1')) : '127.0.0.1';

    await AuditLog.create({
      actorId,
      actorName,
      actorRole,
      action,
      entity,
      entityId,
      details,
      ipAddress,
    });
  } catch (err) {
    logger.error('Failed to create audit log', { error: err.message });
  }
};

module.exports = {
  logAudit,
};
