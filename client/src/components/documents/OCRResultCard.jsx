import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Edit2, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Input from '../ui/Input';

const OCRResultCard = ({ document, onAccept, onSaveEdit, isSaving }) => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [syncToProfile, setSyncToProfile] = useState(true);
  const [showMasked, setShowMasked] = useState(true);

  const fields = document?.extractedFields || {};
  const [editedFields, setEditedFields] = useState({
    name: fields.name || '',
    dateOfBirth: fields.dateOfBirth || '',
    gender: fields.gender || '',
    documentNumber: fields.documentNumber || '',
    address: fields.address || '',
    annualIncome: fields.annualIncome || '',
  });

  const handleFieldChange = (key, value) => {
    setEditedFields((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveEdit = async () => {
    if (onSaveEdit) {
      await onSaveEdit(document._id, editedFields, syncToProfile);
    }
    setIsEditing(false);
  };

  const handleAccept = async () => {
    if (onAccept) {
      await onAccept(document._id, fields, syncToProfile);
    }
  };

  return (
    <Card className="p-5 border-slate-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Badge variant="primary" size="sm" className="uppercase font-semibold tracking-wider">
            {document.documentType?.replace(/_/g, ' ')}
          </Badge>
          <span className="text-xs text-slate-500 font-medium">
            OCR Confidence: {Math.round((fields.confidenceScore || 0.95) * 100)}%
          </span>
        </div>
        <Badge
          variant={
            document.verificationStatus === 'verified'
              ? 'success'
              : document.verificationStatus === 'pending_review'
              ? 'warning'
              : 'neutral'
          }
          size="sm"
        >
          {document.verificationStatus === 'verified'
            ? 'Verified by Citizen'
            : 'Review Needed'}
        </Badge>
      </div>

      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
        {t('documents.extracted_info')}
      </h4>

      {isEditing ? (
        <div className="space-y-3 mb-4">
          <Input
            label="Full Name (as per document)"
            value={editedFields.name}
            onChange={(e) => handleFieldChange('name', e.target.value)}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Date of Birth"
              type="date"
              value={editedFields.dateOfBirth}
              onChange={(e) => handleFieldChange('dateOfBirth', e.target.value)}
            />
            <Input
              label="Document Number"
              value={editedFields.documentNumber}
              onChange={(e) => handleFieldChange('documentNumber', e.target.value)}
            />
          </div>
          <Input
            label="Address"
            value={editedFields.address}
            onChange={(e) => handleFieldChange('address', e.target.value)}
          />
          {document.documentType === 'income_certificate' && (
            <Input
              label="Certified Annual Income (₹)"
              type="number"
              value={editedFields.annualIncome}
              onChange={(e) => handleFieldChange('annualIncome', e.target.value)}
            />
          )}

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="syncProfileEdit"
              checked={syncToProfile}
              onChange={(e) => setSyncToProfile(e.target.checked)}
              className="rounded text-gov-600 focus:ring-gov-600 w-4 h-4"
            />
            <label htmlFor="syncProfileEdit" className="text-xs font-medium text-slate-700">
              {t('documents.sync_profile')}
            </label>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <Button size="sm" variant="primary" onClick={handleSaveEdit} isLoading={isSaving}>
              Save Changes
            </Button>
            <Button size="sm" variant="secondary" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-2.5 mb-5 text-sm">
          {fields.name && (
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500 text-xs">Name</span>
              <span className="font-semibold text-slate-800">{fields.name}</span>
            </div>
          )}
          {fields.dateOfBirth && (
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500 text-xs">Date of Birth</span>
              <span className="font-medium text-slate-800">{fields.dateOfBirth}</span>
            </div>
          )}
          {(fields.maskedDocumentNumber || fields.documentNumber) && (
            <div className="flex justify-between items-center py-1 border-b border-slate-50">
              <span className="text-slate-500 text-xs">Document Number</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold text-slate-800">
                  {showMasked ? (fields.maskedDocumentNumber || 'XXXX-XXXX') : (fields.documentNumber || fields.maskedDocumentNumber)}
                </span>
                <button
                  type="button"
                  onClick={() => setShowMasked(!showMasked)}
                  className="text-slate-400 hover:text-slate-600"
                  title="Toggle mask"
                >
                  {showMasked ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          )}
          {fields.annualIncome !== undefined && fields.annualIncome !== null && (
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500 text-xs">Certified Annual Income</span>
              <span className="font-semibold text-emerald-700">₹{fields.annualIncome.toLocaleString('en-IN')}</span>
            </div>
          )}
          {fields.issuingAuthority && (
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500 text-xs">Issuing Authority</span>
              <span className="text-xs text-slate-600 text-right max-w-[200px] truncate">{fields.issuingAuthority}</span>
            </div>
          )}
          {fields.address && (
            <div className="pt-1">
              <span className="text-slate-500 text-xs block mb-0.5">Address</span>
              <span className="text-xs text-slate-700 leading-relaxed block">{fields.address}</span>
            </div>
          )}

          {document.verificationStatus !== 'verified' && (
            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id={`syncProfile-${document._id}`}
                checked={syncToProfile}
                onChange={(e) => setSyncToProfile(e.target.checked)}
                className="rounded text-gov-600 focus:ring-gov-600 w-4 h-4"
              />
              <label htmlFor={`syncProfile-${document._id}`} className="text-xs font-medium text-slate-700">
                {t('documents.sync_profile')}
              </label>
            </div>
          )}
        </div>
      )}

      {!isEditing && document.verificationStatus !== 'verified' && (
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
          <Button
            size="sm"
            variant="success"
            icon={Check}
            onClick={handleAccept}
            isLoading={isSaving}
          >
            {t('documents.accept_btn')}
          </Button>
          <Button
            size="sm"
            variant="outline"
            icon={Edit2}
            onClick={() => setIsEditing(true)}
          >
            {t('documents.edit_btn')}
          </Button>
        </div>
      )}
    </Card>
  );
};

export default OCRResultCard;
