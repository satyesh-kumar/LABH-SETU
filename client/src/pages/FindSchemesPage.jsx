import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Filter, RotateCcw, SlidersHorizontal } from 'lucide-react';
import api from '../services/api';
import SchemeCard from '../components/scheme/SchemeCard';
import { SchemeCardSkeleton } from '../components/ui/Skeleton';
import { EmptyState, ErrorState } from '../components/ui/EmptyState';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';

const FindSchemesPage = () => {
  const { t } = useTranslation();
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  const [stateScope, setStateScope] = useState('All');
  const [benefitType, setBenefitType] = useState('All');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchSchemes = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (searchTerm.trim()) params.append('search', searchTerm.trim());
      if (category && category !== 'All') params.append('category', category);
      if (stateScope && stateScope !== 'All') params.append('state', stateScope);
      if (benefitType && benefitType !== 'All') params.append('benefitType', benefitType);
      params.append('page', page);
      params.append('limit', 9);

      const { data } = await api.get(`/schemes?${params.toString()}`);
      if (data.success) {
        setSchemes(data.schemes);
        setTotalPages(data.totalPages);
        setTotalCount(data.total);
      }
    } catch (err) {
      setError(err.message || 'Failed to load schemes');
    } finally {
      setLoading(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchSchemes();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, category, stateScope, benefitType, page]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setCategory('All');
    setStateScope('All');
    setBenefitType('All');
    setPage(1);
  };

  const categories = [
    'All',
    'Agriculture',
    'Housing',
    'Health',
    'Education',
    'Employment',
    'Entrepreneurship',
    'Social Welfare',
  ];

  const states = [
    'All',
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

  const benefitTypes = [
    'All',
    'Direct Cash Transfer',
    'Subsidized Loan',
    'Free Service',
    'Scholarship',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header & Search */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {t('nav.find_schemes')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Explore verified government benefits across sectors and states
          </p>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t('schemes.search_placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-gov-600 focus:border-gov-600 shadow-xs"
            />
          </div>
          <Button
            variant="outline"
            className="lg:hidden flex items-center gap-1.5"
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>{t('schemes.filters')}</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Left Sidebar Filters (Desktop) */}
        <div
          className={`lg:block ${
            mobileFilterOpen ? 'block' : 'hidden'
          } bg-white p-6 rounded-xl border border-slate-200 shadow-subtle space-y-6`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-gov-600" />
              <span>{t('schemes.filters')}</span>
            </h3>
            <button
              onClick={handleResetFilters}
              className="text-xs text-gov-600 hover:text-gov-800 flex items-center gap-1 font-medium"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{t('schemes.reset_filters')}</span>
            </button>
          </div>

          <div className="space-y-4">
            <Select
              label={t('schemes.category')}
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
              options={categories.map((c) => ({
                value: c,
                label: c === 'All' ? t('schemes.all_categories') : c,
              }))}
            />

            <Select
              label={t('schemes.state_scope')}
              value={stateScope}
              onChange={(e) => {
                setStateScope(e.target.value);
                setPage(1);
              }}
              options={states.map((s) => ({
                value: s,
                label: s === 'All' ? t('schemes.all_states') : s,
              }))}
            />

            <Select
              label={t('schemes.benefit')}
              value={benefitType}
              onChange={(e) => {
                setBenefitType(e.target.value);
                setPage(1);
              }}
              options={benefitTypes.map((b) => ({
                value: b,
                label: b === 'All' ? 'All Benefit Types' : b,
              }))}
            />
          </div>
        </div>

        {/* Right Scheme Cards Grid */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
            <span>
              {totalCount} {t('schemes.results_found')}
            </span>
            {searchTerm && <span>Search: "{searchTerm}"</span>}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <SchemeCardSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <ErrorState description={error} onRetry={fetchSchemes} />
          ) : schemes.length === 0 ? (
            <EmptyState
              title={t('schemes.no_results')}
              description={t('schemes.no_results_desc')}
              actionLabel={t('schemes.reset_filters')}
              onAction={handleResetFilters}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {schemes.map((scheme) => (
                <SchemeCard key={scheme._id} scheme={scheme} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6 border-t border-slate-200">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <span className="text-xs text-slate-600 font-medium px-3">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindSchemesPage;
