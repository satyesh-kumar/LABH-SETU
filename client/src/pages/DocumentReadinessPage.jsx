import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FileText,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Trash2,
  Eye,
  ShieldCheck,
  Plus,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import UploadBox from '../components/documents/UploadBox';
import OCRResultCard from '../components/documents/OCRResultCard';
import Modal from '../components/ui/Modal';
import Select from '../components/ui/Select';
import { EmptyState } from '../components/ui/EmptyState';

const DocumentReadinessPage = () => {
  const { t } = useTranslation();
  const { user, refreshProfile } = useAuth();
  const { success, error, info } = useToast();

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [docType, setDocType] = useState('aadhaar');
  const [isUploading, setIsUploading] = useState(false);
  const [savingDocId, setSavingDocId] = useState(null);

  const fetchDocuments = async () => {
    try {
      const { data } = await api.get('/documents');
      if (data.success) {
        setDocuments(data.documents);
      }
    } catch (err) {
      console.error('Failed to load documents', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleUploadSubmit = async () => {
    if (!selectedFile) {
      error('Please choose a file to upload.');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('documentType', docType);

    try {
      const { data } = await api.post('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (data.success) {
        success('Document uploaded and OCR extraction complete!');
        setUploadModalOpen(false);
        setSelectedFile(null);
        fetchDocuments();
      }
    } catch (err) {
      error(err.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAcceptOCR = async (docId, fields, syncToProfile) => {
    setSavingDocId(docId);
    try {
      const { data } = await api.patch(`/documents/${docId}/review`, {
        accepted: true,
        syncToProfile,
      });
      if (data.success) {
        success('Document verified and accepted successfully!');
        if (syncToProfile) refreshProfile();
        fetchDocuments();
      }
    } catch (err) {
      error(err.message || 'Failed to verify');
    } finally {
      setSavingDocId(null);
    }
  };

  const handleSaveEditOCR = async (docId, updatedFields, syncToProfile) => {
    setSavingDocId(docId);
    try {
      const { data } = await api.patch(`/documents/${docId}/review`, {
        accepted: true,
        updatedFields,
        syncToProfile,
      });
      if (data.success) {
        success('Document details updated and verified!');
        if (syncToProfile) refreshProfile();
        fetchDocuments();
      }
    } catch (err) {
      error(err.message || 'Failed to save edits');
    } finally {
      setSavingDocId(null);
    }
  };

  const handleDelete = async (docId) => {
    if (!window.confirm('Are you sure you want to remove this document?')) return;
    try {
      const { data } = await api.delete(`/documents/${docId}`);
      if (data.success) {
        success('Document removed.');
        fetchDocuments();
      }
    } catch (err) {
      error(err.message || 'Failed to delete');
    }
  };

  // Calculate Overall Readiness
  const coreDocTypes = ['aadhaar', 'income_certificate', 'residence_certificate', 'bank_passbook'];
  const verifiedCount = coreDocTypes.filter((type) =>
    documents.some((d) => d.documentType === type && d.verificationStatus === 'verified')
  ).length;
  const readinessPercent = Math.round((verifiedCount / coreDocTypes.length) * 100);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t('documents.title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {t('documents.subtitle')}
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={Plus}
          onClick={() => setUploadModalOpen(true)}
        >
          {t('documents.upload_btn')}
        </Button>
      </div>

      {/* Guest Mode Notice */}
      {!user && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex flex-wrap items-center justify-between gap-3 text-xs text-amber-900 shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="text-base">💡</span>
            <span className="font-semibold">You are testing Document Readiness in demo mode. Sign in to save your verified documents permanently across sessions.</span>
          </div>
          <Link to="/login">
            <Button size="sm" variant="outline" className="text-amber-900 border-amber-300 hover:bg-amber-100 font-bold bg-white text-xs py-1">
              Sign In / Instant Demo
            </Button>
          </Link>
        </div>
      )}

      {/* Document Readiness Score Banner (Section 20) */}
      <Card className="p-6 sm:p-8 bg-gradient-to-r from-gov-900 via-gov-800 to-gov-900 text-white border-none shadow-elevation">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-sky-300">
              {t('documents.readiness_score')}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold">
              {readinessPercent}% Verified for Direct Government Application
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Having your primary identity and income proofs verified avoids rejections and expedites official scrutiny.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end justify-center">
            <span className="text-4xl sm:text-5xl font-extrabold text-sky-400">
              {readinessPercent}%
            </span>
            <div className="w-48 sm:w-60 bg-gov-950/80 rounded-full h-3 mt-3 overflow-hidden border border-gov-700">
              <div
                className="bg-sky-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${readinessPercent}%` }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Core Documents Checklist Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {coreDocTypes.map((type) => {
          const doc = documents.find((d) => d.documentType === type);
          const isVerified = doc && doc.verificationStatus === 'verified';
          const isReview = doc && doc.verificationStatus !== 'verified';

          return (
            <Card key={type} className="p-4 border-slate-200 bg-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    isVerified
                      ? 'bg-emerald-100 text-emerald-700'
                      : isReview
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase">
                    {type.replace(/_/g, ' ')}
                  </h4>
                  <span className="text-[11px] font-medium text-slate-500">
                    {isVerified
                      ? 'Verified'
                      : isReview
                      ? 'Review Pending'
                      : 'Missing'}
                  </span>
                </div>
              </div>
              {isVerified ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              ) : isReview ? (
                <AlertTriangle className="w-5 h-5 text-amber-500" />
              ) : (
                <button
                  onClick={() => {
                    setDocType(type);
                    setUploadModalOpen(true);
                  }}
                  className="text-xs font-semibold text-gov-600 hover:text-gov-800 underline"
                >
                  Upload
                </button>
              )}
            </Card>
          );
        })}
      </div>

      {/* Uploaded Documents List & OCR Review */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900">
          Uploaded Documents & Intelligence Extractions ({documents.length})
        </h3>

        {loading ? (
          <p className="text-sm text-slate-500">Loading documents...</p>
        ) : documents.length === 0 ? (
          <EmptyState
            title="No documents uploaded yet"
            description="Upload your Aadhaar, Income Certificate, or Bank Passbook to test OCR readiness."
            actionLabel={t('documents.upload_btn')}
            onAction={() => setUploadModalOpen(true)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {documents.map((doc) => (
              <div key={doc._id} className="relative group">
                <OCRResultCard
                  document={doc}
                  onAccept={handleAcceptOCR}
                  onSaveEdit={handleSaveEditOCR}
                  isSaving={savingDocId === doc._id}
                />
                <button
                  onClick={() => handleDelete(doc._id)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-rose-600 p-1.5 rounded bg-white/80 shadow-xs"
                  title="Remove document"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <Modal
        isOpen={uploadModalOpen}
        onClose={() => {
          if (!isUploading) {
            setUploadModalOpen(false);
            setSelectedFile(null);
          }
        }}
        title="Upload Official Document"
      >
        <div className="space-y-4">
          <Select
            label="Document Classification"
            value={docType}
            onChange={(e) => setDocType(e.target.value)}
            options={[
              { value: 'aadhaar', label: 'Aadhaar Card (UIDAI)' },
              { value: 'income_certificate', label: 'Income Certificate (Revenue Dept)' },
              { value: 'residence_certificate', label: 'Domicile / Residence Certificate' },
              { value: 'caste_certificate', label: 'Caste Certificate (SC/ST/OBC)' },
              { value: 'bank_passbook', label: 'Bank Account Passbook' },
              { value: 'ration_card', label: 'Ration Card / NFSA Proof' },
              { value: 'pan', label: 'PAN Card' },
              { value: 'land_record', label: 'Land Record (Khatauni / Khasra)' },
              { value: 'other', label: 'Other Document' },
            ]}
          />

          <UploadBox
            onFileSelected={(file) => setSelectedFile(file)}
            isUploading={isUploading}
            acceptedDocType={docType}
          />

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <Button
              variant="secondary"
              size="sm"
              disabled={isUploading}
              onClick={() => setUploadModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              isLoading={isUploading}
              disabled={!selectedFile}
              onClick={handleUploadSubmit}
            >
              Upload & Run OCR
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DocumentReadinessPage;
