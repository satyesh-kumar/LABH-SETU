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
              <div className="w-8 h-8 rounded-lg bg-gradient-to-b from-[#0b2545] to-[#184f85] border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-xs">
                <svg viewBox="0 0 100 100" className="w-5 h-5 text-amber-300" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="4" />
                  <circle cx="50" cy="50" r="10" fill="currentColor" />
                  {[...Array(24)].map((_, i) => (
                    <line
                      key={i}
                      x1="50"
                      y1="50"
                      x2={50 + 38 * Math.cos((i * 15 * Math.PI) / 180)}
                      y2={50 + 38 * Math.sin((i * 15 * Math.PI) / 180)}
                      stroke="currentColor"
                      strokeWidth="2.5"
                    />
                  ))}
                </svg>
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                {t('app.name')}
              </span>
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
