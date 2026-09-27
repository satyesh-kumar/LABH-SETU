import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LogIn, UserCheck, Shield, Sparkles } from 'lucide-react';
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
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setLoading(true);
    try {
      const user = await login(email, password);
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

  const fillDemo = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold text-slate-900">
          Sign In to {t('app.name')}
        </h1>
        <p className="text-xs text-slate-500">
          Access your saved preliminary matches, documents, and application tracker
        </p>
      </div>

      <Card className="p-6 sm:p-8 border-slate-200 bg-white shadow-subtle space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="citizen@labhsetu.gov.in"
            required
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full"
            icon={LogIn}
            isLoading={loading}
          >
            {t('nav.login')}
          </Button>
        </form>

        <div className="text-center text-xs text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-gov-700 hover:text-gov-900 underline">
            Register for free
          </Link>
        </div>

        {/* Quick Demo Credentials (Section 58) */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Instant Demo Accounts</span>
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                fillDemo('citizen@labhsetu.gov.in', 'password123');
              }}
              className="p-2 text-left rounded-md border border-slate-200 hover:border-gov-400 bg-slate-50 text-xs transition-colors"
            >
              <span className="font-bold text-slate-800 block">Citizen User</span>
              <span className="text-[10px] text-slate-500 block">Rameshwar Sharma</span>
            </button>
            <button
              type="button"
              onClick={() => {
                fillDemo('admin@labhsetu.gov.in', 'password123');
              }}
              className="p-2 text-left rounded-md border border-slate-200 hover:border-gov-400 bg-slate-50 text-xs transition-colors"
            >
              <span className="font-bold text-slate-800 block">Administrator</span>
              <span className="text-[10px] text-slate-500 block">Priya Sundaram</span>
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
