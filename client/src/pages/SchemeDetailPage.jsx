import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Building2,
  MapPin,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Clock,
  ArrowRight,
  Share2,
  BookOpen,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { ErrorState } from '../components/ui/EmptyState';

const SchemeDetailPage = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const isHi = i18n.language === 'hi';
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { success, info } = useToast();

  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [creatingApp, setCreatingApp] = useState(false);

  useEffect(() => {
    const fetchScheme = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/schemes/${id}`);
        if (data.success) {
          setScheme(data.scheme);
        }
      } catch (err) {
        setError(err.message || 'Scheme not found');
      } finally {
        setLoading(false);
      }
    };
    fetchScheme();
  }, [id]);

  const handleStartPathway = async () => {
    if (!isAuthenticated) {
      info('Please login or register to track your application pathway.');
      navigate('/login');
      return;
    }

    setCreatingApp(true);
    try {
      const { data } = await api.post('/applications', { schemeId: id });
      if (data.success) {
        success('Application guidance pathway started!');
        navigate(`/pathway/${data.application._id}`);
      }
    } catch (err) {
      console.error('Error starting pathway', err);
    } finally {
      setCreatingApp(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center text-slate-500">
        <div className="w-8 h-8 border-4 border-gov-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm">Loading official scheme details...</p>
      </div>
    );
  }

  if (error || !scheme) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <ErrorState description={error || 'Scheme could not be loaded.'} />
      </div>
    );
  }

  const name = isHi && scheme.nameHi ? scheme.nameHi : scheme.name;
  const shortDesc = isHi && scheme.shortDescriptionHi ? scheme.shortDescriptionHi : scheme.shortDescription;
  const fullDesc = isHi && scheme.fullDescriptionHi ? scheme.fullDescriptionHi : scheme.fullDescription;
  const benefit = isHi && scheme.benefitSummaryHi ? scheme.benefitSummaryHi : scheme.benefitSummary;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Breadcrumb & Metadata Card */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link to="/" className="hover:text-gov-700">Home</Link>
          <span>/</span>
          <Link to="/find-schemes" className="hover:text-gov-700">Find Schemes</Link>
          <span>/</span>
          <span className="text-slate-700 font-medium truncate max-w-xs">{name}</span>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-subtle space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="primary" size="md">
                {scheme.category}
              </Badge>
              {scheme.isDemo && <Badge variant="demo">OFFICIAL DEMO</Badge>}
              <Badge variant="neutral" size="md">
                Version {scheme.version || 1}
              </Badge>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Verified: {new Date(scheme.verificationDate).toLocaleDateString()}</span>
            </div>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
              {name}
            </h1>
            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs sm:text-sm text-slate-500">
              <span className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-slate-400" />
                <span>{scheme.department}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>{scheme.stateScope || 'All India'}</span>
              </span>
            </div>
          </div>

          <div className="bg-gov-50/60 p-4 rounded-xl border border-gov-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-gov-800 block mb-1">
                Key Benefit Summary
              </span>
              <p className="text-sm font-bold text-slate-900">{benefit}</p>
            </div>
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <Button
                variant="primary"
                size="md"
                onClick={handleStartPathway}
                isLoading={creatingApp}
                icon={ArrowRight}
              >
                Start Application Pathway
              </Button>
              {scheme.officialPortalUrl && (
                <a
                  href={scheme.officialPortalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="md" icon={ExternalLink}>
                    Official Portal
                  </Button>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Details + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Comprehensive Overview, Rules, Requirements */}
        <div className="lg:col-span-2 space-y-8">
          {/* Detailed Overview */}
          <Card className="p-6 border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-gov-600" />
              <span>Scheme Description & Objectives</span>
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {fullDesc || shortDesc}
            </p>
          </Card>

          {/* Eligibility Rules */}
          <Card className="p-6 border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Mandatory & Listed Eligibility Criteria</span>
            </h2>
            <div className="space-y-3">
              {(scheme.eligibilityRules || []).length === 0 ? (
                <p className="text-xs text-slate-500">General eligibility applies to residents.</p>
              ) : (
                scheme.eligibilityRules.map((rule) => (
                  <div key={rule._id} className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-gov-600 mt-1.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-semibold text-slate-800">
                        {isHi && rule.titleHi ? rule.titleHi : rule.title}
                      </h4>
                      <p className="text-xs text-slate-600 mt-0.5">
                        {isHi && rule.descriptionHi ? rule.descriptionHi : rule.description}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Required Documents */}
          <Card className="p-6 border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <FileText className="w-5 h-5 text-gov-600" />
              <span>Required Certificates & Documents</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(scheme.requirements || []).map((req) => (
                <div key={req._id} className="p-3 rounded-lg border border-slate-200 bg-white flex items-start gap-2.5">
                  <FileText className="w-4 h-4 text-gov-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">
                      {isHi && req.titleHi ? req.titleHi : req.title}
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      {req.isMandatory ? 'Mandatory Proof' : 'Optional / If applicable'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Sidebar: Official Sources, Steps */}
        <div className="space-y-6">
          {/* Official Departmental Source (Section 43 & 44) */}
          <Card className="p-6 border-slate-200 bg-slate-50/50">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-2">
              Official Source & Administration
            </span>
            <div className="space-y-3">
              <div>
                <span className="text-xs text-slate-400 block">Department</span>
                <span className="text-xs font-semibold text-slate-800">{scheme.department}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Ministry</span>
                <span className="text-xs font-semibold text-slate-800">{scheme.ministry || 'Government of India'}</span>
              </div>
              {scheme.officialPortalUrl && (
                <div className="pt-2">
                  <a
                    href={scheme.officialPortalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-gov-700 hover:text-gov-900 underline"
                  >
                    <span>Visit Verified Portal ({new URL(scheme.officialPortalUrl).hostname})</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          </Card>

          {/* Guidance Disclaimer Card */}
          <Card className="p-6 border-amber-200 bg-amber-50/40 text-xs text-amber-900 space-y-2">
            <h4 className="font-bold flex items-center gap-1.5 text-amber-800">
              <ShieldCheck className="w-4 h-4" />
              <span>Official Guidance Notice</span>
            </h4>
            <p className="leading-relaxed">
              LabhSetu helps you prepare documents and understand eligibility conditions. The final decision to grant benefits rests entirely with the administering department.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SchemeDetailPage;
