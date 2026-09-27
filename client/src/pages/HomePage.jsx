import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Search,
  CheckCircle2,
  FileText,
  Clock,
  ArrowRight,
  ShieldCheck,
  Building,
  Users,
  Compass,
  FileCheck,
  HelpCircle,
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const HomePage = () => {
  const { t } = useTranslation();

  const quickActions = [
    {
      title: t('home.action_schemes'),
      desc: 'Browse Central and State government welfare and development programs.',
      icon: Search,
      to: '/find-schemes',
      color: 'bg-blue-50 text-gov-700 border-blue-200',
    },
    {
      title: t('home.action_eligibility'),
      desc: 'Answer a few adaptive questions to evaluate your preliminary eligibility.',
      icon: CheckCircle2,
      to: '/check-eligibility',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      title: t('home.action_documents'),
      desc: 'Upload identity and income proofs to check readiness and extract details via OCR.',
      icon: FileText,
      to: '/documents',
      color: 'bg-purple-50 text-purple-700 border-purple-200',
    },
    {
      title: t('home.action_tracker'),
      desc: 'Track your application status and log official portal reference receipts.',
      icon: Clock,
      to: '/applications',
      color: 'bg-amber-50 text-amber-700 border-amber-200',
    },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-gov-50 via-slate-50 to-white py-16 sm:py-20 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gov-100 text-gov-900 text-xs font-semibold mb-6 border border-gov-200">
            <span className="w-2 h-2 rounded-full bg-gov-600 animate-pulse"></span>
            <span>{t('app.subtitle')}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight max-w-3xl mx-auto mb-6">
            {t('home.hero_title')}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            {t('home.hero_desc')}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/find-schemes">
              <Button size="lg" variant="primary" icon={Search} className="px-6 py-3 text-base">
                {t('home.cta_find')}
              </Button>
            </Link>
            <Link to="/check-eligibility">
              <Button size="lg" variant="outline" icon={CheckCircle2} className="px-6 py-3 text-base bg-white">
                {t('home.cta_check')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Access Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              {t('home.quick_actions')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Start your citizen journey with core guidance tools
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((act, idx) => {
            const Icon = act.icon;
            return (
              <Link key={idx} to={act.to} className="group">
                <Card hover className="p-6 h-full flex flex-col justify-between border-slate-200">
                  <div>
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 border ${act.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-gov-700 transition-colors mb-2">
                      {act.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {act.desc}
                    </p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-1 text-xs font-semibold text-gov-600 group-hover:text-gov-800">
                    <span>Access Tool</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* How it Works 4-Step Stepper */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 shadow-subtle">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
              {t('home.how_it_works_title')}
            </h2>
            <p className="text-sm text-slate-600">
              {t('home.how_it_works_subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-gov-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900">
                {t('home.step1_title')}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t('home.step1_desc')}
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-gov-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900">
                {t('home.step2_title')}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t('home.step2_desc')}
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-gov-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900">
                {t('home.step3_title')}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t('home.step3_desc')}
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-gov-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                4
              </div>
              <h3 className="text-base font-bold text-slate-900">
                {t('home.step4_title')}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t('home.step4_desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Transparency Guarantee Banner (Section 46) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-2xl p-8 sm:p-10 text-white shadow-elevation flex flex-col md:flex-row items-center justify-between gap-8 border border-slate-800">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Public Service Transparency Guarantee</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
              {t('home.trust_title')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {t('home.trust_statement')}
            </p>
          </div>
          <Link to="/help" className="flex-shrink-0">
            <Button size="md" variant="secondary" className="bg-white text-slate-900 hover:bg-slate-100">
              Read Verification Norms
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
