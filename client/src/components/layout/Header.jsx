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
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Button from '../ui/Button';

// Authentic Ashoka Chakra Vector Icon
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

  // Applications & Documents removed from public navbar as requested
  const navLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/find-schemes', label: t('nav.find_schemes') },
    { to: '/check-eligibility', label: t('nav.check_eligibility'), highlight: true },
    { to: '/assistant', label: t('nav.ai_assistant'), badge: 'AI' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-[#0c1322] shadow-xs border-b border-slate-200/80 dark:border-[#1a253a] transition-colors duration-200">
      {/* 1. National Tricolor Strip */}
      <div className="h-[2.5px] w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

      {/* 2. Top Government Administration Utility Strip */}
      <div className="bg-[#0b2545] text-slate-200 text-xs py-1 px-4 sm:px-6 lg:px-8 border-b border-[#133966]">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-2">
          {/* Left: National Identity */}
          <div className="flex items-center gap-2">
            <AshokaChakraIcon className="w-3.5 h-3.5 text-sky-200" />
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-white tracking-wide text-[11px] sm:text-xs">
                {isHi ? 'भारत सरकार' : 'GOVERNMENT OF INDIA'}
              </span>
              <span className="text-slate-500 text-[10px] hidden sm:inline">|</span>
              <span className="hidden sm:inline-block text-[11px] text-slate-300 font-medium">
                {isHi ? 'केंद्रीय सार्वजनिक सेवा मंच' : 'Ministry of Electronics & IT'}
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
            <div className="hidden sm:flex items-center gap-0.5 bg-[#133966]/60 px-1.5 py-0.5 rounded border border-[#1e4c85] text-[10px] text-slate-300">
              <span className="text-slate-400 mr-0.5">Text:</span>
              <button
                type="button"
                onClick={() => adjustFontSize('small')}
                className={`px-1 py-0.2 rounded hover:text-white transition-colors ${
                  fontSize === 'small' ? 'bg-gov-600 font-bold text-white' : ''
                }`}
                title="Small Text"
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => adjustFontSize('normal')}
                className={`px-1 py-0.2 rounded hover:text-white transition-colors ${
                  fontSize === 'normal' ? 'bg-gov-600 font-bold text-white' : ''
                }`}
                title="Standard Text"
              >
                A
              </button>
              <button
                type="button"
                onClick={() => adjustFontSize('large')}
                className={`px-1 py-0.2 rounded hover:text-white transition-colors ${
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
              className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-[#133966]/80 hover:bg-[#1a4a84] border border-[#1e4c85] text-slate-200 transition-colors"
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
              className="flex items-center gap-1 text-[11px] text-white font-bold py-0.5 px-2 rounded-full bg-[#1b5e9c] hover:bg-[#184f85] border border-sky-400/30 transition-all shadow-xs"
              title="Toggle English / हिंदी"
              aria-label="Change language"
            >
              <Languages className="w-3 h-3 text-amber-300" />
              <span>{isHi ? 'English' : 'हिंदी'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Main Navigation Bar (Clean, Spacious, Professional) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-15">
          {/* Professional, Refined Logo */}
          <Link to="/" className="flex items-center gap-3 group focus:outline-none flex-shrink-0">
            <div className="w-8.5 h-8.5 rounded-lg bg-gradient-to-b from-[#0b2545] to-[#184f85] border border-amber-400/40 shadow-xs flex items-center justify-center text-amber-300 group-hover:border-amber-400 group-hover:scale-102 transition-all flex-shrink-0">
              <AshokaChakraIcon className="w-5 h-5 text-amber-300" />
            </div>

            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white group-hover:text-gov-700 dark:group-hover:text-sky-300 transition-colors leading-none font-sans">
                {isHi ? 'लाभसेतु' : 'LABHSETU'}
              </span>
              <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 leading-none mt-1">
                {isHi ? 'राष्ट्रीय कल्याणकारी योजना सेतु' : 'National Scheme Gateway'}
              </span>
            </div>
          </Link>

          {/* Center Navigation Links (Streamlined: Home, Find Schemes, Check Eligibility, AI Assistant) */}
          <nav className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => {
              const active = isActive(link.to);
              if (link.highlight) {
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs ${
                      active
                        ? 'bg-gov-700 text-white shadow-xs'
                        : 'bg-gov-50 hover:bg-gov-100 text-gov-800 dark:bg-sky-950/60 dark:text-sky-200 dark:hover:bg-sky-900/60 border border-gov-200/70 dark:border-sky-800/60'
                    }`}
                  >
                    <span>{link.label}</span>
                  </Link>
                );
              }

              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    active
                      ? 'text-gov-900 dark:text-sky-300 bg-gov-50/80 dark:bg-slate-800/90 font-bold border border-gov-100 dark:border-slate-700'
                      : 'text-slate-600 dark:text-slate-300 hover:text-gov-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-2xs">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ml-1 ${
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

          {/* Right Action Section: Profile or Login */}
          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              <div className="relative" ref={userDropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-100 py-1 px-3 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/70"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gov-700 to-gov-900 text-white font-bold flex items-center justify-center text-[10px] shadow-xs">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="max-w-[110px] truncate text-slate-900 dark:text-white">
                    {user?.name}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
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
              <div className="flex items-center gap-1.5">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="font-bold text-xs text-gov-800 dark:text-sky-300 hover:bg-slate-100 dark:hover:bg-slate-800 px-3 py-1">
                    {t('nav.login')}
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm" className="font-bold text-xs shadow-xs px-3.5 py-1">
                    {t('nav.register')}
                  </Button>
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
              className={`block px-3 py-2 rounded-lg text-xs font-bold ${
                isActive(link.to)
                  ? 'text-gov-800 dark:text-sky-300 bg-gov-50 dark:bg-[#111a2e] border border-gov-100 dark:border-[#1e2c45]'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{link.label}</span>
                {link.badge && (
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200">
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
              className="block px-3 py-2 rounded-lg text-xs font-bold text-amber-900 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800"
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
                  className="text-xs text-rose-600 font-bold px-2.5 py-1 rounded bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100"
                >
                  {t('nav.logout')}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full font-bold text-xs py-1">
                    {t('nav.login')}
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" size="sm" className="w-full font-bold text-xs py-1">
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
