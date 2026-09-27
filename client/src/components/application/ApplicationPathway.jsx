import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  FileCheck2,
  FolderOpen,
  FormInput,
  ExternalLink,
  Send,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

const ApplicationPathway = ({ application, scheme, onUpdateStep }) => {
  const { t } = useTranslation();

  const steps = [
    {
      step: 1,
      title: 'Review Scheme Conditions',
      desc: 'Understand age, income, and category eligibility rules before preparing.',
      icon: FileCheck2,
      isDone: (application?.stepsCompleted || []).includes(1),
    },
    {
      step: 2,
      title: 'Prepare & Verify Documents',
      desc: 'Upload required Aadhaar, Income certificate, and passbook to verify OCR readiness.',
      icon: FolderOpen,
      isDone: (application?.readinessScore || 0) >= 80 || (application?.stepsCompleted || []).includes(2),
    },
    {
      step: 3,
      title: 'Access Designated Official Portal',
      desc: 'Navigate directly to the official government portal administering this scheme.',
      icon: ExternalLink,
      isDone: (application?.stepsCompleted || []).includes(3),
      action: scheme?.officialPortalUrl ? (
        <a
          href={scheme.officialPortalUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => onUpdateStep && onUpdateStep(3)}
        >
          <Button size="sm" variant="primary" icon={ExternalLink}>
            {t('tracker.btn_open_portal')}
          </Button>
        </a>
      ) : null,
    },
    {
      step: 4,
      title: 'Fill Official Department Application',
      desc: 'Fill out the prescribed online/offline departmental form on the official website.',
      icon: FormInput,
      isDone: (application?.stepsCompleted || []).includes(4),
    },
    {
      step: 5,
      title: 'Submit & Obtain Reference Number',
      desc: 'Submit the application and receive your official acknowledgment receipt.',
      icon: Send,
      isDone: !!application?.referenceNumber || (application?.stepsCompleted || []).includes(5),
    },
    {
      step: 6,
      title: 'Track Personal Timeline',
      desc: 'Log reference number and monitor review status until final sanction.',
      icon: Clock,
      isDone: application?.status === 'approved',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900">{t('tracker.stepper_title')}</h3>
          <p className="text-xs text-slate-500">
            A guided walkthrough from preparation to official government submission
          </p>
        </div>
        <Badge variant="primary" size="md">
          {application?.stepsCompleted?.length || 1} of 6 Completed
        </Badge>
      </div>

      <div className="relative border-l-2 border-slate-200 ml-4 space-y-8 pl-6 my-4">
        {steps.map((st) => {
          const Icon = st.icon;
          return (
            <div key={st.step} className="relative group">
              {/* Step indicator circle */}
              <div
                className={`absolute -left-[35px] top-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                  st.isDone
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white border-2 border-slate-300 text-slate-600'
                }`}
              >
                {st.isDone ? <CheckCircle2 className="w-5 h-5" /> : st.step}
              </div>

              <div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className={`text-sm font-semibold ${st.isDone ? 'text-slate-900' : 'text-slate-700'}`}>
                    {st.title}
                  </h4>
                  {st.isDone ? (
                    <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                      Completed
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-slate-400">Step {st.step}</span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed max-w-xl">
                  {st.desc}
                </p>
                {st.action && <div className="mt-3">{st.action}</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ApplicationPathway;
