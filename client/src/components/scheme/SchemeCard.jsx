import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Building2, MapPin, Calendar, ArrowRight, ShieldCheck, CheckCircle2, Sparkles, ExternalLink } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

const SchemeCard = ({ scheme, userMatchStatus, matchScore, onCompareSelect, isCompared }) => {
  const { t, i18n } = useTranslation();
  const isHi = i18n.language === 'hi';

  const name = isHi && scheme.nameHi ? scheme.nameHi : scheme.name;
  const desc = isHi && scheme.shortDescriptionHi ? scheme.shortDescriptionHi : scheme.shortDescription;
  const benefit = isHi && scheme.benefitSummaryHi ? scheme.benefitSummaryHi : scheme.benefitSummary;

  const verifiedDateStr = scheme.verificationDate
    ? new Date(scheme.verificationDate).toLocaleDateString(isHi ? 'hi-IN' : 'en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : null;

  return (
    <Card hover className="flex flex-col h-full overflow-hidden transition-all duration-200 border-slate-200 dark:border-[#1e2c45] hover:border-gov-400 dark:hover:border-sky-500/50 hover:shadow-elevation">
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Top badges: Category, Scope, Demo, Compare */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="flex flex-wrap gap-1.5 items-center">
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-gov-50 dark:bg-sky-950/70 text-gov-800 dark:text-sky-300 border border-gov-200 dark:border-sky-800">
                {scheme.category}
              </span>
              {scheme.isDemo && (
                <Badge variant="demo" size="sm">
                  DEMO DATA
                </Badge>
              )}
            </div>

            {userMatchStatus ? (
              <Badge
                variant={
                  userMatchStatus === 'POTENTIALLY_ELIGIBLE'
                    ? 'success'
                    : userMatchStatus === 'NEEDS_VERIFICATION'
                    ? 'warning'
                    : 'neutral'
                }
                size="sm"
                className="font-bold"
              >
                {matchScore !== undefined ? `${matchScore}% Match` : userMatchStatus}
              </Badge>
            ) : (
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                {scheme.benefitType || 'Direct Benefit'}
              </span>
            )}
          </div>

          {/* Scheme Name */}
          <Link to={`/schemes/${scheme._id}`}>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white hover:text-gov-700 dark:hover:text-sky-400 transition-colors line-clamp-2 mb-2 leading-snug">
              {name}
            </h3>
          </Link>

          {/* Department & State Scope */}
          <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-500 dark:text-slate-400 mb-3.5">
            <span className="flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span className="truncate max-w-[180px]">{scheme.department}</span>
            </span>
            <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span>{scheme.stateScope || 'All India'}</span>
            </span>
          </div>

          {/* Short Description */}
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 mb-4 leading-relaxed">
            {desc}
          </p>
        </div>

        {/* Benefit Highlight Box */}
        <div className="bg-gradient-to-br from-gov-50 to-blue-50/40 dark:from-slate-800/90 dark:to-slate-800/40 border border-gov-200/80 dark:border-slate-700 rounded-xl p-3.5 mb-4 shadow-2xs">
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className="text-[10px] font-bold text-gov-800 dark:text-sky-300 uppercase tracking-wider">
              {t('schemes.benefit')}
            </span>
            <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-100/80 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
              Verified Benefit
            </span>
          </div>
          <p className="text-xs font-bold text-gov-950 dark:text-slate-100 leading-snug">
            {benefit}
          </p>
        </div>
      </div>

      {/* Card Footer with 2 clear actions */}
      <div className="px-5 py-3.5 bg-slate-50/90 dark:bg-[#0c1322]/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
        {verifiedDateStr && (
          <span className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1 truncate max-w-[130px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <span className="truncate">{verifiedDateStr}</span>
          </span>
        )}

        <div className="flex items-center gap-2 ml-auto">
          <Link to={`/schemes/${scheme._id}`}>
            <Button variant="primary" size="sm" className="font-semibold text-xs py-1.5 px-3 rounded-lg shadow-2xs">
              <span>{t('schemes.view_details')}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default SchemeCard;
