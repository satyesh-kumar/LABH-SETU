const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    actorName: {
      type: String,
      default: 'System',
    },
    actorRole: {
      type: String,
      default: 'citizen',
    },
    action: {
      type: String,
      required: true, // SCHEME_CREATED, SCHEME_EDITED, RULE_CHANGED, SCHEME_PUBLISHED, etc.
    },
    entity: {
      type: String,
      required: true, // Scheme, EligibilityRule, Requirement, User, Application, Document
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
    },
    ipAddress: {
      type: String,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AuditLog', auditLogSchema);
