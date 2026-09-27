import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Building2, MapPin, Calendar, ArrowRight, ShieldCheck, CheckCircle } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

const SchemeCard = ({ scheme, userMatchStatus, matchScore }) => {
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
    <Card hover className="flex flex-col h-full overflow-hidden transition-all duration-200 border-slate-200">
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Top badges: Category, Scope, Demo */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="flex flex-wrap gap-1.5 items-center">
              <Badge variant="primary" size="sm">
                {scheme.category}
              </Badge>
              {scheme.isDemo && (
                <Badge variant="demo" size="sm">
                  DEMO DATA
                </Badge>
              )}
            </div>
            {userMatchStatus && (
              <Badge
                variant={
                  userMatchStatus === 'POTENTIALLY_ELIGIBLE'
                    ? 'success'
                    : userMatchStatus === 'NEEDS_VERIFICATION'
                    ? 'warning'
                    : 'neutral'
                }
                size="sm"
                className="font-medium"
              >
                {matchScore !== undefined ? `${matchScore}% Match` : userMatchStatus}
              </Badge>
            )}
          </div>

          {/* Scheme Name */}
          <Link to={`/schemes/${scheme._id}`}>
            <h3 className="text-lg font-bold text-slate-900 hover:text-gov-700 transition-colors line-clamp-2 mb-1.5">
              {name}
            </h3>
          </Link>

          {/* Department & State Scope */}
          <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-500 mb-3">
            <span className="flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span className="truncate max-w-[200px]">{scheme.department}</span>
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span>{scheme.stateScope || 'All India'}</span>
            </span>
          </div>

          {/* Short Description */}
          <p className="text-sm text-slate-600 line-clamp-3 mb-4 leading-relaxed">
            {desc}
          </p>
        </div>

        {/* Benefit Highlight Box */}
        <div className="bg-gov-50/70 border border-gov-100 rounded-md p-3 mb-4">
          <span className="text-[11px] font-semibold text-gov-800 uppercase tracking-wider block mb-1">
            {t('schemes.benefit')}
          </span>
          <p className="text-xs font-medium text-slate-800 leading-snug">
            {benefit}
          </p>
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-6 py-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
        {verifiedDateStr ? (
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t('schemes.verified_on')}: {verifiedDateStr}</span>
          </span>
        ) : (
          <span />
        )}
        <Link to={`/schemes/${scheme._id}`}>
          <Button variant="ghost" size="sm" className="text-gov-700 hover:text-gov-900 px-2">
            <span>{t('schemes.view_details')}</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </div>
    </Card>
  );
};

export default SchemeCard;
