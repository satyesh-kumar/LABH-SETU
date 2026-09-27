import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Menu,
  X,
  Languages,
  User,
  Shield,
  FileText,
  CheckCircle2,
  LogOut,
  ChevronDown,
  Sun,
  Moon,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Button from '../ui/Button';

// Authentic Ashoka Chakra Vector Icon for the top national identity strip
const AshokaChakraIcon = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
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
);

// Modern Geometric LabhSetu Brand Logo
const ModernLabhSetuLogo = ({ className = 'w-9 h-9' }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="modernLsGrad" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#0b2545" />
        <stop offset="50%" stopColor="#184f85" />
        <stop offset="100%" stopColor="#0284c7" />
      </linearGradient>
      <linearGradient id="modernAmberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fbbf24" />
        <stop offset="100%" stopColor="#f59e0b" />
      </linearGradient>
    </defs>
    <rect width="48" height="48" rx="12" fill="url(#modernLsGrad)" />
    <rect x="1" y="1" width="46" height="46" rx="11" stroke="#38bdf8" strokeOpacity="0.4" strokeWidth="1.5" />
    <path d="M12 32 C 14 19, 34 19, 36 32" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" fill="none" />
    <path d="M17 32 C 19 24, 29 24, 31 32" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" opacity="0.85" fill="none" />
    <circle cx="24" cy="17" r="4.5" fill="url(#modernAmberGrad)" />
    <circle cx="24" cy="17" r="1.8" fill="#ffffff" />
    <circle cx="12" cy="32" r="2.2" fill="#38bdf8" />
    <circle cx="36" cy="32" r="2.2" fill="#38bdf8" />
  </svg>
);

