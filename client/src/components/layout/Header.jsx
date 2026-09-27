import React, { useState } from 'react';
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
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';

const Header = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'hi' ? 'en' : 'hi';
    i18n.changeLanguage(nextLang);
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
      {/* Top Government Portal Bar */}
      <div className="bg-gov-900 text-slate-200 text-xs py-1.5 px-4 sm:px-8 border-b border-gov-800 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-india-orange"></span>
          <span className="font-medium tracking-wide">
            {t('app.gov_portal_banner')}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 text-xs text-slate-200 hover:text-white font-medium py-0.5 px-2 rounded bg-gov-800 hover:bg-gov-700 transition-colors"
            title="Switch Language / भाषा बदलें"
            aria-label="Toggle language"
          >
            <Languages className="w-3.5 h-3.5 text-india-orange" />
            <span>{i18n.language === 'hi' ? 'English' : 'हिंदी'}</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Identity */}
          <Link to="/" className="flex items-center gap-3 group focus:outline-none">
            <div className="w-10 h-10 rounded-lg bg-gov-600 flex items-center justify-center text-white font-bold text-xl shadow-xs group-hover:bg-gov-700 transition-colors">
              LS
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-gov-900">
                  {t('app.name')}
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-gov-100 text-gov-800">
                  BETA
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 leading-none">
                {t('app.tagline')}
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(link.to)
                    ? 'text-gov-700 bg-gov-50 font-semibold'
                    : 'text-slate-600 hover:text-gov-800 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  isActive('/admin')
                    ? 'text-amber-800 bg-amber-50 font-semibold'
                    : 'text-amber-700 hover:bg-amber-50'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>{t('nav.admin')}</span>
              </Link>
            )}
          </nav>

          {/* Desktop User Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-gov-700 p-1.5 rounded-md hover:bg-slate-50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gov-100 text-gov-800 font-semibold flex items-center justify-center text-xs border border-gov-200">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="max-w-[120px] truncate">{user?.name}</span>
                </Link>
                <button
                  onClick={logout}
                  className="text-slate-400 hover:text-rose-600 p-2 rounded-md transition-colors"
                  title={t('nav.logout')}
                  aria-label={t('nav.logout')}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    {t('nav.login')}
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
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
              className="p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-gov-600"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-1 shadow-elevation">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2.5 rounded-md text-base font-medium ${
                isActive(link.to)
                  ? 'text-gov-700 bg-gov-50 font-semibold'
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
              className="block px-3 py-2.5 rounded-md text-base font-medium text-amber-800 bg-amber-50"
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
                  className="flex items-center gap-2 text-sm font-medium text-slate-800"
                >
                  <User className="w-4 h-4 text-gov-600" />
                  <span>{user?.name}</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs text-rose-600 font-semibold px-2 py-1 rounded bg-rose-50"
                >
                  {t('nav.logout')}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full">
                    {t('nav.login')}
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" size="sm" className="w-full">
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
