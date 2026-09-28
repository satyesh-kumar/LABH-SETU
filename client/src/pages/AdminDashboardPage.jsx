import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  Layers,
  FileText,
  Users,
  CheckCircle2,
  Plus,
  Trash2,
  Edit,
  Clock,
  BarChart3,
  Search,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Modal from '../components/ui/Modal';

const AdminDashboardPage = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { success, error } = useToast();

  const [metrics, setMetrics] = useState(null);
  const [charts, setCharts] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Scheme Modal state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newScheme, setNewScheme] = useState({
    name: '',
    nameHi: '',
    department: '',
    category: 'Agriculture',
    benefitType: 'Direct Cash Transfer',
    benefitSummary: '',
    shortDescription: '',
    fullDescription: '',
    stateScope: 'All India',
    officialPortalUrl: 'https://india.gov.in',
  });

  const fetchData = async () => {
    try {
      const [metricsRes, schemesRes] = await Promise.all([
        api.get('/admin/metrics'),
        api.get('/schemes?limit=50'),
      ]);

      if (metricsRes.data.success) {
        setMetrics(metricsRes.data.metrics);
        setCharts(metricsRes.data.charts);
        setAuditLogs(metricsRes.data.recentAuditLogs || []);
      }

      if (schemesRes.data.success) {
        setSchemes(schemesRes.data.schemes);
      }
    } catch (err) {
      console.error('Failed to load admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    fetchData();
  }, [isAdmin]);

  const handleCreateScheme = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { data } = await api.post('/admin/schemes', newScheme);
      if (data.success) {
        success('New scheme created and published with Version 1!');
        setCreateModalOpen(false);
        fetchData();
      }
    } catch (err) {
      error(err.message || 'Failed to create scheme');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteScheme = async (schemeId) => {
    if (!window.confirm('Delete this scheme and all associated rules and requirements?')) return;
    try {
      const { data } = await api.delete(`/admin/schemes/${schemeId}`);
      if (data.success) {
        success('Scheme deleted successfully.');
        fetchData();
      }
    } catch (err) {
      error(err.message || 'Failed to delete scheme');
    }
  };

  const COLORS = ['#1b5e9c', '#138808', '#FF9933', '#8b5cf6', '#0284c7', '#d97706'];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-500">
        <p className="text-sm">Loading Administration Portal...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="primary" size="sm">
              Role: {user?.role?.toUpperCase()}
            </Badge>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500">Central Verification & Audit Node</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Government Administration & Scheme Governance
          </h1>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={Plus}
          onClick={() => setCreateModalOpen(true)}
        >
          Add New Scheme
        </Button>
      </div>

      {/* Metrics Grid (Section 32) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card className="p-4 border-slate-200 dark:border-[#1e2c45]">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
            Total Schemes
          </span>
          <span className="text-2xl font-bold text-slate-900 dark:text-white mt-1 block">
            {metrics?.totalSchemes || 0}
          </span>
        </Card>

        <Card className="p-4 border-slate-200 dark:border-[#1e2c45]">
          <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
            Active / Published
          </span>
          <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 block">
            {metrics?.publishedSchemes || 0}
          </span>
        </Card>

        <Card className="p-4 border-slate-200 dark:border-[#1e2c45]">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
            Applications Logged
          </span>
          <span className="text-2xl font-bold text-slate-900 dark:text-white mt-1 block">
            {metrics?.totalApplications || 0}
          </span>
        </Card>

        <Card className="p-4 border-slate-200 dark:border-[#1e2c45]">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
            Verified Documents
          </span>
          <span className="text-2xl font-bold text-slate-900 dark:text-white mt-1 block">
            {metrics?.totalDocuments || 0}
          </span>
        </Card>

        <Card className="p-4 border-slate-200 dark:border-[#1e2c45]">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
            Citizens Registered
          </span>
          <span className="text-2xl font-bold text-slate-900 dark:text-white mt-1 block">
            {metrics?.totalUsers || 0}
          </span>
        </Card>
      </div>

      {/* Charts (Recharts) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 border-slate-200 dark:border-[#1e2c45]">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-gov-600 dark:text-sky-400" />
            <span>Schemes by Socio-Economic Category</span>
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts?.schemesByCategory || []}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#1b5e9c" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 border-slate-200 dark:border-[#1e2c45]">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-gov-600 dark:text-sky-400" />
            <span>Recent System Audit Trail (Section 64)</span>
          </h3>
          <div className="space-y-3 overflow-y-auto max-h-64 pr-2">
            {auditLogs.length === 0 ? (
              <p className="text-xs text-slate-400">No audit logs recorded yet.</p>
            ) : (
              auditLogs.map((log) => (
                <div key={log._id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs">
                  <div className="flex items-center justify-between font-semibold text-slate-800 dark:text-slate-100 mb-1">
                    <span>{log.action}</span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                    Actor: <span className="font-medium text-slate-800 dark:text-slate-200">{log.actorName}</span> ({log.actorRole}) • Target: {log.entity}
                  </p>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Scheme Management List */}
      <Card className="p-6 border-slate-200 dark:border-[#1e2c45]">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Published Schemes Directory ({schemes.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-semibold uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-3 px-4">Scheme Name</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Version</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {schemes.map((s) => (
                <tr key={s._id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white max-w-xs truncate">
                    {s.name}
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400 max-w-[200px] truncate">
                    {s.department}
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="primary" size="sm">{s.category}</Badge>
                  </td>
                  <td className="py-3 px-4 font-mono font-medium text-slate-700 dark:text-slate-300">
                    v{s.version || 1}
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="success" size="sm">Published</Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleDeleteScheme(s._id)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                      title="Delete scheme"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Scheme Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Add New Verified Government Scheme"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleCreateScheme} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Scheme Name (English)"
              value={newScheme.name}
              onChange={(e) => setNewScheme({ ...newScheme, name: e.target.value })}
              required
            />
            <Input
              label="Scheme Name (Hindi)"
              value={newScheme.nameHi}
              onChange={(e) => setNewScheme({ ...newScheme, nameHi: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Department / Ministry"
              value={newScheme.department}
              onChange={(e) => setNewScheme({ ...newScheme, department: e.target.value })}
              required
            />
            <Select
              label="Category"
              value={newScheme.category}
              onChange={(e) => setNewScheme({ ...newScheme, category: e.target.value })}
              options={[
                'Agriculture',
                'Housing',
                'Health',
                'Education',
                'Employment',
                'Entrepreneurship',
                'Social Welfare',
              ]}
            />
          </div>

          <Input
            label="Key Benefit Summary"
            value={newScheme.benefitSummary}
            onChange={(e) => setNewScheme({ ...newScheme, benefitSummary: e.target.value })}
            placeholder="e.g. ₹6,000 per year direct income support"
            required
          />

          <Input
            label="Short Description"
            value={newScheme.shortDescription}
            onChange={(e) => setNewScheme({ ...newScheme, shortDescription: e.target.value })}
            required
          />

          <Input
            label="Official Portal URL"
            value={newScheme.officialPortalUrl}
            onChange={(e) => setNewScheme({ ...newScheme, officialPortalUrl: e.target.value })}
            required
          />

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSubmitting}
            >
              Create & Publish Scheme
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminDashboardPage;
