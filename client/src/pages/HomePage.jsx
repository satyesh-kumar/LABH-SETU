import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  Sparkles,
  ChevronDown,
  ChevronUp,
  Wheat,
  GraduationCap,
  HeartPulse,
  Home,
  Briefcase,
  Hammer,
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

const HomePage = () => {
  const { t, i18n } = useTranslation();
  const isHi = i18n.language === 'hi';
  const navigate = useNavigate();

  // 1-Click Quick Screener State
  const [quickPersona, setQuickPersona] = useState('farmer');
  const [quickState, setQuickState] = useState('All India');
  const [quickIncome, setQuickIncome] = useState('200000');
  const [openFaq, setOpenFaq] = useState(null);

  const handleQuickMatch = (e) => {
    e.preventDefault();
    // Navigate to find-schemes with category pre-selected
    let categoryParam = 'All';
    if (quickPersona === 'farmer') categoryParam = 'Agriculture';
    if (quickPersona === 'student') categoryParam = 'Education';
    if (quickPersona === 'business') categoryParam = 'Entrepreneurship';
    if (quickPersona === 'worker') categoryParam = 'Employment';

    navigate(`/find-schemes?category=${categoryParam}&state=${encodeURIComponent(quickState)}`);
  };

  const categories = [
    {
      id: 'Agriculture',
      name: isHi ? 'कृषि एवं किसान कल्याण' : 'Agriculture & Farmers',
      icon: Wheat,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:border-emerald-400',
      popular: 'PM-KISAN, Fasal Bima',
    },
    {
      id: 'Education',
      name: isHi ? 'शिक्षा एवं छात्रवृत्ति' : 'Education & Scholarships',
      icon: GraduationCap,
      color: 'bg-blue-50 text-blue-700 border-blue-200 hover:border-blue-400',
      popular: 'NMMSS, Central Merit',
    },
    {
      id: 'Health',
      name: isHi ? 'स्वास्थ्य एवं चिकित्सा' : 'Healthcare & Insurance',
      icon: HeartPulse,
      color: 'bg-rose-50 text-rose-700 border-rose-200 hover:border-rose-400',
      popular: 'Ayushman Bharat PM-JAY',
    },
    {
      id: 'Housing',
      name: isHi ? 'आवास एवं पुनर्वास' : 'Housing & Shelter',
      icon: Home,
      color: 'bg-amber-50 text-amber-700 border-amber-200 hover:border-amber-400',
      popular: 'PMAY-Gramin, Urban',
    },
    {
      id: 'Entrepreneurship',
      name: isHi ? 'उद्यम एवं मुद्रा ऋण' : 'Business & Mudra Loans',
      icon: Briefcase,
      color: 'bg-purple-50 text-purple-700 border-purple-200 hover:border-purple-400',
      popular: 'Mudra Shishu & Kishore',
    },
    {
      id: 'Employment',
      name: isHi ? 'रोजगार एवं कौशल' : 'Guaranteed Employment',
      icon: Hammer,
      color: 'bg-sky-50 text-sky-700 border-sky-200 hover:border-sky-400',
      popular: 'MGNREGA 100 Days Job',
    },
  ];

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

  const faqs = [
    {
      q: isHi ? 'लाभसेतु क्या है और यह नागरिकों की मदद कैसे करता है?' : 'What is LabhSetu and how does it help citizens?',
      a: isHi
        ? 'लाभसेतु एक सार्वजनिक सूचना एवं मार्गदर्शन मंच है जो नागरिकों को उनकी प्रोफाइल के अनुसार सही सरकारी योजनाओं की खोज करने, पात्रता शर्तों को समझने और आवश्यक दस्तावेजों को तैयार करने में मदद करता है।'
        : 'LabhSetu is a public service guidance platform that helps citizens discover relevant Central & State government schemes, verify preliminary eligibility with transparent rules, prepare verified documents via OCR, and navigate directly to official government portals.',
    },
    {
      q: isHi ? 'क्या लाभसेतु सीधे योजना के लाभ स्वीकृत करता है?' : 'Does LabhSetu directly approve or disburse benefits?',
      a: isHi
        ? 'नहीं। लाभसेतु केवल एक सूचनात्मक और तैयारी मंच है। अंतिम पात्रता, आवेदन स्वीकृति और लाभ का वितरण केवल संबंधित सरकारी विभाग या मंत्रालय द्वारा किया जाता है।'
        : 'No. LabhSetu is an informational guidance layer. Final approval, sanction, and financial disbursement rest strictly with the concerned government authority. We guide you to official portals without middleman exploitation.',
    },
    {
      q: isHi ? 'दस्तावेज़ ओसीआर (OCR) कैसे सुरक्षित है?' : 'How is document OCR kept private and secure?',
      a: isHi
        ? 'सभी दस्तावेज़ों के संवेदनशील नंबर (जैसे आधार और पैन) स्वचालित रूप से मास्क कर दिए जाते हैं। आपकी स्पष्ट सहमति के बिना कोई भी जानकारी प्रोफाइल में अपडेट नहीं होती।'
        : 'All uploaded documents are processed securely. Identity numbers (like Aadhaar and PAN) are automatically masked (e.g., XXXX-XXXX-3410), and extracted details are presented for your review before saving.',
    },
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-gov-50/80 via-slate-50 to-white dark:from-slate-900/60 dark:via-[#0c1322] dark:to-[#0c1322] pt-12 sm:pt-16 pb-16 border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-800 text-gov-800 dark:text-sky-300 text-xs font-bold shadow-subtle border border-gov-200/80 dark:border-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-[#138808] animate-pulse"></span>
            <span>{t('app.subtitle')}</span>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <span className="text-[#1b5e9c] dark:text-sky-400 font-semibold">100% Transparent Screening</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15] max-w-4xl mx-auto">
            {t('home.hero_title')}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium">
            {t('home.hero_desc')}
          </p>

          {/* 1-Click Interactive Citizen Quick Screener Card */}
          <div className="max-w-3xl mx-auto bg-white dark:bg-[#111a2e] rounded-2xl p-5 sm:p-6 shadow-elevation border border-slate-200 dark:border-[#1e2c45] text-left mt-8">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-[#FF9933]" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Quick Scheme Matcher (No Login Required)
              </span>
            </div>

            <form onSubmit={handleQuickMatch} className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">I am a</label>
                <select
                  value={quickPersona}
                  onChange={(e) => setQuickPersona(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-gov-600"
                >
                  <option value="farmer">🌾 Farmer / Kisan</option>
                  <option value="student">🎓 Student</option>
                  <option value="business">💼 Small Business / MSME</option>
                  <option value="worker">👷 Rural / Daily Worker</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">Resident of</label>
                <select
                  value={quickState}
                  onChange={(e) => setQuickState(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-gov-600"
                >
                  <option value="All India">All India / Central</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Bihar">Bihar</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Delhi">Delhi</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">Annual Income</label>
                <select
                  value={quickIncome}
                  onChange={(e) => setQuickIncome(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-gov-600"
                >
                  <option value="150000">Under ₹2 Lakh</option>
                  <option value="300000">₹2 Lakh - ₹5 Lakh</option>
                  <option value="800000">Above ₹5 Lakh</option>
                </select>
              </div>

              <div>
                <Button type="submit" variant="primary" size="md" className="w-full font-bold py-2.5 rounded-xl">
                  Find Schemes
                </Button>
              </div>
            </form>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <Link to="/find-schemes">
              <Button size="lg" variant="primary" icon={Search} className="px-6 py-3 font-bold shadow-md rounded-xl">
                {t('home.cta_find')}
              </Button>
            </Link>
            <Link to="/check-eligibility">
              <Button size="lg" variant="outline" icon={CheckCircle2} className="px-6 py-3 font-bold bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 shadow-xs rounded-xl">
                {t('home.cta_check')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Category Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Explore by Socio-Economic Category
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Find schemes tailored to your specific trade, education, or household needs
            </p>
          </div>
          <Link to="/find-schemes" className="text-xs font-bold text-gov-700 dark:text-sky-400 hover:text-gov-900 flex items-center gap-1">
            <span>View All Sectors</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link key={cat.id} to={`/find-schemes?category=${cat.id}`} className="group">
                <Card hover className="p-6 h-full flex flex-col justify-between border-slate-200 dark:border-[#1e2c45] transition-all group-hover:border-gov-400">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border ${cat.color} group-hover:scale-105 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-gov-700 dark:group-hover:text-sky-400 transition-colors">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Popular: <span className="font-medium text-slate-700 dark:text-slate-300">{cat.popular}</span>
                      </p>
                    </div>
                  </div>
                  <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-gov-600 dark:text-sky-400 group-hover:text-gov-800">
                    <span>Explore Schemes</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Quick Access Tools */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {t('home.quick_actions')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Citizen self-service tools for verification and document intelligence
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {quickActions.map((act, idx) => {
            const Icon = act.icon;
            return (
              <Link key={idx} to={act.to} className="group">
                <Card hover className="p-6 h-full flex flex-col justify-between border-slate-200 dark:border-[#1e2c45]">
                  <div>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 border ${act.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-gov-700 dark:group-hover:text-sky-400 transition-colors mb-1.5">
                      {act.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {act.desc}
                    </p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1 text-xs font-semibold text-gov-600 dark:text-sky-400 group-hover:text-gov-800">
                    <span>Open Tool</span>
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
        <div className="bg-white dark:bg-[#111a2e] rounded-2xl border border-slate-200 dark:border-[#1e2c45] p-8 sm:p-12 shadow-subtle">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-gov-600 dark:text-sky-400 uppercase tracking-wider block mb-1">
              Structured Guidance
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
              {t('home.how_it_works_title')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              {t('home.how_it_works_subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3 relative">
              <div className="w-11 h-11 rounded-xl bg-gov-600 text-white font-extrabold flex items-center justify-center text-base shadow-gov">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {t('home.step1_title')}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {t('home.step1_desc')}
              </p>
            </div>

            <div className="space-y-3 relative">
              <div className="w-11 h-11 rounded-xl bg-gov-600 text-white font-extrabold flex items-center justify-center text-base shadow-gov">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {t('home.step2_title')}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {t('home.step2_desc')}
              </p>
            </div>

            <div className="space-y-3 relative">
              <div className="w-11 h-11 rounded-xl bg-gov-600 text-white font-extrabold flex items-center justify-center text-base shadow-gov">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {t('home.step3_title')}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {t('home.step3_desc')}
              </p>
            </div>

            <div className="space-y-3 relative">
              <div className="w-11 h-11 rounded-xl bg-gov-600 text-white font-extrabold flex items-center justify-center text-base shadow-gov">
                4
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {t('home.step4_title')}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {t('home.step4_desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions Accordion */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Common questions on eligibility calculation, document readiness, and official submissions
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <Card
                key={idx}
                className="overflow-hidden border-slate-200 dark:border-[#1e2c45] transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-900 dark:text-white hover:text-gov-700 dark:hover:text-sky-400"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-gov-600 dark:text-sky-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                    {faq.a}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </section>

      {/* Trust & Transparency Guarantee Banner (Section 46) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-gov-950 via-gov-900 to-gov-950 rounded-2xl p-8 sm:p-10 text-white shadow-elevation flex flex-col md:flex-row items-center justify-between gap-8 border border-gov-800">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>National Digital Public Good Standard</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              {t('home.trust_title')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              {t('home.trust_statement')}
            </p>
          </div>
          <Link to="/help" className="flex-shrink-0">
            <Button size="md" variant="secondary" className="bg-white text-gov-950 hover:bg-slate-100 font-bold">
              Read Verification Norms
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
