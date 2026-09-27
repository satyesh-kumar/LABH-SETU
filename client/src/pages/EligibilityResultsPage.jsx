import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  CheckCircle2,
  AlertTriangle,
  FileQuestion,
  XCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import EligibilityIndicator from '../components/scheme/EligibilityIndicator';

const EligibilityResultsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [resultsData, setResultsData] = useState(null);
  const [activeTab, setActiveTab] = useState('potentiallyEligible');

  useEffect(() => {
    const raw = sessionStorage.getItem('labhsetu_eligibility_results');
    if (raw) {
      try {
        setResultsData(JSON.parse(raw));
      } catch (e) {
        console.error('Failed to parse eligibility results', e);
      }
    }
  }, []);

  if (!resultsData) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">No screening results found</h2>
        <p className="text-sm text-slate-500">
          Please run the eligibility checker first with your profile details.
        </p>
        <Link to="/check-eligibility">
          <Button variant="primary">Go to Eligibility Screener</Button>
        </Link>
      </div>
    );
  }

  const { counts, results } = resultsData;

  const tabs = [
    {
      id: 'potentiallyEligible',
      label: t('eligibility.potentially_eligible'),
      count: counts?.potentiallyEligible || 0,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    },
    {
      id: 'needsVerification',
      label: t('eligibility.needs_verification'),
      count: counts?.needsVerification || 0,
      color: 'text-amber-700 bg-amber-50 border-amber-200',
    },
    {
      id: 'insufficientData',
      label: t('eligibility.insufficient_data'),
      count: counts?.insufficientData || 0,
      color: 'text-sky-700 bg-sky-50 border-sky-200',
    },
    {
      id: 'notEligible',
      label: t('eligibility.not_eligible'),
      count: counts?.notEligible || 0,
      color: 'text-rose-700 bg-rose-50 border-rose-200',
    },
  ];

  const currentList = results?.[activeTab] || [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-gov-700 bg-gov-50 px-2.5 py-1 rounded-md mb-2 border border-gov-200">
            <Sparkles className="w-3.5 h-3.5 text-gov-600" />
            <span>Deterministic Rule-Engine Screening</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Your Preliminary Scheme Match Results
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Based on your answers, here is a transparent breakdown of Central and State schemes
          </p>
        </div>

        <Link to="/check-eligibility">
          <Button variant="outline" size="sm" icon={RotateCcw}>
            Retake Screener
          </Button>
        </Link>
      </div>

      {/* Category Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {tabs.map((tab) => {
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`p-4 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'border-gov-600 ring-2 ring-gov-600 ring-offset-1 bg-white shadow-subtle'
                  : 'border-slate-200 bg-white/70 hover:bg-white hover:border-slate-300'
              }`}
            >
              <span className="text-2xl font-black text-slate-900 block mb-1">
                {tab.count}
              </span>
              <span className="text-xs font-semibold text-slate-600 leading-tight block">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Results List */}
      <div className="space-y-6">
        {currentList.length === 0 ? (
          <Card className="p-8 text-center text-slate-500 text-sm border-dashed">
            No schemes in this specific category for the provided criteria.
          </Card>
        ) : (
          currentList.map((evalItem) => (
            <Card key={evalItem.schemeId} className="p-6 border-slate-200 bg-white">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="primary" size="sm">
                      {evalItem.category}
                    </Badge>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500">{evalItem.department}</span>
                  </div>
                  <Link to={`/schemes/${evalItem.schemeId}`}>
                    <h3 className="text-lg font-bold text-slate-900 hover:text-gov-700 transition-colors">
                      {evalItem.schemeName}
                    </h3>
                  </Link>
                </div>

                <div className="flex items-center gap-3">
                  <Link to={`/schemes/${evalItem.schemeId}`}>
                    <Button variant="primary" size="sm" icon={ArrowRight}>
                      View Scheme & Apply
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <EligibilityIndicator evaluation={evalItem} />
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default EligibilityResultsPage;
