import React, { useState, useEffect, useMemo } from 'react';
import { User, Project, UI_STYLES } from '../../types';
import { api } from '../../services/api';
import {
  Building2,
  PlusCircle,
  CheckCircle2,
  Layers,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  RefreshCw,
  LogOut,
  FolderGit2,
  Wallet,
  LayoutDashboard,
  FileText,
  Palette,
  CreditCard,
  AlertCircle,
} from 'lucide-react';

interface BusinessDashboardProps {
  user: User;
  onLogout: () => void;
  onClose: () => void;
}

type NavKey = 'overview' | 'new_commission';

const NAV_ITEMS: { key: NavKey; label: string; icon: React.ReactNode }[] = [
  { key: 'overview', label: 'My Commissions', icon: <LayoutDashboard className="w-5 h-5" /> },
  { key: 'new_commission', label: 'New Commission', icon: <PlusCircle className="w-5 h-5" /> },
];

const WIZARD_STEPS = ['UI Style', 'Project', 'Details', 'Review'] as const;

export const BusinessDashboard: React.FC<BusinessDashboardProps> = ({
  user,
  onLogout,
  onClose,
}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeTab, setActiveTab] = useState<NavKey>('overview');
  const [loading, setLoading] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState<string | number | null>(null);

  // Wizard state
  const [step, setStep] = useState(0);
  const [uiStyle, setUiStyle] = useState<string>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [companyName, setCompanyName] = useState(user.school_or_company || '');
  const [submitting, setSubmitting] = useState(false);

  // Modal State
  const [modal, setModal] = useState<{
    type: 'success' | 'error';
    title: string;
    message: string;
  } | null>(null);

  const selectedProject = useMemo(
    () => projects.find((p) => p.id === selectedProjectId) || projects[0] || null,
    [projects, selectedProjectId]
  );

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await api.projects.getAll();
      setProjects(data);
      if (data.length > 0 && !selectedProjectId) {
        setSelectedProjectId(data[0].id);
      }
    } catch (err) {
      console.error('Failed to load business projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const resetWizard = () => {
    setStep(0);
    setUiStyle('');
    setTitle('');
    setDescription('');
    setCompanyName(user.school_or_company || '');
  };

  const canNext = () => {
    if (step === 0) return !!uiStyle;
    if (step === 1) return !!title.trim();
    if (step === 2) return description.trim().length >= 20 && !!companyName.trim();
    return true;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const created = await api.projects.createBusiness({
        ui_style: uiStyle,
        title,
        description,
        company_name: companyName,
      });
      setProjects((prev) => [created, ...prev]);
      setSelectedProjectId(created.id);
      resetWizard();
      setModal({
        type: 'success',
        title: 'Commission Submitted',
        message:
          'Your project brief has been received. Our team will review the scope and send you a price quote shortly.',
      });
      setActiveTab('overview');
    } catch (err: any) {
      setModal({
        type: 'error',
        title: 'Submission Failed',
        message: err.message || 'Failed to submit commission. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handlePayment = async (projectId: string | number) => {
    try {
      await api.payments.createGcashPayment(projectId, {
        name: user.name,
        email: user.email,
      });
      await loadProjects();
      setModal({
        type: 'success',
        title: 'Payment Successful',
        message: 'Your payment has been confirmed and your project build has been queued.',
      });
    } catch (err: any) {
      setModal({
        type: 'error',
        title: 'Payment Failed',
        message: err.message || 'Payment failed. Please try again.',
      });
    }
  };

  const statusColor = (status: string) =>
    status === 'completed'
      ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
      : status === 'in_progress'
      ? 'bg-blue-100 text-blue-700 border border-blue-300'
      : 'bg-amber-100 text-amber-700 border border-amber-300';

  const priceFor = (p: Project) => (p.quoted_price ?? p.total_price) || 0;

  return (
    <div className="fixed inset-0 z-50 bg-white text-neutral-800 flex overflow-hidden animate-in fade-in duration-150">
      {/* Sidebar */}
      <aside className="w-72 shrink-0 bg-neutral-50 border-r border-neutral-200 flex flex-col">
        <div className="h-20 flex items-center gap-3 px-6 border-b border-neutral-200">
          <div className="w-10 h-10 rounded-xl bg-white border border-neutral-200 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-neutral-700" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-base text-neutral-900 tracking-tight">
              Business Portal
            </span>
            <span className="text-[11px] text-neutral-500">Enterprise commissions</span>
          </div>
        </div>

        <nav className="flex-grow p-4 flex flex-col gap-2">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeTab === item.key
                  ? 'bg-neutral-900 text-white shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.key === 'overview' && (
                <span className="ml-auto text-xs opacity-60 bg-neutral-200 px-2 py-0.5 rounded-full">
                  {projects.length}
                </span>
              )}
            </button>
          ))}
        </nav>

        {selectedProject && (
          <div className="p-5 border-t border-neutral-200">
            <div className="flex justify-between text-[11px] mb-2 text-neutral-500">
              <span>Active build</span>
              <span className="text-neutral-900 font-semibold">{selectedProject.progress}%</span>
            </div>
            <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-neutral-900 h-full transition-all duration-300"
                style={{ width: `${selectedProject.progress}%` }}
              />
            </div>
            <p className="mt-2.5 text-[11px] text-neutral-500 line-clamp-1">
              {selectedProject.thesis_title}
            </p>
          </div>
        )}

        <div className="p-4 border-t border-neutral-200 flex items-center justify-between gap-2">
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold text-neutral-900 truncate">{user.name}</span>
            <span className="text-[10px] text-neutral-500 truncate">
              {user.school_or_company || 'Business'}
            </span>
          </div>
          <button
            onClick={onLogout}
            title="Sign out"
            className="p-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-500 hover:text-neutral-900 border border-neutral-200 transition-colors cursor-pointer shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Workspace */}
      <div className="flex-grow flex flex-col overflow-y-auto bg-white">
        <header className="h-20 border-b border-neutral-200 bg-white px-8 flex items-center justify-between sticky top-0 z-20">
          <button
            onClick={onClose}
            className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
          >
            ← Back to Studio
          </button>
          <div className="text-sm text-neutral-500 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>Account manager online</span>
          </div>
        </header>

        <main className="max-w-6xl mx-auto w-full px-8 py-8 flex-grow">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Project List */}
              <div className="lg:col-span-5 flex flex-col gap-3">
                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                  Your commissions ({projects.length})
                </span>

                {loading ? (
                  <div className="p-8 bg-neutral-50 border border-neutral-200 rounded-xl text-center text-sm text-neutral-500">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-neutral-700" />
                    <span>Loading...</span>
                  </div>
                ) : projects.length === 0 ? (
                  <div className="p-8 bg-neutral-50 border border-neutral-200 rounded-xl text-center">
                    <Building2 className="w-8 h-8 text-neutral-400 mx-auto mb-3" />
                    <h4 className="text-neutral-900 font-semibold text-sm mb-1">
                      No commissions yet
                    </h4>
                    <p className="text-xs text-neutral-500 mb-4">
                      Submit a brief and we'll send you a tailored quote.
                    </p>
                    <button
                      onClick={() => setActiveTab('new_commission')}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-900 text-white text-xs font-semibold rounded-lg hover:bg-neutral-700"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>New Commission</span>
                    </button>
                  </div>
                ) : (
                  projects.map((proj) => {
                    const isSelected = selectedProject?.id === proj.id;
                    return (
                      <div
                        key={proj.id}
                        onClick={() => setSelectedProjectId(proj.id)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col gap-2 ${
                          isSelected
                            ? 'bg-neutral-50 border-neutral-900 shadow-md'
                            : 'bg-white border-neutral-200 hover:border-neutral-400'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-semibold px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded border border-neutral-200 uppercase">
                            {proj.ui_style || 'Commission'}
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

                        <div className="mt-1">
                          <div className="flex justify-between text-[10px] mb-1 text-neutral-500">
                            <span>Progress</span>
                            <span className="text-neutral-900 font-semibold">{proj.progress}%</span>
                          </div>
                          <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-neutral-900 h-full transition-all duration-300"
                              style={{ width: `${proj.progress}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-neutral-100 text-xs text-neutral-500">
                          <span>
                            {proj.quoted_price != null ? (
                              <>
                                Quote:{' '}
                                <strong className="text-neutral-900">
                                  ₱{priceFor(proj).toLocaleString()}
                                </strong>
                              </>
                            ) : (
                              <em>Awaiting quote</em>
                            )}
                          </span>
                          <span className="text-[10px]">
                            {new Date(proj.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Project Details */}
              <div className="lg:col-span-7 flex flex-col gap-5">
                {selectedProject ? (
                  <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 flex flex-col gap-6 shadow-sm">
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <span className="text-xs text-neutral-500 uppercase tracking-wide">
                          // GST-{selectedProject.id}
                        </span>
                        <span
                          className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded ${statusColor(
                            selectedProject.status
                          )}`}
                        >
                          {selectedProject.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight leading-snug">
                        {selectedProject.thesis_title}
                      </h3>
                      <p className="text-sm text-neutral-600 mt-2 leading-relaxed">
                        {selectedProject.description}
                      </p>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-2 text-neutral-500">
                        <span>Build progress</span>
                        <span className="text-neutral-900 font-semibold">
                          {selectedProject.progress}%
                        </span>
                      </div>
                      <div className="w-full bg-neutral-200 h-2.5 rounded-full overflow-hidden border border-neutral-200">
                        <div
                          className="bg-neutral-900 h-full transition-all duration-500"
                          style={{ width: `${selectedProject.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-xs">
                      <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl">
                        <span className="text-[10px] text-neutral-500 uppercase block">Style</span>
                        <span className="text-sm font-semibold text-neutral-900">
                          {selectedProject.ui_style || '—'}
                        </span>
                      </div>
                      <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl">
                        <span className="text-[10px] text-neutral-500 uppercase block">Company</span>
                        <span className="text-sm font-semibold text-neutral-900 line-clamp-1">
                          {selectedProject.company_name || '—'}
                        </span>
                      </div>
                      <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl">
                        <span className="text-[10px] text-neutral-500 uppercase block">Quote</span>
                        <span className="text-sm font-semibold text-neutral-900">
                          {selectedProject.quoted_price != null
                            ? `₱${priceFor(selectedProject).toLocaleString()}`
                            : 'Pending'}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-semibold text-neutral-900 uppercase tracking-wide flex items-center gap-2 mb-3">
                        <Layers className="w-4 h-4 text-neutral-500" />
                        <span>Milestones</span>
                      </h4>
                      <div className="space-y-2.5">
                        {selectedProject.milestones?.map((milestone) => (
                          <div
                            key={milestone.id}
                            className={`p-3.5 rounded-xl border transition-all flex items-start gap-3.5 ${
                              milestone.is_completed
                                ? 'bg-neutral-50 border-emerald-300'
                                : 'bg-white border-neutral-200'
                            }`}
                          >
                            <div className="mt-0.5">
                              {milestone.is_completed ? (
                                <div className="w-5 h-5 rounded-full bg-emerald-100 border border-emerald-500 flex items-center justify-center">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                </div>
                              ) : (
                                <div className="w-5 h-5 rounded-full bg-neutral-100 border border-neutral-300 flex items-center justify-center">
                                  <span className="text-[10px] text-neutral-500">
                                    {milestone.order}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="flex-grow">
                              <span className="text-xs font-semibold text-neutral-900">
                                Step {milestone.order}: {milestone.title}
                              </span>
                              {milestone.description && (
                                <p className="text-[11px] text-neutral-500 mt-1 leading-normal">
                                  {milestone.description}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {(selectedProject.deployment_url || selectedProject.repository_url) && (
                      <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl flex flex-col gap-3">
                        <span className="text-xs font-semibold text-neutral-900 uppercase tracking-wide flex items-center gap-2">
                          <FolderGit2 className="w-4 h-4 text-neutral-500" />
                          <span>Deliverables</span>
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {selectedProject.deployment_url && (
                            <a
                              href={selectedProject.deployment_url}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2.5 bg-white border border-neutral-200 rounded-lg text-neutral-900 hover:border-neutral-900 transition-colors flex items-center justify-between"
                            >
                              <span className="truncate">🌐 Live Site</span>
                              <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
                            </a>
                          )}
                          {selectedProject.repository_url && (
                            <a
                              href={selectedProject.repository_url}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2.5 bg-white border border-neutral-200 rounded-lg text-neutral-900 hover:border-neutral-900 transition-colors flex items-center justify-between"
                            >
                              <span className="truncate">📦 Repository</span>
                              <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
                            </a>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-neutral-200">
                      <div className="flex items-center gap-2">
                        <Wallet className="w-4 h-4 text-neutral-500" />
                        <span className="text-xs text-neutral-600">
                          {selectedProject.quoted_price == null
                            ? 'Awaiting quote from our team'
                            : selectedProject.status === 'pending'
                            ? 'Quote ready — payment required to begin'
                            : 'Payment confirmed'}
                        </span>
                      </div>
                      {selectedProject.quoted_price != null &&
                        selectedProject.status === 'pending' && (
                          <button
                            onClick={() => handlePayment(selectedProject.id)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white font-semibold text-xs rounded-lg hover:bg-neutral-700 transition-all cursor-pointer"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>Pay ₱{priceFor(selectedProject).toLocaleString()}</span>
                          </button>
                        )}
                    </div>
                  </div>
                ) : (
                  <div className="p-12 bg-neutral-50 border border-neutral-200 rounded-2xl text-center text-sm text-neutral-500">
                    Select a commission to view details.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Wizard Tab */}
          {activeTab === 'new_commission' && (
            <div className="max-w-2xl mx-auto w-full bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 shadow-sm">
              <div className="mb-6">
                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wide block">
                  // New commission brief
                </span>
                <h3 className="text-xl font-bold text-neutral-900 tracking-tight mt-1">
                  Tell us about your project
                </h3>
                <p className="text-sm text-neutral-500 mt-1">
                  Answer a few quick questions. We'll review and send a tailored quote.
                </p>
              </div>

              {/* Stepper */}
              <div className="flex items-center gap-2 mb-8">
                {WIZARD_STEPS.map((label, i) => (
                  <React.Fragment key={label}>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold ${
                          i < step
                            ? 'bg-emerald-500 text-white'
                            : i === step
                            ? 'bg-neutral-900 text-white'
                            : 'bg-neutral-100 text-neutral-400'
                        }`}
                      >
                        {i < step ? '✓' : i + 1}
                      </div>
                      <span
                        className={`text-xs font-medium ${
                          i === step ? 'text-neutral-900' : 'text-neutral-400'
                        }`}
                      >
                        {label}
                      </span>
                    </div>
                    {i < WIZARD_STEPS.length - 1 && (
                      <div className="flex-grow h-px bg-neutral-200" />
                    )}
                  </React.Fragment>
                ))}
              </div>

              {step === 0 && (
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase mb-3">
                    <Palette className="w-3.5 h-3.5 inline mr-1.5" />
                    What UI design style do you want? *
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {UI_STYLES.map((style) => (
                      <button
                        key={style}
                        type="button"
                        onClick={() => setUiStyle(style)}
                        className={`p-3.5 rounded-xl border text-sm text-left transition-all cursor-pointer ${
                          uiStyle === style
                            ? 'bg-neutral-900 text-white border-neutral-900 shadow'
                            : 'bg-white border-neutral-200 text-neutral-700 hover:border-neutral-400'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 1 && (
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase mb-2">
                    <FileText className="w-3.5 h-3.5 inline mr-1.5" />
                    What's the project title? *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Customer Portal & Booking Platform"
                    className="w-full bg-white border border-neutral-300 px-3.5 py-3 rounded-lg text-neutral-900 text-sm placeholder-neutral-400 focus:outline-none focus:border-neutral-900 transition-colors"
                  />
                </div>
              )}

              {step === 2 && (
                <div className="flex flex-col gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase mb-2">
                      Describe what you need *
                    </label>
                    <textarea
                      rows={5}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="What should the product do? Key features, users, integrations, deadlines..."
                      className="w-full bg-white border border-neutral-300 px-3.5 py-3 rounded-lg text-neutral-900 text-sm placeholder-neutral-400 focus:outline-none focus:border-neutral-900 transition-colors resize-none"
                    />
                    <div className="flex justify-between items-center mt-1">
                      <span
                        className={`text-[10px] ${
                          description.trim().length >= 20
                            ? 'text-neutral-400'
                            : 'text-amber-600 font-medium'
                        }`}
                      >
                        {description.trim().length}/20 characters minimum
                      </span>
                      {description.trim().length > 0 && description.trim().length < 20 && (
                        <span className="text-[10px] text-amber-600 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> Minimum required
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase mb-2">
                      <Building2 className="w-3.5 h-3.5 inline mr-1.5" />
                      Company name *
                    </label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Nexus Systems Inc."
                      className="w-full bg-white border border-neutral-300 px-3.5 py-3 rounded-lg text-neutral-900 text-sm placeholder-neutral-400 focus:outline-none focus:border-neutral-900 transition-colors"
                    />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="flex flex-col gap-4">
                  <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl text-sm">
                    <div className="flex justify-between py-1.5 border-b border-neutral-100">
                      <span className="text-neutral-500">UI Style</span>
                      <span className="font-semibold text-neutral-900">{uiStyle}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-neutral-100">
                      <span className="text-neutral-500">Title</span>
                      <span className="font-semibold text-neutral-900 line-clamp-1">{title}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-neutral-100">
                      <span className="text-neutral-500">Company</span>
                      <span className="font-semibold text-neutral-900">{companyName}</span>
                    </div>
                    <div className="py-1.5">
                      <span className="text-neutral-500 block mb-1">Description</span>
                      <p className="text-neutral-700 text-xs leading-relaxed">{description}</p>
                    </div>
                  </div>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    Our team will review this brief and send a tailored price quote to your
                    dashboard. You'll be able to pay securely once the quote arrives.
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between mt-8 pt-4 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => (step === 0 ? setActiveTab('overview') : setStep(step - 1))}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{step === 0 ? 'Cancel' : 'Back'}</span>
                </button>

                {step < WIZARD_STEPS.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => canNext() && setStep(step + 1)}
                    disabled={!canNext()}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-neutral-900 text-white font-semibold text-sm rounded-lg hover:bg-neutral-700 transition-all cursor-pointer disabled:opacity-40"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-neutral-900 text-white font-semibold text-sm rounded-lg hover:bg-neutral-700 transition-all cursor-pointer disabled:opacity-40"
                  >
                    <span>{submitting ? 'Submitting...' : 'Submit Brief'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modal */}
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