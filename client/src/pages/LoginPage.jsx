import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LogIn } from 'lucide-react';
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

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-gov-700 dark:text-sky-400 hover:text-gov-900 underline">
            Register for free
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
