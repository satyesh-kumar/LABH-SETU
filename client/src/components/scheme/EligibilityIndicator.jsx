import React from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, XCircle, AlertCircle, Info } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

const EligibilityIndicator = ({ evaluation }) => {
  const { t, i18n } = useTranslation();
  const isHi = i18n.language === 'hi';

  if (!evaluation) return null;

  const {
    status,
    matchScore,
    matchedConditions = [],
    failedConditions = [],
    missingConditions = [],
    summary,
    summaryHi,
    disclaimer,
    disclaimerHi,
  } = evaluation;

  let statusConfig = {
    badgeVariant: 'success',
    title: t('eligibility.potentially_eligible'),
    bgClass: 'bg-emerald-50/50 border-emerald-200',
    titleColor: 'text-emerald-900',
  };

  if (status === 'NOT_CURRENTLY_ELIGIBLE') {
    statusConfig = {
      badgeVariant: 'danger',
      title: t('eligibility.not_eligible'),
      bgClass: 'bg-rose-50/50 border-rose-200',
      titleColor: 'text-rose-900',
    };
  } else if (status === 'INSUFFICIENT_DATA') {
    statusConfig = {
      badgeVariant: 'warning',
      title: t('eligibility.insufficient_data'),
      bgClass: 'bg-amber-50/50 border-amber-200',
      titleColor: 'text-amber-900',
    };
  } else if (status === 'NEEDS_VERIFICATION') {
    statusConfig = {
      badgeVariant: 'warning',
      title: t('eligibility.needs_verification'),
      bgClass: 'bg-amber-50/50 border-amber-200',
      titleColor: 'text-amber-900',
    };
  }

  return (
    <div className="space-y-4">
      {/* Top Summary Banner */}
      <div className={`p-4 rounded-lg border ${statusConfig.bgClass}`}>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <Badge variant={statusConfig.badgeVariant} size="lg">
            {statusConfig.title}
          </Badge>
          <span className="text-sm font-semibold text-slate-700">
            {matchScore}% Criteria Match
          </span>
        </div>
        <p className="text-sm text-slate-700 leading-relaxed font-medium">
          {isHi && summaryHi ? summaryHi : summary}
        </p>
      </div>

      {/* Conditions Breakdown */}
      <div className="space-y-3">
        {/* Matched Conditions */}
        {matchedConditions.length > 0 && (
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5 mb-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{t('eligibility.matched_conditions')} ({matchedConditions.length})</span>
            </h4>
            <ul className="space-y-2 text-sm text-slate-700">
              {matchedConditions.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>{isHi && item.descriptionHi ? item.descriptionHi : item.title}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Missing Conditions / Questions required */}
        {missingConditions.length > 0 && (
          <div className="bg-white rounded-lg border border-amber-200 p-4 bg-amber-50/20">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-800 flex items-center gap-1.5 mb-3">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>{t('eligibility.missing_conditions')} ({missingConditions.length})</span>
            </h4>
            <ul className="space-y-2 text-sm text-slate-700">
              {missingConditions.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">⚠</span>
                  <span>{isHi && item.missingInfoPromptHi ? item.missingInfoPromptHi : item.missingInfoPrompt}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Failed Conditions */}
        {failedConditions.length > 0 && (
          <div className="bg-white rounded-lg border border-rose-200 p-4 bg-rose-50/20">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-rose-800 flex items-center gap-1.5 mb-3">
              <XCircle className="w-4 h-4 text-rose-600" />
              <span>{t('eligibility.failed_conditions')} ({failedConditions.length})</span>
            </h4>
            <ul className="space-y-2 text-sm text-slate-700">
              {failedConditions.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold">✗</span>
                  <span>{isHi && item.descriptionHi ? item.descriptionHi : item.title}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Mandatory Disclaimer */}
      <div className="p-3 rounded-md bg-slate-100 border border-slate-200 text-xs text-slate-500 flex items-start gap-2">
        <Info className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
        <p>{isHi && disclaimerHi ? disclaimerHi : disclaimer}</p>
      </div>
    </div>
  );
};

export default EligibilityIndicator;
