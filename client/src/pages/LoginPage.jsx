import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LogIn, Eye, EyeOff, ShieldCheck, UserCheck, Briefcase } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const { success, error } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const performLogin = async (loginEmail, loginPass) => {
    setLoading(true);
    try {
      const user = await login(loginEmail, loginPass);
      success(`Welcome back, ${user.name}!`);
      if (user.role === 'admin' || user.role === 'superadmin') {
        navigate('/admin');
      } else {
        navigate('/find-schemes');
      }
    } catch (err) {
      error(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    performLogin(email, password);
  };

  const handleQuickDemoLogin = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    performLogin(demoEmail, demoPass);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-16 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Sign In to {t('app.name')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Access your saved preliminary matches, documents, and application tracker
        </p>
      </div>

      {/* 1-Click Instant Demo Accounts Card */}
      <div className="bg-sky-50/80 dark:bg-slate-800/80 p-4 rounded-2xl border border-sky-200/80 dark:border-slate-700 space-y-2.5 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-sky-900 dark:text-sky-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            1-Click Instant Demo Login:
          </span>
          <span className="text-[10px] text-sky-700 dark:text-sky-400 font-medium">Click to Sign In</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            type="button"
            disabled={loading}
            onClick={() => handleQuickDemoLogin('citizen@labhsetu.gov.in', 'password123')}
            className="flex items-center justify-center gap-1.5 px-2.5 py-2 text-xs font-bold text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-900 hover:bg-sky-100/60 dark:hover:bg-slate-800 border border-sky-200 dark:border-slate-700 rounded-xl transition-all active:scale-[0.98] shadow-2xs"
            title="Sign in as Citizen (Rameshwar Sharma)"
          >
            <UserCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Citizen</span>
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => handleQuickDemoLogin('admin@labhsetu.gov.in', 'password123')}
            className="flex items-center justify-center gap-1.5 px-2.5 py-2 text-xs font-bold text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-900 hover:bg-sky-100/60 dark:hover:bg-slate-800 border border-sky-200 dark:border-slate-700 rounded-xl transition-all active:scale-[0.98] shadow-2xs"
            title="Sign in as Director / Admin (Priya Sundaram)"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Admin</span>
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => handleQuickDemoLogin('operator@labhsetu.gov.in', 'password123')}
            className="flex items-center justify-center gap-1.5 px-2.5 py-2 text-xs font-bold text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-900 hover:bg-sky-100/60 dark:hover:bg-slate-800 border border-sky-200 dark:border-slate-700 rounded-xl transition-all active:scale-[0.98] shadow-2xs"
            title="Sign in as CSC Operator (Amit Verma)"
          >
            <Briefcase className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span>Operator</span>
          </button>
        </div>
      </div>

      <Card className="p-6 sm:p-8 border-slate-200 dark:border-slate-800 shadow-elevation rounded-2xl space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="citizen@labhsetu.gov.in"
            required
            autoComplete="email"
          />

          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none p-1"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full mt-6 py-3 px-5 text-sm sm:text-base font-bold rounded-xl shadow-xs hover:shadow transition-all"
            icon={LogIn}
            isLoading={loading}
          >
            {t('nav.login')}
          </Button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-4 mt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-1.5">
          <span>Don't have an account?</span>
          <Link
            to="/register"
            className="font-bold text-gov-700 dark:text-sky-400 hover:text-gov-900 px-2.5 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Register for free →
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
