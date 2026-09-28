import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, Filter, RotateCcw, SlidersHorizontal, X, ArrowRight, Layers, CheckSquare } from 'lucide-react';
import api from '../services/api';
import SchemeCard from '../components/scheme/SchemeCard';
import { SchemeCardSkeleton } from '../components/ui/Skeleton';
import { EmptyState, ErrorState } from '../components/ui/EmptyState';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';

const FindSchemesPage = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters state initialized from URL query params
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [stateScope, setStateScope] = useState(searchParams.get('state') || 'All');
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

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSchemes();
    }, 250);
    return () => clearTimeout(timer);
  }, [searchTerm, category, stateScope, benefitType, page]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setCategory('All');
    setStateScope('All');
    setBenefitType('All');
    setPage(1);
    setSearchParams({});
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

  const hasActiveFilters = searchTerm || category !== 'All' || stateScope !== 'All' || benefitType !== 'All';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header & Search */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {t('nav.find_schemes')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Explore authentic Central and State government welfare schemes and grants
            </p>
          </div>
          <Link to="/check-eligibility">
            <Button variant="primary" size="sm" className="font-bold rounded-xl shadow-xs">
              Check My Eligibility
            </Button>
          </Link>
        </div>

        {/* Search input with clear button */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t('schemes.search_placeholder')}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-full pl-11 pr-10 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-gov-600 focus:border-gov-600 shadow-xs font-medium"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <Button
            variant="outline"
            className="lg:hidden flex items-center gap-1.5 bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>{t('schemes.filters')}</span>
          </Button>
        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="font-semibold text-slate-500 dark:text-slate-400">Active filters:</span>
            {category !== 'All' && (
              <span className="inline-flex items-center gap-1 bg-gov-50 dark:bg-sky-950/60 text-gov-800 dark:text-sky-300 font-semibold px-2.5 py-1 rounded-full border border-gov-200 dark:border-sky-800">
                Category: {category}
                <button onClick={() => setCategory('All')}>
                  <X className="w-3.5 h-3.5 hover:text-rose-600" />
                </button>
              </span>
            )}
            {stateScope !== 'All' && (
              <span className="inline-flex items-center gap-1 bg-gov-50 dark:bg-sky-950/60 text-gov-800 dark:text-sky-300 font-semibold px-2.5 py-1 rounded-full border border-gov-200 dark:border-sky-800">
                State: {stateScope}
                <button onClick={() => setStateScope('All')}>
                  <X className="w-3.5 h-3.5 hover:text-rose-600" />
                </button>
              </span>
            )}
            {benefitType !== 'All' && (
              <span className="inline-flex items-center gap-1 bg-gov-50 dark:bg-sky-950/60 text-gov-800 dark:text-sky-300 font-semibold px-2.5 py-1 rounded-full border border-gov-200 dark:border-sky-800">
                Benefit: {benefitType}
                <button onClick={() => setBenefitType('All')}>
                  <X className="w-3.5 h-3.5 hover:text-rose-600" />
                </button>
              </span>
            )}
            {searchTerm && (
              <span className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                Keyword: "{searchTerm}"
                <button onClick={() => setSearchTerm('')}>
                  <X className="w-3.5 h-3.5 hover:text-rose-600" />
                </button>
              </span>
            )}
            <button
              onClick={handleResetFilters}
              className="text-xs text-rose-600 hover:text-rose-800 font-bold ml-1 underline"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Left Sidebar Filters (Desktop Sticky) */}
        <div
          className={`lg:block ${
            mobileFilterOpen ? 'block' : 'hidden'
          } bg-white dark:bg-[#111a2e] p-6 rounded-2xl border border-slate-200 dark:border-[#1e2c45] shadow-subtle space-y-6 lg:sticky lg:top-24`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-gov-600 dark:text-sky-400" />
              <span>{t('schemes.filters')}</span>
            </h3>
            <button
              onClick={handleResetFilters}
              className="text-xs text-gov-600 dark:text-sky-400 hover:text-gov-800 flex items-center gap-1 font-semibold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
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

          {/* Quick Guidance Box */}
          <div className="p-3.5 rounded-xl bg-gov-50/70 dark:bg-slate-800/80 border border-gov-100 dark:border-slate-700 text-xs text-gov-900 dark:text-slate-100 space-y-1">
            <span className="font-bold block">Need help choosing?</span>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
              Answer 4 questions on our eligibility screener to get matched schemes instantly.
            </p>
            <Link
              to="/check-eligibility"
              className="inline-flex items-center gap-1 text-[11px] font-bold text-gov-700 dark:text-sky-400 hover:underline pt-1"
            >
              <span>Launch Screener</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Right Scheme Cards Grid */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold px-1">
            <span>
              Showing {schemes.length} of {totalCount} verified schemes
            </span>
            <span>Sorted by Latest Verified</span>
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
            <div className="flex items-center justify-center gap-2 pt-6 border-t border-slate-200 dark:border-slate-800">
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <span className="text-xs text-slate-700 dark:text-slate-300 font-bold px-3">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl"
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
