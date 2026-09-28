import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';

const RegisterPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register } = useAuth();
  const { success, error } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('citizen');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await register({
        name,
        email,
        password,
        phone,
        role,
      });
      success(`Welcome to LabhSetu, ${user.name}!`);
      navigate('/check-eligibility');
    } catch (err) {
      error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Create Citizen Account
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Register to discover schemes, evaluate eligibility, and track your benefits
        </p>
      </div>

      <Card className="p-6 sm:p-8 border-slate-200 dark:border-slate-800 shadow-elevation rounded-2xl space-y-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Rameshwar Kumar"
            required
          />

          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            required
          />

          <Input
            label="Mobile Number (Optional)"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 98765 43210"
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimum 6 characters"
            required
          />

          <Select
            label="Account Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            options={[
              { value: 'citizen', label: 'Citizen (Individual / Family)' },
              { value: 'operator', label: 'Assisted-Service Operator (CSC / VLE)' },
            ]}
          />

          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full mt-6 py-2.5 sm:py-3 px-5 text-sm sm:text-base font-bold rounded-xl shadow-xs hover:shadow transition-all"
            icon={UserPlus}
            isLoading={loading}
          >
            Create Citizen Account
          </Button>
        </form>

        <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-4 mt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-1.5">
          <span>Already registered?</span>
          <Link
            to="/login"
            className="font-bold text-gov-700 dark:text-sky-400 hover:text-gov-900 px-2.5 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Sign In here →
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default RegisterPage;
