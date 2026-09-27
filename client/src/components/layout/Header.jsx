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
  Search,
  CheckCircle2,
  LogOut,
  ChevronDown,
  Sun,
  Moon,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Button from '../ui/Button';

// Authentic Ashoka Chakra Vector Icon
const AshokaChakraIcon = ({ className = 'w-5 h-5' }) => (
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
  const { theme, setTheme, cycleTheme } = useTheme();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [fontSize, setFontSize] = useState('normal'); // 'small', 'normal', 'large'

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
    <header className="sticky top-0 z-50 bg-white dark:bg-[#0c1322] shadow-xs border-b border-slate-200 dark:border-[#1a253a] transition-colors duration-200">
      {/* 1. National Tricolor Strip */}
      <div className="h-[3px] w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

      {/* 2. Top Government Administration Utility Strip */}
      <div className="bg-[#0b2545] text-slate-200 text-xs py-1 px-4 sm:px-8 border-b border-[#133966]">
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
                {isHi ? 'केंद्रीय सार्वजनिक सेवा व योजना पोर्टल' : 'Ministry of Electronics & Information Technology'}
              </span>
            </div>
          </div>

          {/* Right: Theme Switcher, Accessibility Controls, Language Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
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
                type="button"
                onClick={() => adjustFontSize('small')}
                className={`px-1.5 py-0.5 rounded hover:text-white transition-colors ${
                  fontSize === 'small' ? 'bg-gov-600 font-bold text-white' : ''
                }`}
                title="Small Text"
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => adjustFontSize('normal')}
                className={`px-1.5 py-0.5 rounded hover:text-white transition-colors ${
                  fontSize === 'normal' ? 'bg-gov-600 font-bold text-white' : ''
                }`}
                title="Standard Text"
              >
                A
              </button>
              <button
                type="button"
                onClick={() => adjustFontSize('large')}
                className={`px-1.5 py-0.5 rounded hover:text-white transition-colors ${
                  fontSize === 'large' ? 'bg-gov-600 font-bold text-white' : ''
                }`}
                title="Enlarged Text"
              >
                A+
              </button>
            </div>

            {/* Top Bar Theme Switcher: Warm Light, Crisp Light, Dark */}
            <div className="flex items-center bg-[#133966]/80 p-0.5 rounded-md border border-[#1e4c85] text-[11px]">
              <button
                type="button"
                onClick={() => setTheme('warm')}
                className={`px-2 py-0.5 rounded flex items-center gap-1 transition-all ${
                  theme === 'warm'
                    ? 'bg-amber-400 text-stone-900 font-bold shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Warm Light Mode (Eye Comfort)"
              >
                <Sun className={`w-3 h-3 ${theme === 'warm' ? 'text-stone-900' : 'text-amber-300'}`} />
                <span>Warm</span>
              </button>
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`px-2 py-0.5 rounded flex items-center gap-1 transition-all ${
                  theme === 'light'
                    ? 'bg-sky-400 text-slate-950 font-bold shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Standard Light Mode"
              >
                <span>Light</span>
              </button>
              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`px-2 py-0.5 rounded flex items-center gap-1 transition-all ${
                  theme === 'dark'
                    ? 'bg-slate-700 text-white font-bold shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Dark Mode"
              >
                <Moon className={`w-3 h-3 ${theme === 'dark' ? 'text-white' : 'text-sky-200'}`} />
                <span>Dark</span>
              </button>
            </div>

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 text-xs text-white font-bold py-1 px-2.5 rounded-full bg-[#1b5e9c] hover:bg-[#184f85] border border-sky-400/30 transition-all shadow-xs"
              title="Toggle English / हिंदी"
              aria-label="Change language"
            >
              <Languages className="w-3.5 h-3.5 text-amber-300" />
              <span>{isHi ? 'English' : 'हिंदी'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Professional, Dignified Logo Branding */}
          <Link to="/" className="flex items-center gap-3 group focus:outline-none flex-shrink-0">
            {/* National Emblem Crest Motif */}
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-b from-[#0b2545] to-[#184f85] border border-amber-400/50 shadow-xs flex items-center justify-center text-amber-300 group-hover:border-amber-400 group-hover:scale-102 transition-all flex-shrink-0">
              <AshokaChakraIcon className="w-5 h-5 sm:w-6 sm:h-6 text-amber-300 drop-shadow-xs" />
            </div>

            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white group-hover:text-gov-700 dark:group-hover:text-sky-300 transition-colors leading-none font-sans">
                {isHi ? 'लाभसेतु' : 'LABHSETU'}
              </span>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-tight mt-1">
                {isHi ? 'कल्याणकारी योजना सेतु' : 'National Scheme Gateway'}
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
                      ? 'text-gov-900 dark:text-sky-300 bg-gov-50 dark:bg-slate-800/80 font-bold shadow-2xs border border-gov-100 dark:border-slate-700'
                      : link.highlight
                      ? 'text-gov-800 dark:text-sky-400 hover:bg-gov-50/60 dark:hover:bg-slate-800/50 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-gov-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-full bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200">
                      {link.badge}
                    </span>
                  )}
                  {active && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-gov-600 dark:bg-sky-400 rounded-full" />
                  )}
                </Link>
              );
            })}

            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className={`px-3 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-1.5 ${
                  isActive('/admin')
                    ? 'text-amber-950 dark:text-amber-200 bg-amber-100 dark:bg-amber-950/60 font-extrabold border border-amber-300 dark:border-amber-700'
                    : 'text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/30 hover:bg-amber-100/80 border border-amber-200 dark:border-amber-800'
                }`}
              >
                <Shield className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                <span>{t('nav.admin')}</span>
              </Link>
            )}
          </nav>

          {/* Right Action Section */}
          <div className="hidden lg:flex items-center gap-2.5">
            {/* Quick Search Shortcut Button */}
            <Link
              to="/find-schemes"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#1e2c45] bg-slate-50 dark:bg-[#111a2e] hover:bg-slate-100 dark:hover:bg-[#162238] text-xs font-medium text-slate-500 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white transition-colors shadow-2xs"
              title="Search Schemes"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>Search schemes...</span>
              <kbd className="hidden 2xl:inline-block px-1.5 py-0.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-[10px] text-slate-400">
                /
              </kbd>
            </Link>

            {/* Prominent Main Navbar Theme Pill */}
            <div className="flex items-center p-0.5 rounded-lg border border-slate-200 dark:border-[#1e2c45] bg-slate-100/90 dark:bg-[#111a2e] text-xs">
              <button
                type="button"
                onClick={() => setTheme('warm')}
                className={`px-2 py-1 rounded-md text-xs font-semibold flex items-center gap-1 transition-all ${
                  theme === 'warm'
                    ? 'bg-amber-400 text-stone-900 font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Warm Light Mode (Eye Comfort)"
              >
                <Sun className={`w-3.5 h-3.5 ${theme === 'warm' ? 'text-stone-900' : 'text-amber-500'}`} />
                <span className="hidden xl:inline text-[11px]">Warm</span>
              </button>
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`px-2 py-1 rounded-md text-xs font-semibold flex items-center gap-1 transition-all ${
                  theme === 'light'
                    ? 'bg-white text-slate-900 font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Crisp Light Mode"
              >
                <span className="text-[11px]">Light</span>
              </button>
              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`px-2 py-1 rounded-md text-xs font-semibold flex items-center gap-1 transition-all ${
                  theme === 'dark'
                    ? 'bg-slate-950 text-white font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Dark Mode"
              >
                <Moon className={`w-3.5 h-3.5 ${theme === 'dark' ? 'text-sky-300' : 'text-slate-500'}`} />
                <span className="hidden xl:inline text-[11px]">Dark</span>
              </button>
            </div>

            {isAuthenticated ? (
              <div className="relative" ref={userDropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 text-sm font-bold text-slate-800 dark:text-slate-100 p-1.5 pr-3 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/70"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gov-700 to-gov-900 text-white font-bold flex items-center justify-center text-xs shadow-xs border border-gov-600">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="text-left hidden sm:block">
                    <span className="block max-w-[110px] truncate text-xs font-bold text-slate-900 dark:text-white leading-tight">
                      {user?.name}
                    </span>
                    <span className="block text-[10px] font-semibold text-gov-700 dark:text-sky-300 uppercase tracking-wider leading-none">
                      {user?.role}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#111a2e] rounded-xl shadow-elevation border border-slate-200 dark:border-[#1e2c45] py-1.5 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2.5 border-b border-slate-100 dark:border-[#1e2c45] bg-slate-50/50 dark:bg-[#0c1322]/50">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user?.name}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                      <div className="mt-1">
                        <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-gov-100 text-gov-800 dark:bg-gov-900 dark:text-sky-200">
                          {user?.role} Account
                        </span>
                      </div>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-gov-700"
                    >
                      <User className="w-4 h-4 text-gov-600 dark:text-sky-400" />
                      <span>{t('nav.profile')}</span>
                    </Link>
                    <Link
                      to="/applications"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-gov-700"
                    >
                      <FileText className="w-4 h-4 text-gov-600 dark:text-sky-400" />
                      <span>{t('nav.my_applications')}</span>
                    </Link>
                    <Link
                      to="/documents"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-gov-700"
                    >
                      <CheckCircle2 className="w-4 h-4 text-gov-600 dark:text-sky-400" />
                      <span>{t('nav.documents')}</span>
                    </Link>
                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-amber-800 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-slate-700"
                      >
                        <Shield className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                        <span>Administration Node</span>
                      </Link>
                    )}
                    <div className="border-t border-slate-100 dark:border-[#1e2c45] my-1" />
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
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
                  <Button variant="ghost" size="sm" className="font-bold text-xs text-gov-800 dark:text-sky-300 hover:bg-slate-100 dark:hover:bg-slate-800">
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

          {/* Mobile Actions: Theme Quick Toggle & Menu Hamburger */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={cycleTheme}
              className="p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
              title={`Current Theme: ${theme}. Tap to switch`}
              aria-label="Switch Theme"
            >
              {theme === 'warm' ? (
                <Sun className="w-5 h-5 text-amber-500" />
              ) : theme === 'dark' ? (
                <Moon className="w-5 h-5 text-sky-400" />
              ) : (
                <Sun className="w-5 h-5 text-slate-700" />
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-gov-600 border border-slate-200 dark:border-slate-700"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* 4. Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1322] px-4 pt-3 pb-6 space-y-2 shadow-elevation animate-in fade-in">
          {/* Mobile Theme Selector */}
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-[#111a2e] border border-slate-200 dark:border-[#1e2c45]">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Display Theme:</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setTheme('warm')}
                className={`px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 ${
                  theme === 'warm' ? 'bg-amber-400 text-stone-900 font-bold' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                Warm
              </button>
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`px-2 py-1 rounded text-xs font-semibold ${
                  theme === 'light' ? 'bg-sky-500 text-white font-bold' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Light
              </button>
              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 ${
                  theme === 'dark' ? 'bg-slate-700 text-white font-bold' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                Dark
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div>
            <Link
              to="/find-schemes"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#111a2e] border border-slate-300 dark:border-[#1e2c45] rounded-lg text-xs font-medium text-slate-500 dark:text-slate-300"
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
                  ? 'text-gov-800 dark:text-sky-300 bg-gov-50 dark:bg-[#111a2e] border border-gov-100 dark:border-[#1e2c45] shadow-2xs'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{link.label}</span>
                {link.badge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200">
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
              className="block px-3.5 py-2.5 rounded-lg text-sm font-bold text-amber-900 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800"
            >
              {t('nav.admin')}
            </Link>
          )}

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
            {isAuthenticated ? (
              <div className="flex items-center justify-between pt-2">
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200"
                >
                  <User className="w-4 h-4 text-gov-600 dark:text-sky-400" />
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
