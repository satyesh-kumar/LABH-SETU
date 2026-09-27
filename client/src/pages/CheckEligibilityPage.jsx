import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, ArrowRight, ArrowLeft, User, MapPin, IndianRupee, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';

const CheckEligibilityPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { profile, updateProfileData, isAuthenticated } = useAuth();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    age: 35,
    gender: 'male',
    maritalStatus: 'married',
    state: 'Uttar Pradesh',
    district: 'Lucknow',
    residenceType: 'rural',
    annualIncome: 180000,
    occupation: 'farmer',
    employmentStatus: 'self_employed',
    socialCategory: 'obc',
    disabilityStatus: 'no',
    isBPL: 'no',
    isFarmer: 'yes',
  });

  // Prepopulate if logged in user profile exists
  useEffect(() => {
    if (profile) {
      setFormData((prev) => ({
        ...prev,
        fullName: profile.fullName || prev.fullName,
        age: profile.age || prev.age,
        gender: profile.gender || prev.gender,
        maritalStatus: profile.maritalStatus || prev.maritalStatus,
        state: profile.state || prev.state,
        district: profile.district || prev.district,
        residenceType: profile.residenceType || prev.residenceType,
        annualIncome: profile.annualIncome !== undefined ? profile.annualIncome : prev.annualIncome,
        occupation: profile.occupation || prev.occupation,
        employmentStatus: profile.employmentStatus || prev.employmentStatus,
        socialCategory: profile.socialCategory || prev.socialCategory,
        disabilityStatus: profile.disabilityStatus ? 'yes' : 'no',
        isBPL: profile.isBPL ? 'yes' : 'no',
        isFarmer: profile.isFarmer ? 'yes' : 'no',
      }));
    }
  }, [profile]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        fullName: formData.fullName,
        age: Number(formData.age),
        gender: formData.gender,
        maritalStatus: formData.maritalStatus,
        state: formData.state,
        district: formData.district,
        residenceType: formData.residenceType,
        annualIncome: Number(formData.annualIncome),
        occupation: formData.occupation,
        employmentStatus: formData.employmentStatus,
        socialCategory: formData.socialCategory,
        disabilityStatus: formData.disabilityStatus === 'yes',
        isBPL: formData.isBPL === 'yes',
        isFarmer: formData.isFarmer === 'yes',
      };

      if (isAuthenticated) {
        await updateProfileData(payload);
      }

      // Check eligibility directly via API
      const { data } = await api.post('/eligibility/check', { profile: payload });
      if (data.success) {
        // Store results in sessionStorage to render in results page
        sessionStorage.setItem('labhsetu_eligibility_results', JSON.stringify(data));
        navigate('/results');
      }
    } catch (err) {
      console.error('Error running eligibility evaluation', err);
    } finally {
      setLoading(false);
    }
  };

  const stepsList = [
    { num: 1, title: t('eligibility.step_personal'), icon: User },
    { num: 2, title: t('eligibility.step_residence'), icon: MapPin },
    { num: 3, title: t('eligibility.step_income'), icon: IndianRupee },
    { num: 4, title: t('eligibility.step_special'), icon: ShieldAlert },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {t('eligibility.title')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
          {t('eligibility.subtitle')}
        </p>
      </div>

      {/* Stepper Progress Bar */}
      <div className="grid grid-cols-4 gap-2 sm:gap-4">
        {stepsList.map((s) => {
          const Icon = s.icon;
          const isActive = step === s.num;
          const isDone = step > s.num;
          return (
            <div key={s.num} className="text-center">
              <div
                className={`h-2 rounded-full mb-2 transition-all ${
                  isDone
                    ? 'bg-emerald-600'
                    : isActive
                    ? 'bg-gov-600'
                    : 'bg-slate-200'
                }`}
              />
              <div className="flex items-center justify-center gap-1">
                <span
                  className={`text-[11px] font-semibold hidden sm:inline ${
                    isActive ? 'text-gov-800' : isDone ? 'text-emerald-700' : 'text-slate-400'
                  }`}
                >
                  {s.title}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Questionnaire Card */}
      <Card className="p-6 sm:p-8 border-slate-200 bg-white shadow-subtle">
        {/* Step 1: Personal Details */}
        {step === 1 && (
          <div className="space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Step 1: {t('eligibility.step_personal')}
              </h3>
              <p className="text-xs text-slate-500">
                Used to determine age brackets and family entitlement criteria
              </p>
            </div>

            <div className="space-y-4">
              <Input
                label="Full Name (Optional)"
                value={formData.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                placeholder="e.g. Rameshwar Kumar"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Age (in years)"
                  type="number"
                  min="0"
                  max="120"
                  value={formData.age}
                  onChange={(e) => handleChange('age', e.target.value)}
                  required
                />

                <Select
                  label="Gender"
                  value={formData.gender}
                  onChange={(e) => handleChange('gender', e.target.value)}
                  options={[
                    { value: 'male', label: 'Male' },
                    { value: 'female', label: 'Female' },
                    { value: 'other', label: 'Other' },
                  ]}
                  required
                />
              </div>

              <Select
                label="Marital Status"
                value={formData.maritalStatus}
                onChange={(e) => handleChange('maritalStatus', e.target.value)}
                options={[
                  { value: 'single', label: 'Single / Unmarried' },
                  { value: 'married', label: 'Married' },
                  { value: 'widowed', label: 'Widowed' },
                  { value: 'divorced', label: 'Divorced / Separated' },
                ]}
              />
            </div>
          </div>
        )}

        {/* Step 2: Residence Details */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Step 2: {t('eligibility.step_residence')}
              </h3>
              <p className="text-xs text-slate-500">
                Identifies whether State-specific or rural/urban schemes apply to your area
              </p>
            </div>

            <div className="space-y-4">
              <Select
                label="State of Domicile / Residence"
                value={formData.state}
                onChange={(e) => handleChange('state', e.target.value)}
                options={[
                  'Andhra Pradesh',
                  'Bihar',
                  'Delhi',
                  'Gujarat',
                  'Haryana',
                  'Karnataka',
                  'Madhya Pradesh',
                  'Maharashtra',
                  'Punjab',
                  'Rajasthan',
                  'Tamil Nadu',
                  'Telangana',
                  'Uttar Pradesh',
                  'West Bengal',
                ]}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="District"
                  value={formData.district}
                  onChange={(e) => handleChange('district', e.target.value)}
                  placeholder="e.g. Lucknow, Patna, Varanasi"
                />

                <Select
                  label="Residence Area Type"
                  value={formData.residenceType}
                  onChange={(e) => handleChange('residenceType', e.target.value)}
                  options={[
                    { value: 'rural', label: 'Rural (Gram Panchayat)' },
                    { value: 'urban', label: 'Urban (Municipality / City)' },
                    { value: 'semi-urban', label: 'Semi-Urban / Nagar Panchayat' },
                  ]}
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Income & Livelihood */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Step 3: {t('eligibility.step_income')}
              </h3>
              <p className="text-xs text-slate-500">
                Evaluates income-cap limits and vocational target groups
              </p>
            </div>

            <div className="space-y-4">
              <Input
                label="Annual Household Income (₹ per year)"
                type="number"
                step="10000"
                value={formData.annualIncome}
                onChange={(e) => handleChange('annualIncome', e.target.value)}
                helperText="Total income from all sources including agriculture, wages, or business"
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Primary Occupation"
                  value={formData.occupation}
                  onChange={(e) => handleChange('occupation', e.target.value)}
                  options={[
                    { value: 'farmer', label: 'Farmer / Cultivator' },
                    { value: 'student', label: 'Student' },
                    { value: 'self_employed', label: 'Self Employed / Artisan / Shopkeeper' },
                    { value: 'daily_wage', label: 'Daily Wage Laborer' },
                    { value: 'salaried', label: 'Salaried Private Worker' },
                    { value: 'unemployed', label: 'Unemployed / Job Seeker' },
                  ]}
                  required
                />

                <Select
                  label="Employment Status"
                  value={formData.employmentStatus}
                  onChange={(e) => handleChange('employmentStatus', e.target.value)}
                  options={[
                    { value: 'self_employed', label: 'Self Employed' },
                    { value: 'employed', label: 'Employed' },
                    { value: 'unemployed', label: 'Unemployed' },
                    { value: 'student', label: 'Student' },
                    { value: 'homemaker', label: 'Homemaker' },
                  ]}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Special Categories */}
        {step === 4 && (
          <div className="space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Step 4: {t('eligibility.step_special')}
              </h3>
              <p className="text-xs text-slate-500">
                Crucial for affirmative action, farmer benefits, and targeted welfare
              </p>
            </div>

            <div className="space-y-4">
              <Select
                label="Social Category"
                value={formData.socialCategory}
                onChange={(e) => handleChange('socialCategory', e.target.value)}
                options={[
                  { value: 'general', label: 'General' },
                  { value: 'obc', label: 'Other Backward Class (OBC)' },
                  { value: 'sc', label: 'Scheduled Caste (SC)' },
                  { value: 'st', label: 'Scheduled Tribe (ST)' },
                  { value: 'ews', label: 'Economically Weaker Section (EWS)' },
                ]}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Select
                  label="Do you own agricultural land?"
                  value={formData.isFarmer}
                  onChange={(e) => handleChange('isFarmer', e.target.value)}
                  options={[
                    { value: 'yes', label: 'Yes (Landholding Farmer)' },
                    { value: 'no', label: 'No' },
                  ]}
                />

                <Select
                  label="Do you hold BPL / Antyodaya card?"
                  value={formData.isBPL}
                  onChange={(e) => handleChange('isBPL', e.target.value)}
                  options={[
                    { value: 'yes', label: 'Yes' },
                    { value: 'no', label: 'No' },
                  ]}
                />

                <Select
                  label="Person with Disability (PwD)?"
                  value={formData.disabilityStatus}
                  onChange={(e) => handleChange('disabilityStatus', e.target.value)}
                  options={[
                    { value: 'yes', label: 'Yes (40%+ Disability)' },
                    { value: 'no', label: 'No' },
                  ]}
                />
              </div>
            </div>
          </div>
        )}

        {/* Form Controls */}
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-100">
          {step > 1 ? (
            <Button variant="secondary" size="md" icon={ArrowLeft} onClick={handleBack}>
              {t('eligibility.prev')}
            </Button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <Button variant="primary" size="md" onClick={handleNext}>
              <span>{t('eligibility.next')}</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          ) : (
            <Button
              variant="success"
              size="md"
              icon={CheckCircle2}
              onClick={handleSubmit}
              isLoading={loading}
            >
              {t('eligibility.submit')}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default CheckEligibilityPage;
