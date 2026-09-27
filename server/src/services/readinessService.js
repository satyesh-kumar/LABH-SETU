/**
 * Document Readiness Calculation Service
 * Evaluates whether citizen has all required documents uploaded, verified, or pending for a given scheme.
 */
const Document = require('../models/Document');
const Requirement = require('../models/Requirement');

const calculateDocumentReadiness = async (userId, scheme) => {
  // Find all requirements for this scheme
  const requirements = await Requirement.find({ schemeId: scheme._id });
  
  // Find all documents uploaded by user
  const userDocuments = await Document.find({ userId });

  const checklist = [];
  let readyCount = 0;
  let mandatoryTotal = 0;
  let mandatoryReady = 0;

  for (const req of requirements) {
    if (req.type === 'document') {
      mandatoryTotal += req.isMandatory ? 1 : 0;

      // Find matching uploaded document
      const matchingDoc = userDocuments.find(d => d.documentType === req.documentType);

      let status = 'MISSING'; // 'READY', 'IN_REVIEW', 'MISSING', 'ACTION_REQUIRED'
      if (matchingDoc) {
        if (matchingDoc.verificationStatus === 'verified' || matchingDoc.ocrStatus === 'processed') {
          status = 'READY';
          readyCount++;
          if (req.isMandatory) mandatoryReady++;
        } else if (matchingDoc.ocrStatus === 'pending' || matchingDoc.ocrStatus === 'processing') {
          status = 'IN_REVIEW';
        } else if (matchingDoc.ocrStatus === 'needs_review' || matchingDoc.verificationStatus === 'pending_review') {
          status = 'ACTION_REQUIRED';
        }
      }

      checklist.push({
        requirementId: req._id,
        title: req.title,
        titleHi: req.titleHi,
        documentType: req.documentType,
        isMandatory: req.isMandatory,
        description: req.description,
        descriptionHi: req.descriptionHi,
        helpText: req.helpText,
        helpTextHi: req.helpTextHi,
        status,
        document: matchingDoc
          ? {
              _id: matchingDoc._id,
              originalName: matchingDoc.originalName,
              fileUrl: matchingDoc.fileUrl,
              ocrStatus: matchingDoc.ocrStatus,
              verificationStatus: matchingDoc.verificationStatus,
              extractedFields: matchingDoc.extractedFields,
              uploadedAt: matchingDoc.uploadedAt,
            }
          : null,
      });
    }
  }

  const totalReqs = checklist.length;
  const readinessPercentage = totalReqs > 0 ? Math.round((readyCount / totalReqs) * 100) : 100;
  const isFullyReady = mandatoryTotal > 0 ? mandatoryReady === mandatoryTotal : readinessPercentage === 100;

  return {
    readinessPercentage,
    isFullyReady,
    readyCount,
    totalCount: totalReqs,
    mandatoryReady,
    mandatoryTotal,
    checklist,
  };
};

module.exports = {
  calculateDocumentReadiness,
};
