import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Menu,
  X,
  Languages,
  User,
  Shield,
  FileText,
  Search,
  CheckCircle2,
  Bot,
  HelpCircle,
  LogOut,
  ChevronDown,
  Sparkles,
  ExternalLink,
  SlidersHorizontal,
  BookmarkCheck,
  Building2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';

// Authentic Ashoka Chakra Vector Icon
const AshokaChakraIcon = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="46" stroke="#000080" strokeWidth="4" />
    <circle cx="50" cy="50" r="10" fill="#000080" />
    {[...Array(24)].map((_, i) => (
      <line
        key={i}
        x1="50"
        y1="50"
        x2={50 + 38 * Math.cos((i * 15 * Math.PI) / 180)}
        y2={50 + 38 * Math.sin((i * 15 * Math.PI) / 180)}
        stroke="#000080"
        strokeWidth="2.5"
      />
    ))}
  </svg>
);

const Header = () => {
  const { t, i18n } = useTranslation();
  const isHi = i18n.language === 'hi';
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, login } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [demoDropdownOpen, setDemoDropdownOpen] = useState(false);
  const [fontSize, setFontSize] = useState('normal'); // 'small', 'normal', 'large'

  const userDropdownRef = useRef(null);
  const demoDropdownRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
      if (demoDropdownRef.current && !demoDropdownRef.current.contains(event.target)) {
        setDemoDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'hi' ? 'en' : 'hi';
    i18n.changeLanguage(nextLang);
  };

  const adjustFontSize = (size) => {
    setFontSize(size);
    const root = document.documentElement;
    if (size === 'small') {
      root.style.fontSize = '14.5px';
    } else if (size === 'normal') {
      root.style.fontSize = '16px';
    } else if (size === 'large') {
      root.style.fontSize = '17.5px';
    }
  };

  const handleQuickDemoLogin = async (email, password) => {
    setDemoDropdownOpen(false);
    try {
      await login(email, password);
      if (email.includes('admin')) {
        navigate('/admin');
      } else {
        navigate('/find-schemes');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const navLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/find-schemes', label: t('nav.find_schemes') },
    { to: '/check-eligibility', label: t('nav.check_eligibility'), highlight: true },
    { to: '/applications', label: t('nav.my_applications') },
    { to: '/documents', label: t('nav.documents') },
    { to: '/assistant', label: t('nav.ai_assistant'), badge: 'AI' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-xs border-b border-slate-200">
      {/* 1. National Tricolor Strip */}
      <div className="h-[3px] w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

      {/* 2. Top Government Administration Utility Strip */}
      <div className="bg-[#0b2545] text-slate-200 text-xs py-1.5 px-4 sm:px-8 border-b border-[#133966]">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          {/* Left: National Identity & Slogan */}
          <div className="flex items-center gap-2.5">
            <AshokaChakraIcon className="w-4 h-4 text-sky-200" />
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-white tracking-wide text-[11px] sm:text-xs">
                {isHi ? 'भारत सरकार' : 'GOVERNMENT OF INDIA'}
              </span>
              <span className="text-slate-400 text-[10px]">|</span>
              <span className="hidden sm:inline-block text-[11px] text-slate-300 font-medium">
                {isHi ? 'केंद्रीय सार्वजनिक योजना सूचना पोर्टल' : 'Ministry of Electronics & Information Technology'}
              </span>
            </div>
          </div>

          {/* Right: Accessibility Controls, Language, Demo Selector */}
          <div className="flex items-center gap-3">
            {/* Skip to Main Content (Accessibility Standard) */}
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only text-[11px] text-white bg-gov-600 px-2 py-0.5 rounded"
            >
              Skip to Content
            </a>

            {/* Font Size Accessibility Adjuster */}
            <div className="hidden md:flex items-center gap-1 bg-[#133966]/60 px-2 py-0.5 rounded border border-[#1e4c85] text-[11px] text-slate-300">
              <span className="text-[10px] text-slate-400 mr-1">Text:</span>
              <button
                onClick={() => adjustFontSize('small')}
                className={`px-1.5 py-0.5 rounded hover:text-white transition-colors ${
                  fontSize === 'small' ? 'bg-gov-600 font-bold text-white' : ''
                }`}
                title="Small Text"
              >
                A-
              </button>
              <button
                onClick={() => adjustFontSize('normal')}
                className={`px-1.5 py-0.5 rounded hover:text-white transition-colors ${
                  fontSize === 'normal' ? 'bg-gov-600 font-bold text-white' : ''
                }`}
                title="Standard Text"
              >
                A
              </button>
              <button
                onClick={() => adjustFontSize('large')}
                className={`px-1.5 py-0.5 rounded hover:text-white transition-colors ${
                  fontSize === 'large' ? 'bg-gov-600 font-bold text-white' : ''
                }`}
                title="Enlarged Text"
              >
                A+
              </button>
            </div>

            {/* Quick Demo Switcher Dropdown (for Evaluators / Testers) */}
            <div className="relative" ref={demoDropdownRef}>
              <button
                onClick={() => setDemoDropdownOpen(!demoDropdownOpen)}
                className="hidden sm:flex items-center gap-1 text-[11px] font-semibold text-amber-200 bg-amber-950/70 hover:bg-amber-900/80 px-2.5 py-0.5 rounded border border-amber-600/40 transition-colors"
                title="Instant Demo Personas"
              >
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Demo Accounts</span>
                <ChevronDown className="w-3 h-3 text-amber-300" />
              </button>

              {demoDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-60 bg-white rounded-xl shadow-elevation border border-slate-200 py-1.5 z-50 text-slate-800">
                  <div className="px-3.5 py-1.5 border-b border-slate-100">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Instant 1-Click Persona Login
                    </p>
                  </div>
                  <button
                    onClick={() => handleQuickDemoLogin('citizen@labhsetu.gov.in', 'password123')}
                    className="w-full text-left px-3.5 py-2 hover:bg-gov-50 text-xs transition-colors flex items-start gap-2"
                  >
                    <span className="text-base">🌾</span>
                    <div>
                      <p className="font-bold text-slate-900">Rameshwar Sharma</p>
                      <p className="text-[10px] text-slate-500">Citizen • Small Farmer (UP)</p>
                    </div>
                  </button>
                  <button
                    onClick={() => handleQuickDemoLogin('admin@labhsetu.gov.in', 'password123')}
                    className="w-full text-left px-3.5 py-2 hover:bg-amber-50 text-xs transition-colors flex items-start gap-2 border-t border-slate-100"
                  >
                    <span className="text-base">🏛️</span>
                    <div>
                      <p className="font-bold text-amber-950">Priya Sundaram</p>
                      <p className="text-[10px] text-slate-500">Administrator • Director</p>
                    </div>
                  </button>
                  <button
                    onClick={() => handleQuickDemoLogin('operator@labhsetu.gov.in', 'password123')}
                    className="w-full text-left px-3.5 py-2 hover:bg-sky-50 text-xs transition-colors flex items-start gap-2 border-t border-slate-100"
                  >
                    <span className="text-base">🖥️</span>
                    <div>
                      <p className="font-bold text-sky-950">Amit Verma</p>
                      <p className="text-[10px] text-slate-500">Assisted Operator • CSC</p>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* High-Contrast Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 text-xs text-white font-bold py-1 px-3 rounded-full bg-[#1b5e9c] hover:bg-[#184f85] border border-sky-400/30 transition-all shadow-xs"
              title="Toggle English / हिंदी"
              aria-label="Change language"
            >
              <Languages className="w-3.5 h-3.5 text-amber-400" />
              <span>{isHi ? 'English' : 'हिंदी'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo Branding */}
          <Link to="/" className="flex items-center gap-3.5 group focus:outline-none flex-shrink-0">
            {/* National Crest Badge */}
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gov-700 via-gov-800 to-gov-950 flex items-center justify-center text-white shadow-gov border border-gov-600/40 group-hover:scale-102 transition-transform">
              <div className="text-center">
                <span className="block font-black text-lg tracking-tight leading-none text-white">LS</span>
                <span className="block text-[8px] font-bold text-sky-300 tracking-widest uppercase leading-none mt-0.5">GOV</span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-gov-950 group-hover:text-gov-700 transition-colors">
                  {isHi ? 'लाभसेतु' : 'LABHSETU'}
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  VERIFIED
                </span>
              </div>
              <p className="text-[11px] font-semibold text-slate-500 leading-tight">
                {isHi ? 'कल्याणकारी योजनाओं तक सेतु' : 'Bridge to Benefits'} •{' '}
                <span className="text-gov-700 font-bold">
                  {isHi ? 'सार्वजनिक सेवा मंच' : 'National Scheme Gateway'}
                </span>
              </p>
            </div>
          </Link>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative px-3.5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                    active
                      ? 'text-gov-900 bg-gov-50 font-bold shadow-2xs border border-gov-100'
                      : link.highlight
                      ? 'text-gov-800 hover:bg-gov-50/60 font-semibold'
                      : 'text-slate-600 hover:text-gov-900 hover:bg-slate-100/70'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-full bg-sky-100 text-sky-800">
                      {link.badge}
                    </span>
                  )}
                  {active && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-gov-600 rounded-full" />
                  )}
                </Link>
              );
            })}

            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className={`px-3 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-1.5 ${
                  isActive('/admin')
                    ? 'text-amber-950 bg-amber-100 font-extrabold border border-amber-300'
                    : 'text-amber-800 bg-amber-50 hover:bg-amber-100/80 border border-amber-200'
                }`}
              >
                <Shield className="w-4 h-4 text-amber-700" />
                <span>{t('nav.admin')}</span>
              </Link>
            )}
          </nav>

          {/* Right Action Section */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Quick Search Shortcut Button */}
            <Link
              to="/find-schemes"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors shadow-2xs"
              title="Search Schemes"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>Search schemes...</span>
              <kbd className="hidden 2xl:inline-block px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] text-slate-400">
                /
              </kbd>
            </Link>

            {isAuthenticated ? (
              <div className="relative" ref={userDropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 text-sm font-bold text-slate-800 p-1.5 pr-3 rounded-full hover:bg-slate-100 transition-colors border border-slate-200 bg-slate-50/70"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gov-700 to-gov-900 text-white font-bold flex items-center justify-center text-xs shadow-xs border border-gov-600">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="text-left hidden sm:block">
                    <span className="block max-w-[110px] truncate text-xs font-bold text-slate-900 leading-tight">
                      {user?.name}
                    </span>
                    <span className="block text-[10px] font-semibold text-gov-700 uppercase tracking-wider leading-none">
                      {user?.role}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-elevation border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/50">
                      <p className="text-xs font-bold text-slate-900 truncate">{user?.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                      <div className="mt-1">
                        <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-gov-100 text-gov-800">
                          {user?.role} Account
                        </span>
                      </div>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-gov-700"
                    >
                      <User className="w-4 h-4 text-gov-600" />
                      <span>{t('nav.profile')}</span>
                    </Link>
                    <Link
                      to="/applications"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-gov-700"
                    >
                      <FileText className="w-4 h-4 text-gov-600" />
                      <span>{t('nav.my_applications')}</span>
                    </Link>
                    <Link
                      to="/documents"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-gov-700"
                    >
                      <CheckCircle2 className="w-4 h-4 text-gov-600" />
                      <span>{t('nav.documents')}</span>
                    </Link>
                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-amber-800 hover:bg-amber-50"
                      >
                        <Shield className="w-4 h-4 text-amber-700" />
                        <span>Administration Node</span>
                      </Link>
                    )}
                    <div className="border-t border-slate-100 my-1" />
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t('nav.logout')}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="font-bold text-xs text-gov-800 hover:bg-slate-100">
                    {t('nav.login')}
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm" className="font-bold text-xs shadow-xs px-3.5 py-1.5">
                    {t('nav.register')}
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-gov-600 border border-slate-200"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* 4. Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-1.5 shadow-elevation animate-in fade-in">
          {/* Mobile Search */}
          <div className="mb-3">
            <Link
              to="/find-schemes"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-500"
            >
              <Search className="w-4 h-4 text-slate-400" />
              <span>Search schemes directory...</span>
            </Link>
          </div>

          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3.5 py-2.5 rounded-lg text-sm font-bold ${
                isActive(link.to)
                  ? 'text-gov-800 bg-gov-50 border border-gov-100 shadow-2xs'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{link.label}</span>
                {link.badge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
                    {link.badge}
                  </span>
                )}
              </div>
            </Link>
          ))}

          {user?.role === 'admin' && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3.5 py-2.5 rounded-lg text-sm font-bold text-amber-900 bg-amber-50 border border-amber-200"
            >
              {t('nav.admin')}
            </Link>
          )}

          {/* Quick Demo Logins in Mobile Drawer */}
          {!isAuthenticated && (
            <div className="pt-3 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Instant Demo Personas
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    handleQuickDemoLogin('citizen@labhsetu.gov.in', 'password123');
                    setMobileMenuOpen(false);
                  }}
                  className="p-2 text-left bg-slate-50 border border-slate-200 rounded-lg text-xs"
                >
                  <span className="font-bold block text-slate-800">Citizen</span>
                  <span className="text-[10px] text-slate-500">Rameshwar (Farmer)</span>
                </button>
                <button
                  onClick={() => {
                    handleQuickDemoLogin('admin@labhsetu.gov.in', 'password123');
                    setMobileMenuOpen(false);
                  }}
                  className="p-2 text-left bg-amber-50 border border-amber-200 rounded-lg text-xs"
                >
                  <span className="font-bold block text-amber-900">Admin</span>
                  <span className="text-[10px] text-amber-700">Priya (Director)</span>
                </button>
              </div>
            </div>
          )}

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {isAuthenticated ? (
              <div className="flex items-center justify-between pt-2">
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-sm font-bold text-slate-800"
                >
                  <User className="w-4 h-4 text-gov-600" />
                  <span>{user?.name}</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs text-rose-600 font-bold px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100"
                >
                  {t('nav.logout')}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full font-bold">
                    {t('nav.login')}
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" size="sm" className="w-full font-bold">
                    {t('nav.register')}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
