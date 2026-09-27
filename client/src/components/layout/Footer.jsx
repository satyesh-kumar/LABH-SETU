import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, ExternalLink, Heart } from 'lucide-react';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Identity & Mission */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <svg viewBox="0 0 48 48" className="w-8 h-8 rounded-lg shadow-xs" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="footerLsGrad" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#0b2545" />
                    <stop offset="50%" stopColor="#184f85" />
                    <stop offset="100%" stopColor="#0284c7" />
                  </linearGradient>
                  <linearGradient id="footerAmberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </linearGradient>
                </defs>
                <rect width="48" height="48" rx="12" fill="url(#footerLsGrad)" />
                <rect x="1" y="1" width="46" height="46" rx="11" stroke="#38bdf8" strokeOpacity="0.4" strokeWidth="1.5" />
                <path d="M12 32 C 14 19, 34 19, 36 32" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                <path d="M17 32 C 19 24, 29 24, 31 32" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" opacity="0.85" fill="none" />
                <circle cx="24" cy="17" r="4.5" fill="url(#footerAmberGrad)" />
                <circle cx="24" cy="17" r="1.8" fill="#ffffff" />
                <circle cx="12" cy="32" r="2.2" fill="#38bdf8" />
                <circle cx="36" cy="32" r="2.2" fill="#38bdf8" />
              </svg>
              <div className="flex items-center gap-1">
                <span className="text-lg font-black text-white tracking-tight">
                  Labh<span className="text-sky-400">Setu</span>
                </span>
                <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-sky-950 text-sky-300 border border-sky-800">
                  GOV
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t('home.trust_statement')}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium pt-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Grounded in Verified Official Sources</span>
            </div>
          </div>

          {/* Col 2: Services */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-4">
              Citizen Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/find-schemes" className="hover:text-white transition-colors">
                  {t('nav.find_schemes')}
                </Link>
              </li>
              <li>
                <Link to="/check-eligibility" className="hover:text-white transition-colors">
                  {t('nav.check_eligibility')}
                </Link>
              </li>
              <li>
                <Link to="/documents" className="hover:text-white transition-colors">
                  {t('nav.documents')}
                </Link>
              </li>
              <li>
                <Link to="/applications" className="hover:text-white transition-colors">
                  {t('nav.my_applications')}
                </Link>
              </li>
              <li>
                <Link to="/assistant" className="hover:text-white transition-colors">
                  {t('nav.ai_assistant')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Verified Portals */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-4">
              National Portals
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://india.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>National Portal of India</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://myscheme.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>myScheme Portal</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://pmkisan.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>PM-KISAN Portal</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://pmayg.nic.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>PMAY-Gramin Portal</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Transparency & Help */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-4">
              Help & Transparency
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/help" className="hover:text-white transition-colors">
                  Help Centre & FAQs
                </Link>
              </li>
              <li>
                <Link to="/help#privacy" className="hover:text-white transition-colors">
                  Data Privacy & Document Protection
                </Link>
              </li>
              <li>
                <Link to="/help#feedback" className="hover:text-white transition-colors">
                  Citizen Feedback
                </Link>
              </li>
              <li>
                <Link to="/help#disclaimer" className="hover:text-white transition-colors">
                  Legal Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2026 LabhSetu (Bridge to Benefits). Public service digital assistance platform.</p>
          <div className="flex items-center gap-2">
            <span>Designed for Accessibility & Trust (WCAG 2.1 AA)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
