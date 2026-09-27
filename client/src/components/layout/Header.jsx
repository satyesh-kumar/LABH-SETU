import React, { useState, useEffect } from 'react';
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
  Bot,
  HelpCircle,
  LogOut,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';

const Header = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [fontSize, setFontSize] = useState('normal'); // 'normal', 'large', 'larger'

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'hi' ? 'en' : 'hi';
    i18n.changeLanguage(nextLang);
  };

  const adjustFontSize = (size) => {
    setFontSize(size);
    const root = document.documentElement;
    if (size === 'small') {
      root.style.fontSize = '14px';
    } else if (size === 'normal') {
      root.style.fontSize = '16px';
    } else if (size === 'large') {
      root.style.fontSize = '18px';
    }
  };

  const navLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/find-schemes', label: t('nav.find_schemes') },
    { to: '/check-eligibility', label: t('nav.check_eligibility') },
    { to: '/applications', label: t('nav.my_applications') },
    { to: '/documents', label: t('nav.documents') },
    { to: '/assistant', label: t('nav.ai_assistant') },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Authentic National Portal Header Strip with Indian Tricolor line */}
      <div className="h-1 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />
      
      <div className="bg-gov-950 text-slate-200 text-xs py-1.5 px-4 sm:px-8 border-b border-gov-900 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-amber-500/20 text-[#FF9933] text-[10px] font-bold">
            🇮🇳
          </span>
          <span className="font-medium tracking-wide text-slate-300">
            {t('app.gov_portal_banner')}
          </span>
          <span className="hidden md:inline-block text-slate-500">|</span>
          <span className="hidden md:inline-block text-slate-400 text-[11px]">
            National Public Benefit Information Framework
          </span>
        </div>

        {/* Accessibility & Language Controls */}
        <div className="flex items-center gap-3">
          {/* Font Resizing Accessibility */}
          <div className="hidden sm:flex items-center gap-1 bg-gov-900 px-1.5 py-0.5 rounded border border-gov-800 text-[11px] text-slate-300">
            <span className="text-[10px] text-slate-400 mr-1">Text:</span>
            <button
              onClick={() => adjustFontSize('small')}
              className={`px-1.5 rounded hover:text-white ${fontSize === 'small' ? 'bg-gov-700 font-bold text-white' : ''}`}
              title="Standard Text"
            >
              A-
            </button>
            <button
              onClick={() => adjustFontSize('normal')}
              className={`px-1.5 rounded hover:text-white ${fontSize === 'normal' ? 'bg-gov-700 font-bold text-white' : ''}`}
              title="Medium Text"
            >
              A
            </button>
            <button
              onClick={() => adjustFontSize('large')}
              className={`px-1.5 rounded hover:text-white ${fontSize === 'large' ? 'bg-gov-700 font-bold text-white' : ''}`}
              title="Larger Text"
            >
              A+
            </button>
          </div>

          {/* Language Selector Pill */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 text-xs text-white font-semibold py-1 px-2.5 rounded-full bg-gov-800 hover:bg-gov-700 border border-gov-700 hover:border-gov-600 transition-all shadow-xs"
            title="Switch Language / भाषा बदलें"
            aria-label="Toggle language"
          >
            <Languages className="w-3.5 h-3.5 text-[#FF9933]" />
            <span>{i18n.language === 'hi' ? 'English' : 'हिंदी'}</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Identity */}
          <Link to="/" className="flex items-center gap-3.5 group focus:outline-none">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-gov-600 to-gov-800 flex items-center justify-center text-white font-extrabold text-xl shadow-gov border border-gov-500/30 group-hover:scale-105 transition-transform">
              LS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-gov-900 group-hover:text-gov-700 transition-colors">
                  {t('app.name')}
                </span>
                <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  OFFICIAL GUIDANCE
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-500 tracking-wide">
                {t('app.tagline')} • <span className="text-gov-700">{t('app.subtitle')}</span>
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(link.to)
                    ? 'text-gov-800 bg-gov-50 font-bold shadow-xs border border-gov-100'
                    : 'text-slate-600 hover:text-gov-800 hover:bg-slate-100/70'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  isActive('/admin')
                    ? 'text-amber-900 bg-amber-100 font-bold border border-amber-300'
                    : 'text-amber-800 bg-amber-50/70 hover:bg-amber-100 border border-amber-200'
                }`}
              >
                <Shield className="w-4 h-4 text-amber-700" />
                <span>{t('nav.admin')}</span>
              </Link>
            )}
          </nav>

          {/* Desktop User Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 text-sm font-semibold text-slate-800 p-1.5 pr-3 rounded-full hover:bg-slate-100 transition-colors border border-slate-200 bg-slate-50/60"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gov-600 to-gov-800 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="max-w-[120px] truncate text-xs">{user?.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-elevation border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">{user?.name}</p>
                      <p className="text-[11px] text-slate-500 capitalize">{user?.role} Account</p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-gov-700"
                    >
                      <User className="w-3.5 h-3.5 text-gov-600" />
                      <span>{t('nav.profile')}</span>
                    </Link>
                    <Link
                      to="/applications"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-gov-700"
                    >
                      <FileText className="w-3.5 h-3.5 text-gov-600" />
                      <span>{t('nav.my_applications')}</span>
                    </Link>
                    <Link
                      to="/documents"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-gov-700"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-gov-600" />
                      <span>{t('nav.documents')}</span>
                    </Link>
                    <div className="border-t border-slate-100 my-1" />
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{t('nav.logout')}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="font-semibold text-gov-700">
                    {t('nav.login')}
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm" className="shadow-xs font-semibold">
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
              className="p-2.5 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-gov-600 border border-slate-200"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-1.5 shadow-elevation animate-in fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2.5 rounded-lg text-base font-semibold ${
                isActive(link.to)
                  ? 'text-gov-800 bg-gov-50 font-bold border border-gov-100'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {link.label}
            </Link>
          ))}
          {user?.role === 'admin' && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-base font-bold text-amber-800 bg-amber-50 border border-amber-200"
            >
              {t('nav.admin')}
            </Link>
          )}

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
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
                  className="text-xs text-rose-600 font-bold px-3 py-1.5 rounded-md bg-rose-50 hover:bg-rose-100"
                >
                  {t('nav.logout')}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full font-semibold">
                    {t('nav.login')}
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" size="sm" className="w-full font-semibold">
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
