import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Button from '../ui/Button';

const UploadBox = ({ onFileSelected, isUploading, acceptedDocType = 'other' }) => {
  const { t } = useTranslation();
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);

  const validateAndHandle = (file) => {
    setErrorMsg('');
    if (!file) return;

    // Check size (10 MB max)
    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg('File exceeds 10MB limit. Please upload a smaller file.');
      return;
    }

    // Check format
    const validMimes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!validMimes.includes(file.type)) {
      setErrorMsg('Invalid format. Please upload a PDF, JPG, JPEG, or PNG file.');
      return;
    }

    setSelectedFile(file);
    if (onFileSelected) {
      onFileSelected(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndHandle(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  return (
    <div className="w-full">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors duration-200 ${
          isDragOver
            ? 'border-gov-600 bg-gov-50/60'
            : selectedFile
            ? 'border-emerald-400 bg-emerald-50/20'
            : 'border-slate-300 hover:border-gov-400 bg-slate-50/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              validateAndHandle(e.target.files[0]);
            }
          }}
        />

        {selectedFile ? (
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
              <FileText className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-900 mb-1">{selectedFile.name}</p>
            <p className="text-xs text-slate-500 mb-4">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • Ready to analyze
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              Choose Another File
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-gov-50 text-gov-600 flex items-center justify-center mb-3">
              <UploadCloud className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-800 mb-1">
              {t('documents.drag_drop')}
            </p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-3">
              {t('documents.supported_formats')}
            </p>
            <Button size="sm" variant="outline" className="pointer-events-none">
              Browse Files
            </Button>
          </div>
        )}
      </div>

      {errorMsg && (
        <div className="mt-2 flex items-center gap-1.5 text-xs text-rose-600 font-medium">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
};

export default UploadBox;
