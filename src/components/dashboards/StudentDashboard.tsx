import React, { useState, useEffect } from 'react';
import { User, Project, SystemType, ProjectCategory } from '../../types';
import { api } from '../../services/api';
import {
  GraduationCap,
  PlusCircle,
  CheckCircle2,
  Layers,
  ExternalLink,
  Cpu,
  RefreshCw,
  LogOut,
  FolderGit2,
  Wallet,
  BookOpen,
  HelpCircle,
  Trash2,
  FileCode,
  LayoutDashboard,
  Bot,
  FileText,
  CreditCard,
  Menu,
  X
} from 'lucide-react';

interface StudentDashboardProps {
  user: User;
  onLogout: () => void;
  onClose: () => void;
}

type NavKey = 'overview' | 'new_project' | 'defense_prep';

const NAV_ITEMS: { key: NavKey; label: string; icon: React.ReactNode }[] = [
  { key: 'overview', label: 'My Projects', icon: <LayoutDashboard className="w-5 h-5" /> },
  { key: 'new_project', label: 'New Project', icon: <PlusCircle className="w-5 h-5" /> },
  { key: 'defense_prep', label: 'Defense Guide', icon: <BookOpen className="w-5 h-5" /> },
];

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  user,
  onLogout,
  onClose,
}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeTab, setActiveTab] = useState<NavKey>('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // New Project Form State
  const [systemTypes, setSystemTypes] = useState<SystemType[]>([]);
  const [category, setCategory] = useState<ProjectCategory>('capstone');
  const [selectedSystemTypeId, setSelectedSystemTypeId] = useState<number>(0);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficultyLevel, setDifficultyLevel] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [submittingProject, setSubmittingProject] = useState(false);

  // Payment flow
  const [payingProjectId, setPayingProjectId] = useState<number | null>(null);
  const [payingLoading, setPayingLoading] = useState(false);

const loadProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.projects.getAll();
      setProjects(data);
      if (data.length > 0) {
        setSelectedProject((prev) =>
          prev ? data.find((p) => p.id === prev.id) || data[0] : data[0]
        );
      } else {
        setSelectedProject(null);
      }
    } catch (err: any) {
      console.error('Failed to load projects:', err);
      setError(err.message || 'Could not load your projects. Is the API server running?');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
    api.projects
      .getSystemTypes()
      .then((types) => {
        if (types && types.length) {
          setSystemTypes(types);
          const web = types.find((s) => s.slug === 'web_app') || types[0];
          setSelectedSystemTypeId(web.id);
        }
      })
      .catch(() => setSystemTypes([]));
  }, []);

  useEffect(() => {
    if (!systemTypes.length) return;
    if (category === 'robotics') {
      const arduino = systemTypes.find((s) => s.slug === 'arduino');
      if (arduino) setSelectedSystemTypeId(arduino.id);
    } else {
      const web = systemTypes.find((s) => s.slug === 'web_app') || systemTypes[0];
      if (web) setSelectedSystemTypeId(web.id);
    }
  }, [category, systemTypes]);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;
    setSubmittingProject(true);

    try {
      await api.projects.create({
        system_type_id: selectedSystemTypeId,
        category: category as 'capstone' | 'robotics',
        title,
        description,
        difficulty_level: difficultyLevel,
      });
      setTitle('');
      setDescription('');
      setActiveTab('overview');
      await loadProjects();
      alert('Project submitted! Our team will review the scope and send you a price quote.');
    } catch (err: any) {
      alert(err.message || 'Failed to submit project.');
    } finally {
      setSubmittingProject(false);
    }
  };

  const handlePay = async (projectId: number, method: 'gcash' | 'grabpay') => {
    setPayingLoading(true);
    try {
      const payment =
        method === 'gcash'
          ? await api.payments.createGcashPayment(projectId, { name: user.name, email: user.email })
          : await api.payments.createGrabPayPayment(projectId, { name: user.name, email: user.email });
      await loadProjects();
      setPayingProjectId(null);
      const url = (payment as any).checkout_url;
      if (url) window.open(url, '_blank');
      alert(`${method === 'gcash' ? 'GCash' : 'GrabPay'} payment initiated! Complete it in the opened tab.`);
    } catch (err: any) {
      alert(err.message || 'Payment failed.');
    } finally {
      setPayingLoading(false);
    }
  };

  const handleDeleteProject = async (id: number) => {
    if (!confirm('Remove this project?')) return;
    try {
      await api.projects.delete(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      if (selectedProject?.id === id) setSelectedProject(null);
    } catch (err: any) {
      alert(err.message || 'Failed to delete project.');
    }
  };

  const statusColor = (status: string) =>
    status === 'completed'
      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
      : status === 'in_progress'
      ? 'bg-blue-950 text-blue-300 border border-blue-800'
      : status === 'ready_for_defense'
      ? 'bg-purple-950 text-purple-300 border border-purple-800'
      : 'bg-amber-950 text-amber-300 border border-amber-800';

  const isQuoted = (p: Project) => p.quoted_price != null && p.quoted_price > 0;

  return (
    <div className="fixed inset-0 z-50 bg-[#0c0e11] text-[#e2e2e6] flex flex-col md:flex-row overflow-hidden animate-in fade-in duration-150">
      
      {/* ============ MOBILE HEADER ============ */}
      <div className="md:hidden flex items-center justify-between px-4 h-16 bg-[#111316] border-b border-[#282a2d] shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#1e2023] border border-[#333538] flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-[#bdc2ff]" />
          </div>
          <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
            Student Portal
          </span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-[#8e9195] hover:text-white rounded-lg bg-[#1e2023] border border-[#333538]"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* ============ SIDEBAR ============ */}
      <aside className={`w-full md:w-72 md:min-w-72 bg-[#111316] border-r border-[#282a2d] flex flex-col shrink-0 ${
        mobileMenuOpen ? 'block' : 'hidden md:flex'
      }`}>
        <div className="hidden md:flex h-20 items-center gap-3 px-6 border-b border-[#282a2d]">
          <div className="w-10 h-10 rounded-xl bg-[#1e2023] border border-[#333538] flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-[#bdc2ff]" />
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-sm font-bold text-white tracking-wider uppercase">
              Student Portal
            </span>
            <span className="font-mono text-[10px] text-[#8e9195]">Academic subsidy rate</span>
          </div>
        </div>

        <nav className="flex-grow p-4 flex flex-col gap-2">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              onClick={() => {
                setActiveTab(item.key);
                setMobileMenuOpen(false);
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs sm:text-sm font-mono font-semibold transition-all cursor-pointer ${
                activeTab === item.key
                  ? 'bg-white text-[#111316] shadow'
                  : 'text-[#8e9195] hover:text-white hover:bg-[#1e2023]'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.key === 'overview' && (
                <span className="ml-auto text-xs opacity-70 bg-black/20 px-2 py-0.5 rounded-full">
                  {projects.length}
                </span>
              )}
            </button>
          ))}
        </nav>

        {selectedProject && (
          <div className="hidden md:block p-5 border-t border-[#282a2d]">
            <div className="flex justify-between text-[11px] font-mono mb-2 text-[#8e9195]">
              <span>Active build</span>
              <span className="text-white font-bold">{selectedProject.progress}%</span>
            </div>
            <div className="w-full bg-[#0c0e11] h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-400 h-full transition-all duration-300"
                style={{ width: `${selectedProject.progress}%` }}
              />
            </div>
            <p className="mt-2.5 text-[11px] text-[#8e9195] line-clamp-1 font-mono">
              {selectedProject.thesis_title}
            </p>
          </div>
        )}

        <div className="p-4 border-t border-[#282a2d] flex items-center justify-between gap-2">
          <div className="flex flex-col min-w-0">
            <span className="text-xs sm:text-sm font-semibold text-white truncate">{user.name}</span>
            <span className="text-[10px] text-[#8e9195] truncate font-mono">
              {user.school_or_company || 'Student'}
            </span>
          </div>
          <button
            onClick={onLogout}
            title="Sign out"
            className="p-2 rounded-xl bg-[#1e2023] hover:bg-[#282a2d] text-[#8e9195] hover:text-white border border-[#383b40] transition-colors cursor-pointer shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* ============ MAIN CONTENT ============ */}
      <div className="min-w-0 flex-grow flex flex-col overflow-y-auto">
        <header className="h-14 sm:h-20 border-b border-[#282a2d] bg-[#111316] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20 shrink-0">
          <button
            onClick={onClose}
            className="font-mono text-xs sm:text-sm text-[#8e9195] hover:text-white transition-colors cursor-pointer"
          >
            ← Back to Studio
          </button>
          <div className="font-mono text-xs sm:text-sm text-[#8e9195] flex items-center gap-2">
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-400"></span>
            <span className="hidden sm:inline">Developer support active</span>
            <span className="sm:hidden text-[11px]">Dev Active</span>
          </div>
        </header>

        <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8 flex-grow">
          {error && (
            <div className="mb-6 p-4 bg-red-950/40 border border-red-800/60 rounded-xl text-xs sm:text-sm text-red-300 font-mono">
              {error}
            </div>
          )}

          {/* OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-5 flex flex-col gap-3">
                <span className="font-mono text-xs text-[#8e9195] uppercase">
                  Your projects ({projects.length})
                </span>

                {loading ? (
                  <div className="p-8 bg-[#16181c] border border-[#333538] rounded-xl text-center text-sm text-[#8e9195]">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-white" />
                    <span>Loading...</span>
                  </div>
                ) : projects.length === 0 ? (
                  <div className="p-8 sm:p-10 bg-[#16181c] border border-[#333538] rounded-xl text-center">
                    <GraduationCap className="w-8 h-8 sm:w-10 sm:h-10 text-[#8e9195] mx-auto mb-3" />
                    <h4 className="text-white font-semibold text-sm mb-1">No projects yet</h4>
                    <p className="text-xs text-[#8e9195] mb-5">
                      Submit a capstone or robotics build and we'll send a quote.
                    </p>
                    <button
                      onClick={() => setActiveTab('new_project')}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-[#111316] text-xs sm:text-sm font-bold rounded-lg hover:bg-[#e4e7eb]"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>New Project</span>
                    </button>
                  </div>
                ) : (
                  projects.map((proj) => {
                    const isSelected = selectedProject?.id === proj.id;
                    return (
                      <div
                        key={proj.id}
                        onClick={() => setSelectedProject(proj)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col gap-2 ${
                          isSelected
                            ? 'bg-[#1e2023] border-white/70 shadow-lg'
                            : 'bg-[#16181c] border-[#333538] hover:border-[#8e9195]/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] px-2 py-0.5 bg-[#0c0e11] text-[#bdc2ff] rounded border border-[#383b40] uppercase">
                            {proj.category || 'capstone'}
                          </span>
                          <span
                            className={`font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded ${statusColor(
                              proj.status
                            )}`}
                          >
                            {proj.status.replace(/_/g, ' ')}
                          </span>
                        </div>

                        <h4 className="text-xs sm:text-sm font-semibold text-white line-clamp-2">
                          {proj.thesis_title}
                        </h4>

                        <div className="mt-1">
                          <div className="flex justify-between text-[10px] font-mono mb-1 text-[#8e9195]">
                            <span>Progress</span>
                            <span className="text-white font-bold">{proj.progress}%</span>
                          </div>
                          <div className="w-full bg-[#0c0e11] h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-emerald-400 h-full transition-all duration-300"
                              style={{ width: `${proj.progress}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-[#333538]/50 text-xs font-mono text-[#8e9195]">
                          {isQuoted(proj) ? (
                            <span>
                              Quote:{' '}
                              <strong className="text-emerald-400">
                                ₱{(proj.quoted_price || 0).toLocaleString()}
                              </strong>
                            </span>
                          ) : (
                            <em className="text-amber-400 not-italic">Awaiting quote</em>
                          )}
                          <span className="text-[10px]">
                            {new Date(proj.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Detail view */}
              <div className="lg:col-span-7 flex flex-col gap-5 mt-4 lg:mt-0">
                {selectedProject ? (
                  <div className="bg-[#16181c] border border-[#333538] rounded-2xl p-4 sm:p-6 md:p-8 flex flex-col gap-6">
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <span className="font-mono text-xs text-[#bdc2ff] uppercase tracking-wider">
                          // GST-{selectedProject.id}
                        </span>
                        <span
                          className={`font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded ${statusColor(
                            selectedProject.status
                          )}`}
                        >
                          {selectedProject.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white tracking-tight leading-snug">
                        {selectedProject.thesis_title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#c5c6cb] mt-2 leading-relaxed">
                        {selectedProject.description}
                      </p>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-mono mb-2 text-[#8e9195]">
                        <span>Build progress</span>
                        <span className="text-emerald-400 font-bold">
                          {selectedProject.progress}%
                        </span>
                      </div>
                      <div className="w-full bg-[#0c0e11] h-2.5 rounded-full overflow-hidden border border-[#333538]">
                        <div
                          className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-full transition-all duration-500"
                          style={{ width: `${selectedProject.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                      <div className="p-3 bg-[#0c0e11] border border-[#333538] rounded-xl">
                        <span className="text-[10px] text-[#8e9195] uppercase block">Quote</span>
                        <span className="text-sm sm:text-base font-bold text-white">
                          {isQuoted(selectedProject)
                            ? `₱${(selectedProject.quoted_price || 0).toLocaleString()}`
                            : 'Pending'}
                        </span>
                      </div>
                      <div className="p-3 bg-[#0c0e11] border border-[#333538] rounded-xl">
                        <span className="text-[10px] text-[#8e9195] uppercase block">Type</span>
                        <span className="text-sm sm:text-base font-bold text-[#bdc2ff] uppercase">
                          {selectedProject.category || 'capstone'}
                        </span>
                      </div>
                      <div className="p-3 bg-[#0c0e11] border border-[#333538] rounded-xl">
                        <span className="text-[10px] text-[#8e9195] uppercase block">Difficulty</span>
                        <span className="text-sm sm:text-base font-bold text-emerald-400 uppercase">
                          {selectedProject.difficulty_level || '—'}
                        </span>
                      </div>
                    </div>

                    {/* Deliverables Links (Live Site & Repository) */}
                    {(selectedProject.deployment_url || selectedProject.repository_url) && (
                      <div className="p-4 bg-[#0c0e11] border border-[#333538] rounded-xl flex flex-col gap-3">
                        <span className="text-xs font-semibold text-white uppercase tracking-wide flex items-center gap-2 font-mono">
                          <FolderGit2 className="w-4 h-4 text-[#bdc2ff]" />
                          <span>Deliverables</span>
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {selectedProject.deployment_url && (
                            <a
                              href={selectedProject.deployment_url}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2.5 bg-[#16181c] border border-[#333538] rounded-lg text-white hover:border-[#bdc2ff] transition-colors flex items-center justify-between group"
                            >
                              <span className="truncate flex items-center gap-1.5 font-medium">
                                🌐 Live Site
                              </span>
                              <ExternalLink className="w-3.5 h-3.5 text-[#8e9195] group-hover:text-white transition-colors" />
                            </a>
                          )}
                          {selectedProject.repository_url && (
                            <a
                              href={selectedProject.repository_url}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2.5 bg-[#16181c] border border-[#333538] rounded-lg text-white hover:border-[#bdc2ff] transition-colors flex items-center justify-between group"
                            >
                              <span className="truncate flex items-center gap-1.5 font-medium">
                                📦 Repository
                              </span>
                              <ExternalLink className="w-3.5 h-3.5 text-[#8e9195] group-hover:text-white transition-colors" />
                            </a>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Milestones */}
                    <div>
                      <h4 className="font-mono text-xs text-white uppercase tracking-wider flex items-center gap-2 mb-3">
                        <Layers className="w-4 h-4 text-[#bdc2ff]" />
                        <span>Milestones</span>
                      </h4>
                      <div className="space-y-2.5">
                        {selectedProject.milestones?.map((milestone) => (
                          <div
                            key={milestone.id}
                            className={`p-3 rounded-xl border transition-all flex items-start gap-3 ${
                              milestone.is_completed
                                ? 'bg-[#111316] border-emerald-900/50 text-white'
                                : 'bg-[#0c0e11] border-[#333538] text-[#c5c6cb]'
                            }`}
                          >
                            <div className="mt-0.5">
                              {milestone.is_completed ? (
                                <div className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                </div>
                              ) : (
                                <div className="w-4 h-4 rounded-full bg-[#1e2023] border border-[#44474a] flex items-center justify-center">
                                  <span className="font-mono text-[9px] text-[#8e9195]">
                                    {milestone.order}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="flex-grow">
                              <span className="text-xs font-semibold text-white">
                                Step {milestone.order}: {milestone.title}
                              </span>
                              {milestone.description && (
                                <p className="text-[11px] text-[#8e9195] mt-0.5 leading-normal">
                                  {milestone.description}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#333538]">
                      <div className="flex items-center gap-2">
                        <Wallet className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-mono text-[#c5c6cb]">
                          {!isQuoted(selectedProject)
                            ? 'Awaiting price quote'
                            : selectedProject.status === 'pending'
                            ? 'Quote ready — payment required'
                            : 'Payment confirmed'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {isQuoted(selectedProject) && selectedProject.status === 'pending' && (
                          <button
                            onClick={() => setPayingProjectId(selectedProject.id)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white text-[#111316] font-semibold text-xs rounded-lg hover:bg-[#e4e7eb] transition-all cursor-pointer"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>Pay ₱{(selectedProject.quoted_price || 0).toLocaleString()}</span>
                          </button>
                        )}
                        {selectedProject.status === 'pending' && !isQuoted(selectedProject) && (
                          <button
                            onClick={() => handleDeleteProject(selectedProject.id)}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer"
                            title="Cancel project"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 sm:p-12 bg-[#16181c] border border-[#333538] rounded-2xl text-center text-xs sm:text-sm text-[#8e9195]">
                    Select a project to view details.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* NEW PROJECT INLINE FORM */}
          {activeTab === 'new_project' && (
            <div className="w-full max-w-xl mx-auto my-2 sm:my-6 bg-[#16181c] border border-[#333538] rounded-2xl p-4 sm:p-6 shadow-xl">
              <div className="mb-4 sm:mb-5">
                <span className="font-mono text-[10px] sm:text-[11px] text-[#8e9195] uppercase tracking-wider block">
                  // New project intake
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight mt-0.5">
                  Start a Capstone or Robotics Build
                </h3>
                <p className="text-xs text-[#c5c6cb] mt-1 leading-relaxed">
                  Choose your track, add a title and description. Our team reviews the scope and
                  complexity, then sends you a price quote before you pay.
                </p>
              </div>

              <form onSubmit={handleCreateProject} className="flex flex-col gap-4">
                {/* 1. Track Selection */}
                <div>
                  <label className="block font-mono text-[10px] sm:text-[11px] text-[#8e9195] uppercase mb-1.5">
                    1. Choose your track *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setCategory('capstone')}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        category === 'capstone'
                          ? 'bg-[#1e2023] border-white text-white shadow'
                          : 'bg-[#0c0e11] border-[#333538] text-[#8e9195] hover:text-white'
                      }`}
                    >
                      <div>
                        <FileText className="w-4 h-4 mb-1 text-[#bdc2ff]" />
                        <div className="font-bold text-xs">Capstone / Web</div>
                      </div>
                      <p className="text-[10px] text-[#8e9195] leading-tight mt-1">
                        Web, mobile apps, & AI systems.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCategory('robotics')}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        category === 'robotics'
                          ? 'bg-[#1e2023] border-white text-white shadow'
                          : 'bg-[#0c0e11] border-[#333538] text-[#8e9195] hover:text-white'
                      }`}
                    >
                      <div>
                        <Bot className="w-4 h-4 mb-1 text-emerald-400" />
                        <div className="font-bold text-xs">Robotics / Arduino</div>
                      </div>
                      <p className="text-[10px] text-[#8e9195] leading-tight mt-1">
                        ESP32, IoT sensors, & hardware.
                      </p>
                    </button>
                  </div>
                </div>

                {/* 2. System type */}
                {systemTypes.length > 0 && (
                  <div>
                    <label className="block font-mono text-[10px] sm:text-[11px] text-[#8e9195] uppercase mb-1">
                      2. System type *
                    </label>
                    <select
                      value={selectedSystemTypeId}
                      onChange={(e) => setSelectedSystemTypeId(Number(e.target.value))}
                      className="w-full bg-[#0c0e11] border border-[#333538] px-3 py-2 rounded-lg text-white text-xs focus:outline-none focus:border-white transition-colors cursor-pointer"
                    >
                      {systemTypes.map((st) => (
                        <option key={st.id} value={st.id}>
                          {st.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* 3. Title */}
                <div>
                  <label className="block font-mono text-[10px] sm:text-[11px] text-[#8e9195] uppercase mb-1">
                    {systemTypes.length > 0 ? '3' : '2'}. Project title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={
                      category === 'robotics'
                        ? 'e.g. IoT Smart Waste System with ESP32'
                        : 'e.g. Web-Based Student Records System'
                    }
                    className="w-full bg-[#0c0e11] border border-[#333538] px-3 py-2 rounded-lg text-white text-xs placeholder-[#666a70] focus:outline-none focus:border-white transition-colors"
                  />
                </div>

                {/* 4. Description */}
                <div>
                  <label className="block font-mono text-[10px] sm:text-[11px] text-[#8e9195] uppercase mb-1">
                    {systemTypes.length > 0 ? '4' : '3'}. Description &amp; features *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the features, hardware, screens, or APIs you need."
                    className="w-full bg-[#0c0e11] border border-[#333538] px-3 py-2 rounded-lg text-white text-xs placeholder-[#666a70] focus:outline-none focus:border-white transition-colors resize-none"
                  />
                </div>

                {/* Dynamic Slot (Robotics level vs Capstone Info) */}
                <div className="min-h-[58px] flex flex-col justify-center">
                  {category === 'robotics' ? (
                    <div>
                      <label className="block font-mono text-[10px] sm:text-[11px] text-[#8e9195] uppercase mb-1">
                        Complexity level
                      </label>
                      <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                        {(['easy', 'medium', 'hard'] as const).map((lvl) => (
                          <button
                            key={lvl}
                            type="button"
                            onClick={() => setDifficultyLevel(lvl)}
                            className={`py-1.5 px-2 rounded-lg border uppercase font-bold text-[10px] transition-all cursor-pointer ${
                              difficultyLevel === lvl
                                ? 'bg-white text-[#111316] border-white shadow'
                                : 'bg-[#0c0e11] text-[#8e9195] border-[#333538] hover:text-white'
                            }`}
                          >
                            {lvl}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="p-2.5 bg-[#0c0e11] border border-[#333538] rounded-xl flex items-center gap-2.5">
                      <Wallet className="w-4 h-4 text-[#bdc2ff] shrink-0" />
                      <p className="text-[10px] sm:text-[11px] text-[#c5c6cb]">
                        <strong className="text-white">No payment yet.</strong> Quote sent upon scope review.
                      </p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#26282c]">
                  <button
                    type="button"
                    onClick={() => setActiveTab('overview')}
                    className="px-3.5 py-2 font-mono text-xs text-[#8e9195] hover:text-white transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingProject}
                    className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 bg-white text-[#111316] font-bold text-xs rounded-lg hover:bg-[#e4e7eb] transition-all cursor-pointer shadow-md disabled:opacity-50"
                  >
                    <span>{submittingProject ? 'Submitting...' : 'Submit for Quote'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* DEFENSE GUIDE */}
          {activeTab === 'defense_prep' && (
            <div className="max-w-4xl mx-auto w-full flex flex-col gap-6">
              <div className="bg-[#16181c] border border-[#333538] rounded-2xl p-4 sm:p-6 md:p-8">
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight mb-2">
                  Thesis Defense Preparation
                </h3>
                <p className="text-xs sm:text-sm text-[#c5c6cb] leading-relaxed mb-6">
                  Materials and tips to help you present your capstone confidently.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                  <div className="p-4 bg-[#0c0e11] border border-[#333538] rounded-xl flex flex-col gap-2">
                    <span className="font-mono text-xs text-white font-bold flex items-center gap-2">
                      <FileCode className="w-4 h-4 text-[#bdc2ff]" />
                      <span>Code Walkthrough</span>
                    </span>
                    <p className="text-[#8e9195] leading-relaxed text-xs">
                      Every build ships with commented code and architecture diagrams so you can explain each function.
                    </p>
                  </div>
                  <div className="p-4 bg-[#0c0e11] border border-[#333538] rounded-xl flex flex-col gap-2">
                    <span className="font-mono text-xs text-white font-bold flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-emerald-400" />
                      <span>Hardware Docs</span>
                    </span>
                    <p className="text-[#8e9195] leading-relaxed text-xs">
                      Robotics builds include pinout tables, wiring diagrams, and power-safety notes.
                    </p>
                  </div>
                  <div className="p-4 bg-[#0c0e11] border border-[#333538] rounded-xl flex flex-col gap-2">
                    <span className="font-mono text-xs text-white font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-400" />
                      <span>Test Logs</span>
                    </span>
                    <p className="text-[#8e9195] leading-relaxed text-xs">
                      Automated test results for latency and response times — ready for Chapter 4.
                    </p>
                  </div>
                  <div className="p-4 bg-[#0c0e11] border border-[#333538] rounded-xl flex flex-col gap-2">
                    <span className="font-mono text-xs text-white font-bold flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-amber-400" />
                      <span>Defense-Day Support</span>
                    </span>
                    <p className="text-[#8e9195] leading-relaxed text-xs">
                      Direct developer assistance for last-minute fixes before your presentation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* PAYMENT MODAL */}
      {payingProjectId != null && selectedProject && (
        <div className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center p-4">
          <div className="bg-[#16181c] border border-[#333538] rounded-2xl p-6 max-w-md w-full">
            <span className="font-mono text-xs text-[#8e9195] uppercase tracking-wider">
              // Payment
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white mt-1 mb-2">Complete your payment</h3>
            <p className="text-xs sm:text-sm text-[#c5c6cb] mb-4 leading-relaxed line-clamp-2">
              {selectedProject.thesis_title}
            </p>
            <div className="p-4 bg-[#0c0e11] border border-[#333538] rounded-xl mb-5 flex items-center justify-between">
              <span className="font-mono text-[10px] text-[#8e9195] uppercase">Amount due</span>
              <span className="text-xl sm:text-2xl font-bold text-white font-mono">
                ₱{(selectedProject.quoted_price || 0).toLocaleString()}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handlePay(selectedProject.id, 'gcash')}
                disabled={payingLoading}
                className="py-2.5 bg-[#007dff] text-white font-bold text-xs sm:text-sm rounded-xl hover:bg-[#006fe0] transition-all cursor-pointer"
              >
                {payingLoading ? 'Processing...' : 'GCash'}
              </button>
              <button
                onClick={() => handlePay(selectedProject.id, 'grabpay')}
                disabled={payingLoading}
                className="py-2.5 bg-[#00b14f] text-white font-bold text-xs sm:text-sm rounded-xl hover:bg-[#009e46] transition-all cursor-pointer"
              >
                {payingLoading ? 'Processing...' : 'GrabPay'}
              </button>
            </div>
            <button
              onClick={() => setPayingProjectId(null)}
              className="w-full mt-3 py-2 font-mono text-xs sm:text-sm text-[#8e9195] hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};