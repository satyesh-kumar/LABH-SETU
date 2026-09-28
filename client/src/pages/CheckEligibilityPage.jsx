import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  User,
  MapPin,
  IndianRupee,
  ShieldAlert,
  HelpCircle,
  Sparkles,
  Wheat,
  GraduationCap,
  Hammer,
  Briefcase,
  Users,
  Building,
  Home,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const CheckEligibilityPage = () => {
  const { t, i18n } = useTranslation();
  const isHi = i18n.language === 'hi';
  const navigate = useNavigate();
  const { profile, updateProfileData, isAuthenticated } = useAuth();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    age: 38,
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

  const occupations = [
    { id: 'farmer', label: 'Farmer / Kisan', icon: Wheat, desc: 'Owns or tills agricultural land' },
    { id: 'student', label: 'Student', icon: GraduationCap, desc: 'School, college, or higher studies' },
    { id: 'self_employed', label: 'Artisan / Shopkeeper', icon: Hammer, desc: 'Micro enterprise, vendor, crafts' },
    { id: 'daily_wage', label: 'Daily Wage Laborer', icon: Users, desc: 'Manual or seasonal wage work' },
    { id: 'salaried', label: 'Private Salaried', icon: Briefcase, desc: 'Organized / private job' },
    { id: 'unemployed', label: 'Job Seeker', icon: HelpCircle, desc: 'Currently seeking employment' },
  ];

  const states = [
    'All India',
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
    'Uttar Pradesh',
    'West Bengal',
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gov-100 text-gov-800 text-xs font-bold border border-gov-200">
          <Sparkles className="w-3.5 h-3.5 text-gov-600" />
          <span>Transparent 4-Step Questionnaire</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          {t('eligibility.title')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto font-medium">
          {t('eligibility.subtitle')}
        </p>
      </div>

      {/* Stepper Progress Bar */}
      <div className="grid grid-cols-4 gap-2 sm:gap-4">
        {stepsList.map((s) => {
          const isActive = step === s.num;
          const isDone = step > s.num;
          return (
            <div key={s.num} className="text-center">
              <div
                className={`h-2.5 rounded-full mb-2 transition-all ${
                  isDone
                    ? 'bg-emerald-600'
                    : isActive
                    ? 'bg-gov-600 ring-2 ring-gov-600 ring-offset-2'
                    : 'bg-slate-200'
                }`}
              />
              <span
                className={`text-xs font-bold block ${
                  isActive ? 'text-gov-800' : isDone ? 'text-emerald-700' : 'text-slate-400'
                }`}
              >
                {s.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* Main Questionnaire Card */}
      <Card className="p-5 sm:p-8 border-slate-200 dark:border-slate-800 shadow-subtle">
        {/* Step 1: Personal Details */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Step 1: {t('eligibility.step_personal')}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Age and gender brackets determine specific youth, women, and pension entitlements.
              </p>
            </div>

            <div className="space-y-5">
              <Input
                label="Full Name (Optional)"
                value={formData.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                placeholder="e.g. Rameshwar Kumar Sharma"
                helperText="Will be used to personalize your scheme application guides"
              />

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-2">
                  Gender *
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'male', label: 'Male 👨' },
                    { id: 'female', label: 'Female 👩' },
                    { id: 'other', label: 'Other 🧑' },
                  ].map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => handleChange('gender', g.id)}
                      className={`py-3 px-3 sm:px-4 rounded-xl border text-center font-bold text-xs sm:text-sm transition-all ${
                        formData.gender === g.id
                          ? 'border-gov-600 bg-gov-50/70 dark:bg-gov-900/40 text-gov-900 dark:text-gov-300 ring-2 ring-gov-600'
                          : 'border-slate-200 dark:border-slate-700 bg-slate-50/40 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Age (Years) *"
                  type="number"
                  min="0"
                  max="120"
                  value={formData.age}
                  onChange={(e) => handleChange('age', e.target.value)}
                  required
                />

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-2">
                    Marital Status
                  </label>
                  <select
                    value={formData.maritalStatus}
                    onChange={(e) => handleChange('maritalStatus', e.target.value)}
                    className="w-full px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-gov-600 transition-colors"
                  >
                    <option value="single">Single / Unmarried</option>
                    <option value="married">Married</option>
                    <option value="widowed">Widowed</option>
                    <option value="divorced">Divorced / Separated</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Residence Details */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Step 2: {t('eligibility.step_residence')}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Identifies state-administered benefits (e.g. state scholarships, regional subsidies).
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-2">
                  State of Domicile / Residence *
                </label>
                <select
                  value={formData.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                  className="w-full px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-gov-600 transition-colors"
                >
                  {states.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-2">
                  Area Type (Crucial for Housing & MGNREGA) *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'rural', label: '🏡 Rural Area', desc: 'Gram Panchayat village' },
                    { id: 'urban', label: '🏢 Urban Area', desc: 'Municipality / City' },
                    { id: 'semi-urban', label: '🏘️ Semi-Urban', desc: 'Town / Nagar Panchayat' },
                  ].map((area) => (
                    <button
                      key={area.id}
                      type="button"
                      onClick={() => handleChange('residenceType', area.id)}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        formData.residenceType === area.id
                          ? 'border-gov-600 bg-gov-50/70 dark:bg-gov-900/40 text-gov-900 dark:text-gov-300 ring-2 ring-gov-600'
                          : 'border-slate-200 dark:border-slate-700 bg-slate-50/40 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className="font-bold text-sm block">{area.label}</span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">{area.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <Input
                label="District (Optional)"
                value={formData.district}
                onChange={(e) => handleChange('district', e.target.value)}
                placeholder="e.g. Lucknow, Varanasi, Patna"
              />
            </div>
          </div>
        )}

        {/* Step 3: Income & Livelihood */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Step 3: {t('eligibility.step_income')}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Most government welfare schemes have official income thresholds.
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-2">
                  Primary Occupation *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {occupations.map((occ) => {
                    const Icon = occ.icon;
                    return (
                      <button
                        key={occ.id}
                        type="button"
                        onClick={() => handleChange('occupation', occ.id)}
                        className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                          formData.occupation === occ.id
                            ? 'border-gov-600 bg-gov-50/70 dark:bg-gov-900/40 text-gov-900 dark:text-gov-300 ring-2 ring-gov-600'
                            : 'border-slate-200 dark:border-slate-700 bg-slate-50/40 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <Icon className="w-5 h-5 text-gov-600 dark:text-gov-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-bold text-sm block">{occ.label}</span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 block">{occ.desc}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <Input
                  label="Annual Family Income (₹) *"
                  type="number"
                  step="10000"
                  value={formData.annualIncome}
                  onChange={(e) => handleChange('annualIncome', e.target.value)}
                  required
                />
                {/* Income Presets */}
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Quick set:</span>
                  {[
                    { label: '₹1.2 Lakh (BPL Cap)', val: 120000 },
                    { label: '₹1.8 Lakh (Small Farmer)', val: 180000 },
                    { label: '₹2.5 Lakh (Ayushman Cap)', val: 250000 },
                    { label: '₹3.5 Lakh (NMMSS Cap)', val: 350000 },
                  ].map((preset) => (
                    <button
                      key={preset.val}
                      type="button"
                      onClick={() => handleChange('annualIncome', preset.val)}
                      className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-gov-50 dark:hover:bg-gov-900/40 hover:text-gov-800 dark:hover:text-gov-300 text-slate-700 dark:text-slate-200 transition-colors border border-slate-200 dark:border-slate-700"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Special Categories */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Step 4: {t('eligibility.step_special')}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Key affirmative welfare conditions, farmer landholding, and BPL entitlements.
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-2">
                  Social Category *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {['General', 'OBC', 'SC', 'ST', 'EWS'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleChange('socialCategory', cat.toLowerCase())}
                      className={`py-3 px-3 rounded-xl border text-center font-bold text-sm transition-all ${
                        formData.socialCategory === cat.toLowerCase()
                          ? 'border-gov-600 bg-gov-50/70 dark:bg-gov-900/40 text-gov-900 dark:text-gov-300 ring-2 ring-gov-600'
                          : 'border-slate-200 dark:border-slate-700 bg-slate-50/40 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Yes / No Toggle Cards */}
              <div className="space-y-3 pt-2">
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/30 dark:bg-slate-800/30 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-100 block">
                      Do you own cultivable agricultural land? (PM-KISAN)
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Unlocks central farmer income support and crop insurance.
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => handleChange('isFarmer', 'yes')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        formData.isFarmer === 'yes'
                          ? 'bg-gov-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => handleChange('isFarmer', 'no')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        formData.isFarmer === 'no'
                          ? 'bg-gov-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/30 dark:bg-slate-800/30 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-100 block">
                      Do you hold BPL / NFSA Ration Card?
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Unlocks subsidized housing (PMAY-G) and health insurance (PM-JAY).
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => handleChange('isBPL', 'yes')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        formData.isBPL === 'yes'
                          ? 'bg-gov-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => handleChange('isBPL', 'no')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        formData.isBPL === 'no'
                          ? 'bg-gov-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/30 dark:bg-slate-800/30 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-100 block">
                      Person with Disability (PwD 40%+)?
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Unlocks disability pension and assistive welfare aid.
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => handleChange('disabilityStatus', 'yes')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        formData.disabilityStatus === 'yes'
                          ? 'bg-gov-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => handleChange('disabilityStatus', 'no')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        formData.disabilityStatus === 'no'
                          ? 'bg-gov-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Controls */}
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
          {step > 1 ? (
            <Button variant="secondary" size="md" icon={ArrowLeft} onClick={handleBack} className="font-bold">
              {t('eligibility.prev')}
            </Button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <Button variant="primary" size="md" onClick={handleNext} className="font-bold shadow-xs">
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
              className="font-bold shadow-md px-6"
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
