import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { User, CheckCircle2, Save, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';

const ProfilePage = () => {
  const { t } = useTranslation();
  const { user, profile, updateProfileData } = useAuth();
  const { success, error } = useToast();

  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    gender: 'male',
    maritalStatus: 'married',
    state: 'Uttar Pradesh',
    district: '',
    residenceType: 'rural',
    annualIncome: '',
    occupation: 'farmer',
    employmentStatus: 'self_employed',
    socialCategory: 'obc',
    disabilityStatus: 'no',
    isBPL: 'no',
    isFarmer: 'yes',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || user?.name || '',
        age: profile.age || '',
        gender: profile.gender || 'male',
        maritalStatus: profile.maritalStatus || 'married',
        state: profile.state || 'Uttar Pradesh',
        district: profile.district || '',
        residenceType: profile.residenceType || 'rural',
        annualIncome: profile.annualIncome !== undefined ? profile.annualIncome : '',
        occupation: profile.occupation || 'farmer',
        employmentStatus: profile.employmentStatus || 'self_employed',
        socialCategory: profile.socialCategory || 'obc',
        disabilityStatus: profile.disabilityStatus ? 'yes' : 'no',
        isBPL: profile.isBPL ? 'yes' : 'no',
        isFarmer: profile.isFarmer ? 'yes' : 'no',
      });
    }
  }, [profile, user]);

  const handleChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfileData({
        fullName: formData.fullName,
        age: formData.age ? Number(formData.age) : undefined,
        gender: formData.gender,
        maritalStatus: formData.maritalStatus,
        state: formData.state,
        district: formData.district,
        residenceType: formData.residenceType,
        annualIncome: formData.annualIncome !== '' ? Number(formData.annualIncome) : undefined,
        occupation: formData.occupation,
        employmentStatus: formData.employmentStatus,
        socialCategory: formData.socialCategory,
        disabilityStatus: formData.disabilityStatus === 'yes',
        isBPL: formData.isBPL === 'yes',
        isFarmer: formData.isFarmer === 'yes',
      });
      success('Citizen profile updated successfully!');
    } catch (err) {
      error(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const score = profile?.completionScore || 40;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header & Score Bar */}
      <div className="bg-white dark:bg-[#111a2e] p-6 rounded-2xl border border-slate-200 dark:border-[#1e2c45] shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gov-100 dark:bg-sky-950 text-gov-800 dark:text-sky-300 font-bold flex items-center justify-center text-xl border-2 border-gov-300 dark:border-sky-800 shadow-xs">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">{user?.name}</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Role: <span className="uppercase text-gov-700 dark:text-sky-400 font-semibold">{user?.role}</span> • {user?.email}
            </p>
          </div>
        </div>

        <div className="sm:text-right">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
            Profile Completion Score
          </span>
          <div className="flex items-center sm:justify-end gap-3">
            <div className="w-32 bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden border border-slate-200 dark:border-slate-700">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all"
                style={{ width: `${score}%` }}
              />
            </div>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{score}%</span>
          </div>
        </div>
      </div>

      {/* Main Profile Form */}
      <Card className="p-6 sm:p-8 border-slate-200 dark:border-[#1e2c45]">
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Personal Details</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Baseline citizen demographic information
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Full Name"
                value={formData.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
              />
              <Input
                label="Age (in years)"
                type="number"
                value={formData.age}
                onChange={(e) => handleChange('age', e.target.value)}
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
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Residence Location</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Used for state and panchayat scheme jurisdictional matching
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Select
                label="State of Domicile"
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
              />
              <Input
                label="District"
                value={formData.district}
                onChange={(e) => handleChange('district', e.target.value)}
                placeholder="e.g. Lucknow"
              />
              <Select
                label="Residence Type"
                value={formData.residenceType}
                onChange={(e) => handleChange('residenceType', e.target.value)}
                options={[
                  { value: 'rural', label: 'Rural' },
                  { value: 'urban', label: 'Urban' },
                  { value: 'semi-urban', label: 'Semi-Urban' },
                ]}
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Economic & Category Background</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Determines income bracket exemptions and targeted subsidies
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Annual Household Income (₹)"
                type="number"
                value={formData.annualIncome}
                onChange={(e) => handleChange('annualIncome', e.target.value)}
              />
              <Select
                label="Primary Occupation"
                value={formData.occupation}
                onChange={(e) => handleChange('occupation', e.target.value)}
                options={[
                  { value: 'farmer', label: 'Farmer / Cultivator' },
                  { value: 'student', label: 'Student' },
                  { value: 'self_employed', label: 'Self Employed' },
                  { value: 'daily_wage', label: 'Daily Wage Laborer' },
                  { value: 'salaried', label: 'Salaried' },
                  { value: 'unemployed', label: 'Unemployed' },
                ]}
              />
              <Select
                label="Social Category"
                value={formData.socialCategory}
                onChange={(e) => handleChange('socialCategory', e.target.value)}
                options={[
                  { value: 'general', label: 'General' },
                  { value: 'obc', label: 'OBC' },
                  { value: 'sc', label: 'SC' },
                  { value: 'st', label: 'ST' },
                  { value: 'ews', label: 'EWS' },
                ]}
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Select
                label="Landholding Farmer?"
                value={formData.isFarmer}
                onChange={(e) => handleChange('isFarmer', e.target.value)}
                options={[
                  { value: 'yes', label: 'Yes' },
                  { value: 'no', label: 'No' },
                ]}
              />
              <Select
                label="BPL / Ration Card Holder?"
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
                  { value: 'yes', label: 'Yes' },
                  { value: 'no', label: 'No' },
                ]}
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="submit"
              variant="primary"
              size="md"
              icon={Save}
              isLoading={saving}
              className="rounded-xl shadow-xs font-bold"
            >
              Save Profile Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ProfilePage;
