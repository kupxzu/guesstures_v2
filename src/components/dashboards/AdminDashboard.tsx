import React, { useState, useEffect } from 'react';
import { User, Project, ProjectStatus, Payment } from '../../types';
import { api } from '../../services/api';
import {
  ShieldAlert,
  Layers,
  CheckCircle2,
  Clock,
  Search,
  Save,
  Users,
  Wallet,
  LogOut,
  TrendingUp,
  GraduationCap,
  Building2,
  RefreshCw,
  Globe,
  LayoutDashboard,
  BarChart3,
  FolderKanban,
  CreditCard,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
  onClose: () => void;
}

type NavKey = 'analytics' | 'projects' | 'users' | 'payments';
type CategoryMode = 'student' | 'business';

// Top-level items (Projects is rendered separately as a dropdown).
const TOP_NAV: { key: NavKey; label: string; icon: React.ReactNode }[] = [
  { key: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-6 h-6" /> },
];

const BOTTOM_NAV: { key: NavKey; label: string; icon: React.ReactNode }[] = [
  { key: 'users', label: 'Clients', icon: <Users className="w-6 h-6" /> },
  { key: 'payments', label: 'Payments', icon: <CreditCard className="w-6 h-6" /> },
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  user,
  onLogout,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<NavKey>('analytics');
  const [categoryMode, setCategoryMode] = useState<CategoryMode>('student');
  const [projects, setProjects] = useState<Project[]>([]);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [paymentsList, setPaymentsList] = useState<Payment[]>([]);
  const [stats, setStats] = useState<any>({
    total_projects: 0,
    pending_projects: 0,
    in_progress_projects: 0,
    completed_projects: 0,
    total_students: 0,
    total_businesses: 0,
    total_revenue: 0,
  });

  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [projectsOpen, setProjectsOpen] = useState(true);

  // Pagination
  const [projectPage, setProjectPage] = useState(1);
  const [projectLastPage, setProjectLastPage] = useState(1);
  const [userPage, setUserPage] = useState(1);
  const [userLastPage, setUserLastPage] = useState(1);
  const [paymentPage, setPaymentPage] = useState(1);
  const [paymentLastPage, setPaymentLastPage] = useState(1);

  // Links editing
  const [stagingUrl, setStagingUrl] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [savingLinks, setSavingLinks] = useState(false);
  const [linksSavedFeedback, setLinksSavedFeedback] = useState(false);

  // Quote editing
  const [quoteInput, setQuoteInput] = useState('');
  const [savingQuote, setSavingQuote] = useState(false);

  // Modal (replaces alert)
  const [modal, setModal] = useState<{
    type: 'success' | 'error';
    title: string;
    message: string;
  } | null>(null);

  const applySelection = (proj: Project) => {
    setSelectedProject(proj);
    setStagingUrl(proj.deployment_url || '');
    setRepoUrl(proj.repository_url || '');
    setQuoteInput(proj.quoted_price != null ? String(proj.quoted_price) : '');
    setLinksSavedFeedback(false);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsData, projsPage, all, usersPage, paymentsPage] = await Promise.all([
        api.admin.getStats().catch(() => ({})),
        api.admin.getProjectsPage(projectPage, statusFilter, searchQuery, categoryMode).catch(() => ({ data: [], lastPage: 1, total: 0 })),
        api.admin.getAllProjects('all', '', 'all').catch(() => []),
        api.admin.getUsersPage(userPage).catch(() => ({ data: [], lastPage: 1, total: 0 })),
        api.admin.getPaymentsPage(paymentPage).catch(() => ({ data: [], lastPage: 1, total: 0 })),
      ]);

      setStats(statsData && typeof statsData === 'object' ? statsData : {});
      const safeProjs = Array.isArray(projsPage.data) ? projsPage.data : [];
      setProjects(safeProjs);
      setProjectLastPage(projsPage.lastPage || 1);
      setAllProjects(Array.isArray(all) ? all : []);
      setUsersList(Array.isArray(usersPage.data) ? usersPage.data : []);
      setUserLastPage(usersPage.lastPage || 1);
      setPaymentsList(Array.isArray(paymentsPage.data) ? paymentsPage.data : []);
      setPaymentLastPage(paymentsPage.lastPage || 1);

      if (safeProjs.length > 0) {
        const current = selectedProject
          ? safeProjs.find((p) => p.id === selectedProject.id) || safeProjs[0]
          : safeProjs[0];
        applySelection(current);
      } else {
        setSelectedProject(null);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
      setProjects([]);
      setAllProjects([]);
      setUsersList([]);
      setPaymentsList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, searchQuery, categoryMode, projectPage, userPage, paymentPage]);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setProjectPage(1);
  }, [statusFilter, searchQuery, categoryMode]);

  const handleSelectProject = (proj: Project) => applySelection(proj);

  const handleUpdateStatus = async (newStatus: ProjectStatus) => {
    if (!selectedProject) return;
    try {
      const updated = await api.admin.updateProjectStatus(selectedProject.id, newStatus);
      setSelectedProject(updated);
      setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      setStats(await api.admin.getStats());
    } catch (err: any) {
      setModal({ type: 'error', title: 'Update Failed', message: err.message || 'Failed to update status.' });
    }
  };

  const handleToggleMilestone = async (milestoneId: number, currentVal: boolean) => {
    if (!selectedProject) return;
    try {
      const updated = await api.admin.updateMilestone(selectedProject.id, milestoneId, !currentVal);
      setSelectedProject(updated);
      setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    } catch (err: any) {
      setModal({ type: 'error', title: 'Update Failed', message: err.message || 'Failed to update milestone.' });
    }
  };

  const handleSaveLinks = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;
    setSavingLinks(true);
    try {
      const updated = await api.admin.updateProjectLinks(selectedProject.id, stagingUrl, repoUrl);
      setSelectedProject(updated);
      setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      setLinksSavedFeedback(true);
      setTimeout(() => setLinksSavedFeedback(false), 2500);
    } catch (err: any) {
      setModal({ type: 'error', title: 'Save Failed', message: err.message || 'Failed to save URLs.' });
    } finally {
      setSavingLinks(false);
    }
  };

  const handleSetQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject || !quoteInput) return;
    setSavingQuote(true);
    try {
      const updated = await api.admin.setQuote(selectedProject.id, parseFloat(quoteInput));
      setSelectedProject(updated);
      setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      setModal({
        type: 'success',
        title: 'Quote Sent',
        message: `A deal price of ₱${parseFloat(quoteInput).toLocaleString()} has been sent to the client. They can now proceed to payment.`,
      });
    } catch (err: any) {
      setModal({ type: 'error', title: 'Quote Failed', message: err.message || 'Failed to set quote.' });
    } finally {
      setSavingQuote(false);
    }
  };

  const statusColor = (status: string) =>
    status === 'completed'
      ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
      : status === 'in_progress'
      ? 'bg-blue-100 text-blue-700 border border-blue-300'
      : status === 'ready_for_defense'
      ? 'bg-purple-100 text-purple-700 border border-purple-300'
      : 'bg-amber-100 text-amber-700 border border-amber-300';

  const displayPrice = (p: Project) =>
    p.quoted_price != null ? p.quoted_price : p.total_price;

  const isQuoted = (p: Project) => p.quoted_price != null && p.quoted_price > 0;

  // Analytics computed from allProjects + payments
  const totalRevenue = paymentsList
    .filter((p) => p.status === 'paid')
    .reduce((s, p) => s + (p.amount || 0), 0);
  const statusCounts = ['pending', 'in_progress', 'ready_for_defense', 'completed'].map((s) => ({
    status: s,
    count: allProjects.filter((p) => p.status === s).length,
  }));
  const studentProjects = allProjects.filter((p) => p.category !== 'business');
  const businessProjects = allProjects.filter((p) => p.category === 'business');
  const awaitingQuotes = allProjects.filter((p) => !isQuoted(p) && p.status === 'pending').length;
  const maxStatus = Math.max(1, ...statusCounts.map((s) => s.count));

  return (
    <div className="fixed inset-0 z-50 bg-neutral-200 text-neutral-900 flex overflow-hidden animate-in fade-in duration-150">
      {/* ============ SIDEBAR (enlarged) ============ */}
      <aside className="w-80 shrink-0 bg-neutral-900 text-neutral-100 flex flex-col">
        {/* Brand */}
        <div className="h-24 flex items-center gap-3 px-6 border-b border-neutral-800">
          <div className="w-12 h-12 rounded-xl bg-neutral-800 border border-neutral-700 flex items-center justify-center">
            <ShieldAlert className="w-6 h-6 text-amber-400" />
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-base font-bold text-white tracking-wider uppercase">
              Admin Console
            </span>
            <span className="font-mono text-[11px] text-amber-400">Lead architect</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-grow p-4 flex flex-col gap-2 overflow-y-auto">
          {/* Analytics */}
          {TOP_NAV.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`flex items-center gap-3 px-4 py-4 rounded-xl text-base font-mono font-semibold transition-all cursor-pointer ${
                activeTab === item.key
                  ? 'bg-white text-neutral-900 shadow'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}

          {/* Projects dropdown */}
          <div>
            <button
              onClick={() => setProjectsOpen((o) => !o)}
              className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl text-base font-mono font-semibold transition-all cursor-pointer ${
                activeTab === 'projects'
                  ? 'bg-white text-neutral-900 shadow'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              <FolderKanban className="w-6 h-6" />
              <span>Projects</span>
              <span className="ml-auto text-xs opacity-70 bg-black/30 px-2 py-0.5 rounded-full">
                {projects.length}
              </span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${projectsOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Dropdown sub-items */}
            {projectsOpen && (
              <div className="mt-1 ml-4 pl-4 border-l border-neutral-700 flex flex-col gap-1">
                <button
                  onClick={() => {
                    setActiveTab('projects');
                    setCategoryMode('student');
                  }}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                    activeTab === 'projects' && categoryMode === 'student'
                      ? 'bg-purple-600 text-white'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Student Projects</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('projects');
                    setCategoryMode('business');
                  }}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                    activeTab === 'projects' && categoryMode === 'business'
                      ? 'bg-blue-600 text-white'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Business Commissions</span>
                </button>
              </div>
            )}
          </div>

          {/* Clients + Payments */}
          {BOTTOM_NAV.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`flex items-center gap-3 px-4 py-4 rounded-xl text-base font-mono font-semibold transition-all cursor-pointer ${
                activeTab === item.key
                  ? 'bg-white text-neutral-900 shadow'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User footer */}
        <div className="p-4 border-t border-neutral-800 flex items-center justify-between gap-2">
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold text-white truncate">{user.name}</span>
            <span className="text-[10px] text-neutral-400 truncate font-mono">Administrator</span>
          </div>
          <button
            onClick={onLogout}
            title="Sign out"
            className="p-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white border border-neutral-700 transition-colors cursor-pointer shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* ============ MAIN (grey background) ============ */}
      <div className="flex-grow flex flex-col overflow-y-auto bg-neutral-200">
        <header className="h-20 border-b border-neutral-300 bg-neutral-100 px-8 flex items-center justify-between sticky top-0 z-20">
          <button
            onClick={onClose}
            className="font-mono text-sm text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
          >
            ← Public Studio
          </button>
          <button
            onClick={loadData}
            className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-700 text-white rounded-lg text-sm font-mono transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </header>

        <main className="max-w-7xl mx-auto w-full px-8 py-8 flex-grow">
          {/* ===== ANALYTICS ===== */}
          {activeTab === 'analytics' && (
            <div className="flex flex-col gap-6">
              {/* Metric cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 bg-white border border-neutral-200 rounded-2xl shadow-sm">
                  <div className="flex items-center justify-between text-neutral-500">
                    <span className="text-xs font-semibold uppercase tracking-wide">Projects</span>
                    <Layers className="w-5 h-5 text-neutral-400" />
                  </div>
                  <div className="mt-3 text-3xl font-bold text-neutral-900">
                    {stats.total_projects ?? allProjects.length}
                  </div>
                  <div className="text-xs text-neutral-500 mt-1">
                    {studentProjects.length} student · {businessProjects.length} business
                  </div>
                </div>

                <div className="p-5 bg-white border border-neutral-200 rounded-2xl shadow-sm">
                  <div className="flex items-center justify-between text-neutral-500">
                    <span className="text-xs font-semibold uppercase tracking-wide">In Progress</span>
                    <Clock className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="mt-3 text-3xl font-bold text-blue-600">
                    {stats.in_progress_projects ??
                      allProjects.filter((p) => p.status === 'in_progress').length}
                  </div>
                  <div className="text-xs text-neutral-500 mt-1">Active builds</div>
                </div>

                <div className="p-5 bg-white border border-neutral-200 rounded-2xl shadow-sm">
                  <div className="flex items-center justify-between text-neutral-500">
                    <span className="text-xs font-semibold uppercase tracking-wide">Clients</span>
                    <Users className="w-5 h-5 text-purple-500" />
                  </div>
                  <div className="mt-3 text-3xl font-bold text-purple-600">
                    {(stats.total_students || 0) + (stats.total_businesses || 0)}
                  </div>
                  <div className="text-xs text-neutral-500 mt-1">
                    {stats.total_students || 0} students · {stats.total_businesses || 0} business
                  </div>
                </div>

                <div className="p-5 bg-white border border-neutral-200 rounded-2xl shadow-sm">
                  <div className="flex items-center justify-between text-neutral-500">
                    <span className="text-xs font-semibold uppercase tracking-wide">Revenue</span>
                    <TrendingUp className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div className="mt-3 text-3xl font-bold text-emerald-600">
                    ₱{(totalRevenue || stats.total_revenue || 0).toLocaleString()}
                  </div>
                  <div className="text-xs text-neutral-500 mt-1">{paymentsList.length} transactions</div>
                </div>
              </div>

              {/* Charts row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Status distribution */}
                <div className="p-6 bg-white border border-neutral-200 rounded-2xl shadow-sm">
                  <h3 className="text-sm font-bold text-neutral-900 mb-5 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-neutral-500" />
                    Projects by Status
                  </h3>
                  <div className="space-y-4">
                    {statusCounts.map((s) => (
                      <div key={s.status}>
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="text-neutral-600 capitalize font-medium">
                            {s.status.replace(/_/g, ' ')}
                          </span>
                          <span className="text-neutral-900 font-bold">{s.count}</span>
                        </div>
                        <div className="w-full bg-neutral-100 h-2.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              s.status === 'completed'
                                ? 'bg-emerald-500'
                                : s.status === 'in_progress'
                                ? 'bg-blue-500'
                                : s.status === 'ready_for_defense'
                                ? 'bg-purple-500'
                                : 'bg-amber-500'
                            }`}
                            style={{ width: `${(s.count / maxStatus) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Category split + awaiting quotes */}
                <div className="flex flex-col gap-4">
                  <div className="p-6 bg-white border border-neutral-200 rounded-2xl shadow-sm flex-grow">
                    <h3 className="text-sm font-bold text-neutral-900 mb-5 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-neutral-500" />
                      Intake Split
                    </h3>
                    <div className="flex items-center gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <GraduationCap className="w-4 h-4 text-purple-500" />
                          <span className="text-xs text-neutral-600">Students</span>
                        </div>
                        <div className="text-2xl font-bold text-neutral-900">
                          {studentProjects.length}
                        </div>
                      </div>
                      <div className="w-px h-12 bg-neutral-200" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Building2 className="w-4 h-4 text-blue-500" />
                          <span className="text-xs text-neutral-600">Business</span>
                        </div>
                        <div className="text-2xl font-bold text-neutral-900">
                          {businessProjects.length}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 w-full bg-neutral-100 h-2.5 rounded-full overflow-hidden flex">
                      <div
                        className="bg-purple-500 h-full"
                        style={{
                          width: `${
                            allProjects.length
                              ? (studentProjects.length / allProjects.length) * 100
                              : 0
                          }%`,
                        }}
                      />
                      <div
                        className="bg-blue-500 h-full"
                        style={{
                          width: `${
                            allProjects.length
                              ? (businessProjects.length / allProjects.length) * 100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="p-6 bg-amber-50 border border-amber-200 rounded-2xl shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold text-amber-700 uppercase tracking-wide">
                          Awaiting Quotes
                        </span>
                        <div className="text-3xl font-bold text-amber-700 mt-1">
                          {awaitingQuotes}
                        </div>
                      </div>
                      <Wallet className="w-8 h-8 text-amber-400" />
                    </div>
                    <p className="text-xs text-amber-600 mt-2">
                      Projects waiting for you to set a deal price.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===== PROJECTS ===== */}
          {activeTab === 'projects' && (
            <div className="flex flex-col gap-4">
              {/* Category label + search + status */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white border border-neutral-200 rounded-2xl shadow-sm">
                {/* Current category indicator */}
                <div
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
                    categoryMode === 'student'
                      ? 'bg-purple-100 text-purple-700 border border-purple-200'
                      : 'bg-blue-100 text-blue-700 border border-blue-200'
                  }`}
                >
                  {categoryMode === 'student' ? (
                    <>
                      <GraduationCap className="w-4 h-4" />
                      <span>Student Projects</span>
                    </>
                  ) : (
                    <>
                      <Building2 className="w-4 h-4" />
                      <span>Business Commissions</span>
                    </>
                  )}
                </div>

                {/* Search */}
                <div className="flex items-center gap-2 flex-grow max-w-md bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2">
                  <Search className="w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by title, client, or email..."
                    className="w-full bg-transparent text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none"
                  />
                </div>

                {/* Status filters */}
                <div className="flex items-center gap-1.5 text-xs overflow-x-auto">
                  {['all', 'pending', 'in_progress', 'ready_for_defense', 'completed'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`px-3 py-1.5 rounded-md capitalize transition-colors cursor-pointer ${
                        statusFilter === status
                          ? 'bg-neutral-900 text-white font-bold shadow'
                          : 'bg-neutral-100 text-neutral-500 hover:text-neutral-900 border border-neutral-200'
                      }`}
                    >
                      {status.replace(/_/g, ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Split */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* List */}
                <div className="lg:col-span-5 flex flex-col gap-3">
                  <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                    {categoryMode === 'student' ? 'Student projects' : 'Business commissions'} (
                    {projects.length})
                  </span>

                  {loading ? (
                    <div className="p-8 bg-white border border-neutral-200 rounded-2xl text-center text-sm text-neutral-500">
                      <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-neutral-700" />
                      <span>Loading...</span>
                    </div>
                  ) : projects.length === 0 ? (
                    <div className="p-8 bg-white border border-neutral-200 rounded-2xl text-center text-sm text-neutral-500">
                      No {categoryMode} projects found.
                    </div>
                  ) : (
                    projects.map((proj) => {
                      const isSelected = selectedProject?.id === proj.id;
                      const isBusiness = proj.category === 'business';
                      return (
                        <div
                          key={proj.id}
                          onClick={() => handleSelectProject(proj)}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2.5 bg-white ${
                            isSelected
                              ? 'border-neutral-900 shadow-md'
                              : 'border-neutral-200 hover:border-neutral-400'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded border uppercase font-semibold ${
                                isBusiness
                                  ? 'bg-blue-100 text-blue-700 border-blue-300'
                                  : 'bg-purple-100 text-purple-700 border-purple-300'
                              }`}
                            >
                              {proj.category || 'capstone'}
                            </span>
                            <span
                              className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded ${statusColor(
                                proj.status
                              )}`}
                            >
                              {proj.status.replace(/_/g, ' ')}
                            </span>
                          </div>

                          <h4 className="text-sm font-semibold text-neutral-900 line-clamp-2">
                            {proj.thesis_title}
                          </h4>

                          <div className="flex items-center gap-2 text-xs text-neutral-500">
                            <span>👤 {proj.user?.name || 'Client'}</span>
                            <span>•</span>
                            {isQuoted(proj) ? (
                              <span>₱{displayPrice(proj).toLocaleString()}</span>
                            ) : (
                              <em className="text-amber-600 not-italic">Awaiting quote</em>
                            )}
                          </div>

                          <div>
                            <div className="flex justify-between text-[10px] mb-1 text-neutral-500">
                              <span>Progress</span>
                              <span className="text-neutral-900 font-semibold">{proj.progress}%</span>
                            </div>
                            <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
                              <div
                                className="bg-neutral-900 h-full transition-all duration-300"
                                style={{ width: `${proj.progress}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}

                  {/* Project pagination */}
                  {projectLastPage > 1 && (
                    <div className="flex items-center justify-between pt-2">
                      <button
                        onClick={() => setProjectPage((p) => Math.max(1, p - 1))}
                        disabled={projectPage <= 1}
                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-neutral-200 rounded-lg text-xs font-semibold text-neutral-600 hover:text-neutral-900 disabled:opacity-40 cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Prev</span>
                      </button>
                      <span className="text-xs text-neutral-500 font-mono">
                        Page {projectPage} of {projectLastPage}
                      </span>
                      <button
                        onClick={() => setProjectPage((p) => Math.min(projectLastPage, p + 1))}
                        disabled={projectPage >= projectLastPage}
                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-neutral-200 rounded-lg text-xs font-semibold text-neutral-600 hover:text-neutral-900 disabled:opacity-40 cursor-pointer"
                      >
                        <span>Next</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Detail cockpit */}
                <div className="lg:col-span-7 flex flex-col gap-5">
                  {selectedProject ? (
                    <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 flex flex-col gap-6 shadow-sm">
                      <div>
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <span className="text-xs text-amber-600 uppercase tracking-wide font-semibold flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                            <span>SPEC // GST-{selectedProject.id}</span>
                          </span>
                          <span className="text-xs text-neutral-500">
                            Client #{selectedProject.user_id}
                          </span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight leading-snug">
                          {selectedProject.thesis_title}
                        </h3>
                        <p className="text-sm text-neutral-600 mt-2 leading-relaxed">
                          {selectedProject.description}
                        </p>
                      </div>

                      {/* Client info */}
                      <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl text-sm space-y-2">
                        <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                          <span className="text-neutral-500">CLIENT</span>
                          <span className="text-neutral-900 font-semibold">
                            {selectedProject.user?.name || 'Unknown'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                          <span className="text-neutral-500">EMAIL</span>
                          <span className="text-neutral-900">{selectedProject.user?.email || 'N/A'}</span>
                        </div>
                        {selectedProject.category === 'business' && (
                          <>
                            <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                              <span className="text-neutral-500">COMPANY</span>
                              <span className="text-blue-600">
                                {selectedProject.company_name || 'N/A'}
                              </span>
                            </div>
                            <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                              <span className="text-neutral-500">UI STYLE</span>
                              <span className="text-neutral-700">{selectedProject.ui_style || 'N/A'}</span>
                            </div>
                          </>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-neutral-500">DEAL PRICE</span>
                          <span className="text-emerald-600 font-bold">
                            {isQuoted(selectedProject)
                              ? `₱${displayPrice(selectedProject).toLocaleString()} PHP`
                              : 'Not quoted yet'}
                          </span>
                        </div>
                      </div>

                      {/* Quote setter (all projects) */}
                      <form
                        onSubmit={handleSetQuote}
                        className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex flex-col gap-3"
                      >
                        <span className="text-xs font-semibold text-neutral-900 uppercase tracking-wide flex items-center gap-2">
                          <Wallet className="w-4 h-4 text-emerald-600" />
                          <span>Set deal price (unlocks client payment)</span>
                        </span>
                        <div className="flex items-center gap-3">
                          <div className="relative flex-grow">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">
                              ₱
                            </span>
                            <input
                              type="number"
                              min="1"
                              value={quoteInput}
                              onChange={(e) => setQuoteInput(e.target.value)}
                              placeholder="e.g. 24000"
                              className="w-full bg-white border border-neutral-300 pl-7 pr-3 py-2 rounded-lg text-neutral-900 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                            />
                          </div>
                          <button
                            type="submit"
                            disabled={savingQuote || !quoteInput}
                            className="inline-flex items-center gap-2 py-2 px-4 bg-emerald-600 text-white hover:bg-emerald-700 font-semibold text-sm rounded-lg transition-all cursor-pointer disabled:opacity-50"
                          >
                            <Save className="w-4 h-4" />
                            <span>{savingQuote ? 'Saving...' : 'Send Quote'}</span>
                          </button>
                        </div>
                      </form>

                      {/* Status actions */}
                      <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl flex flex-col gap-2.5">
                        <span className="text-xs font-semibold text-neutral-900 uppercase tracking-wide">
                          Update status
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                          {(['pending', 'in_progress', 'ready_for_defense', 'completed'] as const).map(
                            (st) => (
                              <button
                                key={st}
                                onClick={() => handleUpdateStatus(st)}
                                className={`p-2 rounded-lg border text-center transition-colors cursor-pointer capitalize font-medium ${
                                  selectedProject.status === st
                                    ? st === 'completed'
                                      ? 'bg-emerald-600 text-white border-emerald-600'
                                      : st === 'in_progress'
                                      ? 'bg-blue-600 text-white border-blue-600'
                                      : st === 'ready_for_defense'
                                      ? 'bg-purple-600 text-white border-purple-600'
                                      : 'bg-amber-500 text-white border-amber-500'
                                    : 'bg-white text-neutral-500 border-neutral-200 hover:text-neutral-900'
                                }`}
                              >
                                {st.replace(/_/g, ' ')}
                              </button>
                            )
                          )}
                        </div>
                      </div>

                      {/* Milestones */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-xs font-semibold text-neutral-900 uppercase tracking-wide flex items-center gap-2">
                            <Layers className="w-4 h-4 text-neutral-500" />
                            <span>Milestones</span>
                          </h4>
                          <span className="text-xs text-emerald-600 font-semibold">
                            {selectedProject.progress}%
                          </span>
                        </div>
                        <div className="space-y-2.5">
                          {selectedProject.milestones?.map((milestone) => (
                            <div
                              key={milestone.id}
                              className={`p-3.5 rounded-xl border transition-all flex items-start gap-3.5 ${
                                milestone.is_completed
                                  ? 'bg-emerald-50 border-emerald-200'
                                  : 'bg-neutral-50 border-neutral-200'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={milestone.is_completed}
                                onChange={() =>
                                  handleToggleMilestone(milestone.id, milestone.is_completed)
                                }
                                className="mt-1 w-4 h-4 rounded border-neutral-300 text-emerald-600 focus:ring-0 cursor-pointer"
                              />
                              <div className="flex-grow">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-sm font-semibold text-neutral-900">
                                    Step {milestone.order}: {milestone.title}
                                  </span>
                                  {milestone.is_completed ? (
                                    <span className="text-[10px] text-emerald-700 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded flex items-center gap-1 font-semibold">
                                      <CheckCircle2 className="w-3 h-3" />
                                      <span>Done</span>
                                    </span>
                                  ) : (
                                    <span className="text-[10px] text-neutral-500 bg-white border border-neutral-200 px-2 py-0.5 rounded">
                                      Pending
                                    </span>
                                  )}
                                </div>
                                {milestone.description && (
                                  <p className="text-xs text-neutral-500 mt-1 leading-normal">
                                    {milestone.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Links */}
                      <form
                        onSubmit={handleSaveLinks}
                        className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl flex flex-col gap-3.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-neutral-900 uppercase tracking-wide flex items-center gap-2">
                            <Globe className="w-4 h-4 text-neutral-500" />
                            <span>Publish staging &amp; repo URLs</span>
                          </span>
                          {linksSavedFeedback && (
                            <span className="text-xs text-emerald-600 font-semibold">✓ Saved!</span>
                          )}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                          <div>
                            <label className="block text-xs text-neutral-500 mb-1">
                              Live Deployment URL
                            </label>
                            <input
                              type="url"
                              value={stagingUrl}
                              onChange={(e) => setStagingUrl(e.target.value)}
                              placeholder="https://demo-app.guesstures.app"
                              className="w-full bg-white border border-neutral-300 px-3 py-2 rounded-lg text-neutral-900 text-sm placeholder-neutral-400 focus:outline-none focus:border-neutral-900 transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-neutral-500 mb-1">
                              GitHub Repository
                            </label>
                            <input
                              type="url"
                              value={repoUrl}
                              onChange={(e) => setRepoUrl(e.target.value)}
                              placeholder="https://github.com/guesstures-lab/project"
                              className="w-full bg-white border border-neutral-300 px-3 py-2 rounded-lg text-neutral-900 text-sm placeholder-neutral-400 focus:outline-none focus:border-neutral-900 transition-colors"
                            />
                          </div>
                        </div>
                        <button
                          type="submit"
                          disabled={savingLinks}
                          className="inline-flex items-center justify-center gap-2 py-2 px-4 bg-neutral-900 text-white hover:bg-neutral-700 font-semibold text-sm rounded-lg transition-all shadow cursor-pointer disabled:opacity-50 self-end"
                        >
                          <Save className="w-4 h-4" />
                          <span>{savingLinks ? 'Saving...' : 'Save & Publish'}</span>
                        </button>
                      </form>
                    </div>
                  ) : (
                    <div className="p-12 bg-white border border-neutral-200 rounded-2xl text-center text-sm text-neutral-500">
                      Select a project to begin processing.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ===== USERS ===== */}
          {activeTab === 'users' && (
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 shadow-sm">
              <h3 className="text-xl font-bold text-neutral-900 tracking-tight mb-2">
                Clients Directory
              </h3>
              <p className="text-sm text-neutral-500 leading-relaxed mb-6">
                Verified student and business accounts.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-neutral-200 text-neutral-500">
                      <th className="pb-3 font-semibold">ID</th>
                      <th className="pb-3 font-semibold">Name</th>
                      <th className="pb-3 font-semibold">Email</th>
                      <th className="pb-3 font-semibold">Role</th>
                      <th className="pb-3 font-semibold">Institution / Company</th>
                      <th className="pb-3 font-semibold">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {usersList.map((u) => (
                      <tr key={u.id} className="text-neutral-700 hover:bg-neutral-50">
                        <td className="py-3 font-bold text-neutral-900">#{u.id}</td>
                        <td className="py-3 text-neutral-900 font-semibold">{u.name}</td>
                        <td className="py-3 text-neutral-500">{u.email}</td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                              u.role === 'student'
                                ? 'bg-purple-100 text-purple-700 border border-purple-300'
                                : u.role === 'business'
                                ? 'bg-blue-100 text-blue-700 border border-blue-300'
                                : 'bg-amber-100 text-amber-700 border border-amber-300'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3 text-neutral-600">{u.school_or_company || 'N/A'}</td>
                        <td className="py-3 text-neutral-500 text-xs">
                          {u.created_at ? new Date(u.created_at).toLocaleDateString() : 'Active'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Users pagination */}
              {userLastPage > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-neutral-200">
                  <button
                    onClick={() => setUserPage((p) => Math.max(1, p - 1))}
                    disabled={userPage <= 1}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-semibold text-neutral-600 hover:text-neutral-900 disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Prev</span>
                  </button>
                  <span className="text-xs text-neutral-500 font-mono">
                    Page {userPage} of {userLastPage}
                  </span>
                  <button
                    onClick={() => setUserPage((p) => Math.min(userLastPage, p + 1))}
                    disabled={userPage >= userLastPage}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-semibold text-neutral-600 hover:text-neutral-900 disabled:opacity-40 cursor-pointer"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ===== PAYMENTS ===== */}
          {activeTab === 'payments' && (
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 shadow-sm">
              <h3 className="text-xl font-bold text-neutral-900 tracking-tight mb-2">
                Payment Transactions
              </h3>
              <p className="text-sm text-neutral-500 leading-relaxed mb-6">
                Settlements via GCash, GrabPay, and bank transfer.
              </p>
              <div className="space-y-3 text-sm">
                {paymentsList.length === 0 ? (
                  <div className="p-8 text-center text-neutral-500">No transactions yet.</div>
                ) : (
                  paymentsList.map((p) => (
                    <div
                      key={p.id}
                      className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl flex flex-wrap items-center justify-between gap-3"
                    >
                      <div>
                        <span className="text-neutral-900 font-bold block">
                          TXN #{p.id} // Project #{p.project_id}
                        </span>
                        <span className="text-neutral-500 text-xs">{p.description}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-neutral-900 font-bold block">
                          ₱{p.amount.toLocaleString()} PHP
                        </span>
                        <span className="text-emerald-600 text-[10px] uppercase font-semibold">
                          ✓ {p.payment_method.toUpperCase()} - {p.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Payments pagination */}
              {paymentLastPage > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-neutral-200">
                  <button
                    onClick={() => setPaymentPage((p) => Math.max(1, p - 1))}
                    disabled={paymentPage <= 1}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-semibold text-neutral-600 hover:text-neutral-900 disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Prev</span>
                  </button>
                  <span className="text-xs text-neutral-500 font-mono">
                    Page {paymentPage} of {paymentLastPage}
                  </span>
                  <button
                    onClick={() => setPaymentPage((p) => Math.min(paymentLastPage, p + 1))}
                    disabled={paymentPage >= paymentLastPage}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-semibold text-neutral-600 hover:text-neutral-900 disabled:opacity-40 cursor-pointer"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* ===== SUCCESS / ERROR MODAL ===== */}
      {modal && (
        <div
          className="fixed inset-0 z-[70] bg-black/50 flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setModal(null)}
        >
          <div
            className="bg-white border border-neutral-200 rounded-2xl p-8 max-w-md w-full shadow-xl text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`w-14 h-14 rounded-full mx-auto flex items-center justify-center mb-4 ${
                modal.type === 'success'
                  ? 'bg-emerald-100 border border-emerald-200'
                  : 'bg-red-100 border border-red-200'
              }`}
            >
              {modal.type === 'success' ? (
                <CheckCircle2 className="w-7 h-7 text-emerald-600" />
              ) : (
                <span className="text-red-600 text-2xl font-bold">!</span>
              )}
            </div>
            <h3 className="text-lg font-bold text-neutral-900 mb-2">{modal.title}</h3>
            <p className="text-sm text-neutral-500 leading-relaxed mb-6">{modal.message}</p>
            <button
              onClick={() => setModal(null)}
              className={`w-full py-2.5 font-semibold text-sm rounded-lg transition-all cursor-pointer ${
                modal.type === 'success'
                  ? 'bg-neutral-900 text-white hover:bg-neutral-700'
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              {modal.type === 'success' ? 'Done' : 'Close'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
