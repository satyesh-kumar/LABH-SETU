import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, CheckCircle2, User, Building, Send, AlertCircle } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';

const ApplicationTracker = ({ application, onUpdateStatus, isUpdating }) => {
  const { t } = useTranslation();
  const [newStatus, setNewStatus] = useState(application?.status || 'draft');
  const [refNumber, setRefNumber] = useState(application?.referenceNumber || '');
  const [userNote, setUserNote] = useState(application?.userNotes || '');

  const timeline = application?.timeline || [];

  const handleUpdate = () => {
    if (onUpdateStatus) {
      onUpdateStatus({
        status: newStatus,
        referenceNumber: refNumber,
        userNotes: userNote,
      });
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <Badge variant="success">Sanctioned / Approved</Badge>;
      case 'rejected':
        return <Badge variant="danger">Not Approved</Badge>;
      case 'submitted_to_official':
        return <Badge variant="primary">Submitted to Official Portal</Badge>;
      case 'under_review':
        return <Badge variant="warning">Under Review</Badge>;
      case 'documents_prepared':
        return <Badge variant="info">Documents Ready</Badge>;
      default:
        return <Badge variant="neutral">Draft / Preparing</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Status Header Card */}
      <Card className="p-6 bg-slate-50/50 border-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Current Application Progress
            </span>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900">
                {application?.schemeId?.name || 'Government Scheme'}
              </h3>
              {getStatusBadge(application?.status)}
            </div>
            {application?.referenceNumber && (
              <p className="text-xs text-slate-600 mt-1 font-mono">
                Official Reference ID: <span className="font-semibold text-slate-800">{application.referenceNumber}</span>
              </p>
            )}
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 block">Readiness Score</span>
            <span className="text-2xl font-bold text-gov-700">
              {application?.readinessScore || 0}%
            </span>
          </div>
        </div>
      </Card>

      {/* Vertical Timeline */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h4 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
          <Clock className="w-4 h-4 text-gov-600" />
          <span>Application Progress History</span>
        </h4>

        {timeline.length === 0 ? (
          <p className="text-xs text-slate-500 py-4">No events logged yet in tracker.</p>
        ) : (
          <div className="relative border-l-2 border-slate-200 ml-3 space-y-6 pl-5 my-2">
            {timeline.map((evt, idx) => (
              <div key={idx} className="relative">
                <div className="absolute -left-[27px] top-1 w-4 h-4 rounded-full bg-gov-600 border-2 border-white shadow-xs" />
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-800">{evt.title}</span>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    {evt.source === 'USER_ENTERED' && (
                      <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 font-semibold border border-amber-200">
                        Citizen Logged
                      </span>
                    )}
                    <span>{new Date(evt.timestamp).toLocaleString()}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {evt.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Update Progress Form */}
      <Card className="p-6 border-slate-200">
        <h4 className="text-sm font-bold text-slate-900 mb-4">
          Update Progress or Log Government Receipt
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <Select
            label="Update Current Status"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            options={[
              { value: 'draft', label: 'Draft / Gathering Documents' },
              { value: 'documents_prepared', label: 'Documents 100% Prepared' },
              { value: 'submitted_to_official', label: 'Submitted to Official Portal' },
              { value: 'under_review', label: 'Under Review by Department' },
              { value: 'approved', label: 'Sanctioned / Benefit Approved' },
              { value: 'rejected', label: 'Application Rejected' },
            ]}
          />
          <Input
            label="Government Portal Reference Number"
            placeholder={t('tracker.ref_placeholder')}
            value={refNumber}
            onChange={(e) => setRefNumber(e.target.value)}
            helperText="Receipt acknowledgment number provided by the official portal"
          />
        </div>

        <Input
          label="Personal Notes"
          placeholder="e.g. Visited CSC centre on Tuesday; submitted additional domicile affidavit."
          value={userNote}
          onChange={(e) => setUserNote(e.target.value)}
          className="mb-4"
        />

        <Button
          size="md"
          variant="primary"
          icon={Send}
          onClick={handleUpdate}
          isLoading={isUpdating}
        >
          Save Status Update
        </Button>
      </Card>
    </div>
  );
};

export default ApplicationTracker;
