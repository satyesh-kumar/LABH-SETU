import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Clock, Plus, ExternalLink, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import api from '../services/api';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';

const ApplicationsPage = () => {
  const { t } = useTranslation();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const { data } = await api.get('/applications');
        if (data.success) {
          setApplications(data.applications);
        }
      } catch (err) {
        console.error('Failed to load applications', err);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t('tracker.title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {t('tracker.subtitle')}
          </p>
        </div>

        <Link to="/find-schemes">
          <Button variant="primary" size="md" icon={Plus} className="rounded-xl shadow-xs">
            Find New Scheme
          </Button>
        </Link>
      </div>

      {loading ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">Loading your applications...</p>
      ) : applications.length === 0 ? (
        <EmptyState
          title="No application pathways started yet"
          description="Explore verified schemes and click 'Start Application Pathway' to prepare your documents and track official progress."
          actionLabel="Explore Schemes"
          onAction={() => (window.location.href = '/find-schemes')}
        />
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <Card key={app._id} className="p-6 border-slate-200 dark:border-[#1e2c45]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="primary" size="sm">
                      {app.schemeId?.category}
                    </Badge>
                    {getStatusBadge(app.status)}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {app.schemeId?.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Department: {app.schemeId?.department}
                  </p>
                  {app.referenceNumber && (
                    <p className="text-xs text-slate-700 dark:text-slate-300 font-mono font-semibold pt-1">
                      Receipt Number: {app.referenceNumber}
                    </p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="text-left sm:text-right">
                    <span className="text-xs text-slate-400 dark:text-slate-500 block">Readiness</span>
                    <span className="text-lg font-bold text-gov-700 dark:text-sky-400">
                      {app.readinessScore || 0}%
                    </span>
                  </div>

                  <Link to={`/pathway/${app._id}`}>
                    <Button variant="primary" size="sm" icon={ArrowRight} className="rounded-xl shadow-2xs font-semibold">
                      Open Pathway & Tracker
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicationsPage;
