import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ExternalLink, ShieldCheck } from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import ApplicationPathway from '../components/application/ApplicationPathway';
import ApplicationTracker from '../components/application/ApplicationTracker';
import { ErrorState } from '../components/ui/EmptyState';

const ApplicationPathwayPage = () => {
  const { applicationId } = useParams();
  const { t } = useTranslation();
  const { success, error } = useToast();

  const [application, setApplication] = useState(null);
  const [readiness, setReadiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errState, setErrState] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeView, setActiveView] = useState('pathway'); // 'pathway' or 'tracker'

  const fetchApplication = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/applications/${applicationId}`);
      if (data.success) {
        setApplication(data.application);
        setReadiness(data.readiness);
      }
    } catch (err) {
      setErrState(err.message || 'Failed to load application');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplication();
  }, [applicationId]);

  const handleUpdateStatus = async (updatePayload) => {
    setIsUpdating(true);
    try {
      const { data } = await api.patch(`/applications/${applicationId}/status`, updatePayload);
      if (data.success) {
        setApplication(data.application);
        success('Application status updated successfully!');
      }
    } catch (err) {
      error(err.message || 'Failed to update');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateStep = async (stepNum) => {
    try {
      await api.patch(`/applications/${applicationId}/status`, {
        stepCompleted: stepNum,
      });
      fetchApplication();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-slate-500">
        <p className="text-sm">Loading application pathway...</p>
      </div>
    );
  }

  if (errState || !application) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <ErrorState description={errState || 'Application not found'} />
      </div>
    );
  }

  const scheme = application.schemeId;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Breadcrumb & Scheme Banner */}
      <div>
        <Link
          to="/applications"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-gov-700 font-medium mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Applications</span>
        </Link>

        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-subtle">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="primary" size="sm">
                {scheme?.category}
              </Badge>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500">{scheme?.department}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              {scheme?.name}
            </h1>
          </div>

          {scheme?.officialPortalUrl && (
            <a
              href={scheme.officialPortalUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="sm" icon={ExternalLink}>
                Official Portal Link
              </Button>
            </a>
          )}
        </div>
      </div>

      {/* View Switcher Tabs: Pathway Walkthrough vs. Timeline Tracker */}
      <div className="flex border-b border-slate-200 gap-4">
        <button
          onClick={() => setActiveView('pathway')}
          className={`pb-3 text-sm font-semibold transition-colors border-b-2 ${
            activeView === 'pathway'
              ? 'border-gov-600 text-gov-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Application Guidance Stepper
        </button>
        <button
          onClick={() => setActiveView('tracker')}
          className={`pb-3 text-sm font-semibold transition-colors border-b-2 ${
            activeView === 'tracker'
              ? 'border-gov-600 text-gov-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Personal Timeline & Status Tracker
        </button>
      </div>

      {/* Tab Contents */}
      {activeView === 'pathway' ? (
        <Card className="p-6 sm:p-8 border-slate-200 bg-white">
          <ApplicationPathway
            application={application}
            scheme={scheme}
            onUpdateStep={handleUpdateStep}
          />
        </Card>
      ) : (
        <ApplicationTracker
          application={application}
          onUpdateStatus={handleUpdateStatus}
          isUpdating={isUpdating}
        />
      )}
    </div>
  );
};

export default ApplicationPathwayPage;