const Header = () => {
  const { t, i18n } = useTranslation();
  const isHi = i18n.language === 'hi';
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, cycleTheme } = useTheme();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [fontSize, setFontSize] = useState('normal');

  const userDropdownRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
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

  // Modern Clean Nav Links (AI Assistant lives in the dedicated floating chatbot)
  const navLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/find-schemes', label: t('nav.find_schemes') },
    { to: '/check-eligibility', label: t('nav.check_eligibility') },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0c1322]/95 backdrop-blur-md shadow-2xs border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-200">
      {/* 1. National Sovereign Ribbon */}
      <div className="h-[2.5px] w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

      {/* 2. Top Government Administration Utility Strip */}
      <div className="bg-[#081a32] text-slate-300 text-xs py-1 px-4 sm:px-6 lg:px-8 border-b border-[#0f2746]">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-2">
          {/* Left: National Identity */}
          <div className="flex items-center gap-2">
            <AshokaChakraIcon className="w-3.5 h-3.5 text-sky-300" />
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-white tracking-wide text-[11px] sm:text-xs">
                {isHi ? 'भारत सरकार' : 'GOVERNMENT OF INDIA'}
              </span>
              <span className="text-slate-600 text-[10px] hidden sm:inline">|</span>
              <span className="hidden sm:inline-block text-[11px] text-slate-300 font-medium">
                {isHi ? 'सार्वजनिक सेवा पोर्टल' : 'Ministry of Electronics & IT'}
              </span>
            </div>
          </div>

          {/* Right: Accessibility Controls, Single Theme Toggle, Language */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Skip to Main Content */}
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only text-[11px] text-white bg-gov-600 px-2 py-0.5 rounded"
            >
              Skip
            </a>

            {/* Font Size Accessibility Adjuster */}
            <div className="hidden sm:flex items-center gap-0.5 bg-[#0e2c52]/80 px-1.5 py-0.5 rounded-full border border-[#1b4375] text-[10px] text-slate-300">
              <span className="text-slate-400 mr-0.5 text-[9px]">Text:</span>
              <button
                type="button"
                onClick={() => adjustFontSize('small')}
                className={`px-1.5 py-0.2 rounded-full hover:text-white transition-colors ${
                  fontSize === 'small' ? 'bg-gov-600 font-bold text-white' : ''
                }`}
                title="Small Text"
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => adjustFontSize('normal')}
                className={`px-1.5 py-0.2 rounded-full hover:text-white transition-colors ${
                  fontSize === 'normal' ? 'bg-gov-600 font-bold text-white' : ''
                }`}
                title="Standard Text"
              >
                A
              </button>
              <button
                type="button"
                onClick={() => adjustFontSize('large')}
                className={`px-1.5 py-0.2 rounded-full hover:text-white transition-colors ${
                  fontSize === 'large' ? 'bg-gov-600 font-bold text-white' : ''
                }`}
                title="Large Text"
              >
                A+
              </button>
            </div>

            {/* Streamlined Single Theme Toggle Button */}
            <button
              type="button"
              onClick={cycleTheme}
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#0e2c52]/80 hover:bg-[#153f75] border border-[#1b4375] text-slate-200 transition-colors shadow-2xs"
              title={`Active Theme: ${theme === 'warm' ? 'Warm Light' : theme === 'dark' ? 'Dark' : 'Light'}. Tap to toggle.`}
            >
              {theme === 'warm' ? (
                <>
                  <Sun className="w-3 h-3 text-amber-300" />
                  <span>Warm</span>
                </>
              ) : theme === 'dark' ? (
                <>
                  <Moon className="w-3 h-3 text-sky-200" />
                  <span>Dark</span>
                </>
              ) : (
                <>
                  <Sun className="w-3 h-3 text-white" />
                  <span>Light</span>
                </>
              )}
            </button>

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 text-[11px] text-white font-bold py-0.5 px-2.5 rounded-full bg-[#1b5e9c] hover:bg-[#184f85] border border-sky-400/30 transition-all shadow-xs"
              title="Toggle English / हिंदी"
              aria-label="Change language"
            >
              <Languages className="w-3 h-3 text-amber-300" />
              <span>{isHi ? 'English' : 'हिंदी'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Main Navigation Bar (Modern Website Design with High-End Aesthetics) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-17">
          {/* Left: Modern Website Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group focus:outline-none flex-shrink-0">
            <ModernLabhSetuLogo className="w-9 h-9 sm:w-10 sm:h-10 group-hover:scale-105 transition-transform flex-shrink-0 drop-shadow-xs" />

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white font-sans leading-none">
                  {isHi ? 'लाभसेतु' : 'Labh'}
                  {!isHi && <span className="text-gov-600 dark:text-sky-400">Setu</span>}
                </span>
                <span className="text-[9px] font-black tracking-wider px-1.5 py-0.2 rounded-full bg-sky-100 dark:bg-sky-950/80 text-sky-800 dark:text-sky-300 uppercase leading-none border border-sky-200 dark:border-sky-800">
                  GOV
                </span>
              </div>
              <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 tracking-wide uppercase leading-none mt-1">
                {isHi ? 'राष्ट्रीय कल्याणकारी योजना सेतु' : 'National Scheme Gateway'}
              </span>
            </div>
          </Link>

          {/* Right: Clean, Unified Navigation Links & Actions */}
          <div className="hidden md:flex items-center gap-5">
            {/* Modern Navigation Links with Pill Hover & Active States */}
            <nav className="flex items-center gap-1">
              {navLinks.map((link) => {
                const active = isActive(link.to);
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                      active
                        ? 'text-gov-900 dark:text-sky-300 bg-gov-100/80 dark:bg-slate-800 font-bold border border-gov-200 dark:border-slate-700 shadow-2xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/70'
                    }`}
                  >
                    <span>{link.label}</span>
                  </Link>
                );
              })}

              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className={`px-3.5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ml-1 ${
                    isActive('/admin')
                      ? 'text-amber-950 dark:text-amber-200 bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700'
                      : 'text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/30 hover:bg-amber-100/80 border border-amber-200 dark:border-amber-800'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                  <span>{t('nav.admin')}</span>
                </Link>
              )}
            </nav>

            {/* Subtle Vertical Divider */}
            <div className="h-5 w-px bg-slate-200 dark:bg-slate-700" />

            {/* User Profile or Modern Sign In / Register Buttons */}
            {isAuthenticated ? (
              <div className="relative" ref={userDropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 text-xs font-bold text-slate-800 dark:text-slate-100 py-1.5 px-3 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/70"
                >
                  <div className="w-6.5 h-6.5 rounded-full bg-gradient-to-br from-gov-700 to-gov-900 text-white font-bold flex items-center justify-center text-[10px] shadow-xs">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="max-w-[120px] truncate text-slate-900 dark:text-white">
                    {user?.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-[#111a2e] rounded-xl shadow-elevation border border-slate-200 dark:border-[#1e2c45] py-1.5 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-3.5 py-2 border-b border-slate-100 dark:border-[#1e2c45] bg-slate-50/50 dark:bg-[#0c1322]/50">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user?.name}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-gov-700"
                    >
                      <User className="w-3.5 h-3.5 text-gov-600 dark:text-sky-400" />
                      <span>{t('nav.profile')}</span>
                    </Link>
                    <Link
                      to="/applications"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-gov-700"
                    >
                      <FileText className="w-3.5 h-3.5 text-gov-600 dark:text-sky-400" />
                      <span>{t('nav.my_applications')}</span>
                    </Link>
                    <Link
                      to="/documents"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-gov-700"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-gov-600 dark:text-sky-400" />
                      <span>{t('nav.documents')}</span>
                    </Link>
                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold text-amber-800 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-slate-700"
                      >
                        <Shield className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                        <span>Administration Node</span>
                      </Link>
                    )}
                    <div className="border-t border-slate-100 dark:border-[#1e2c45] my-1" />
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{t('nav.logout')}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-gov-800 dark:hover:text-white px-3.5 py-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  className="text-xs sm:text-sm font-bold text-white bg-gov-600 hover:bg-gov-700 active:bg-gov-800 px-4.5 py-2 rounded-full shadow-xs hover:shadow transition-all"
                >
                  {t('nav.register')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Actions: Theme Quick Toggle & Menu Hamburger */}
          <div className="flex md:hidden items-center gap-1.5">
            <button
              onClick={cycleTheme}
              className="p-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
              title={`Current Theme: ${theme}. Tap to switch`}
              aria-label="Switch Theme"
            >
              {theme === 'warm' ? (
                <Sun className="w-4 h-4 text-amber-500" />
              ) : theme === 'dark' ? (
                <Moon className="w-4 h-4 text-sky-400" />
              ) : (
                <Sun className="w-4 h-4 text-slate-700" />
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-gov-600 border border-slate-200 dark:border-slate-700"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* 4. Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1322] px-4 pt-3 pb-5 space-y-1.5 shadow-elevation animate-in fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2.5 rounded-xl text-xs font-bold ${
                isActive(link.to)
                  ? 'text-gov-800 dark:text-sky-300 bg-gov-50 dark:bg-[#111a2e] border border-gov-100 dark:border-[#1e2c45]'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <span>{link.label}</span>
            </Link>
          ))}

          {user?.role === 'admin' && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-xs font-bold text-amber-900 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800"
            >
              {t('nav.admin')}
            </Link>
          )}

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
            {isAuthenticated ? (
              <div className="flex items-center justify-between pt-1">
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200"
                >
                  <User className="w-3.5 h-3.5 text-gov-600 dark:text-sky-400" />
                  <span>{user?.name}</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs text-rose-600 font-bold px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100"
                >
                  {t('nav.logout')}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full font-bold text-xs py-1.5 rounded-xl">
                    {t('nav.login')}
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" size="sm" className="w-full font-bold text-xs py-1.5 rounded-xl">
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
