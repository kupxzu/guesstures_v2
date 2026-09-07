import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { api } from '../services/api';
import { X, GraduationCap, Building2, ShieldCheck, ArrowRight, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
  initialRole?: UserRole;
  initialMode?: 'login' | 'register'; // Define prop
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialRole = 'student',
  initialMode = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [role, setRole] = useState<UserRole>(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [schoolOrCompany, setSchoolOrCompany] = useState('');
  const [studentId, setStudentId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await api.auth.login(email, password);
        setSuccessMsg('Logged in successfully!');
        setTimeout(() => {
          onSuccess(res.user);
          onClose();
        }, 300);
      } else {
        const res = await api.auth.register({
          name,
          email,
          password,
          role,
          school_or_company: schoolOrCompany,
          student_id: role === 'student' ? studentId : undefined,
        });
        setSuccessMsg('Account created successfully!');
        setTimeout(() => {
          onSuccess(res.user);
          onClose();
        }, 300);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (demoRole: 'student' | 'business' | 'admin') => {
    setLoading(true);
    setError('');
    let demoEmail = 'juan.delacruz@ust.edu.ph';
    if (demoRole === 'business') demoEmail = 'techlead@nexuscorp.ph';
    if (demoRole === 'admin') demoEmail = 'admin@guesstures.com';

    try {
      const res = await api.auth.login(demoEmail, 'demo1234');
      onSuccess(res.user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to login with demo account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="auth-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="auth-modal-container"
        className="relative w-full max-w-md bg-[#16181c] border border-[#383b40] rounded-2xl p-6 sm:p-8 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 p-2 text-[#8e9195] hover:text-white rounded-lg bg-[#1e2023] border border-[#383b40] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Branding */}
        <div className="flex items-center gap-2 font-mono text-xs text-[#8e9195] mb-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>CLIENT ACCESS &amp; PROJECT PORTAL</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-1">
          {mode === 'login' ? 'Sign In to Your Dashboard' : 'Create Client Account'}
        </h3>
        <p className="text-xs text-[#c5c6cb] mb-6 leading-relaxed">
          {mode === 'login'
            ? 'Enter your credentials. Your portal (Student or Business) will open automatically.'
            : 'Register to commission software, thesis capstones, AI, or robotics.'}
        </p>

        {/* Register Account Type Selector (Only shown during registration) */}
        {mode === 'register' && (
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#0c0e11] border border-[#383b40] rounded-xl mb-5">
            <button
              type="button"
              onClick={() => setRole('student')}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                role === 'student'
                  ? 'bg-[#24272c] text-white shadow border border-[#44474a]'
                  : 'text-[#8e9195] hover:text-white'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-[#bdc2ff]" />
              <span>Student &amp; Thesis</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('business')}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                role === 'business'
                  ? 'bg-[#24272c] text-white shadow border border-[#44474a]'
                  : 'text-[#8e9195] hover:text-white'
              }`}
            >
              <Building2 className="w-4 h-4 text-emerald-400" />
              <span>Business &amp; MVP</span>
            </button>
          </div>
        )}

        {/* Feedback Alerts */}
        {error && (
          <div className="mb-4 p-3 bg-red-950/40 border border-red-800/50 rounded-lg text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-950/40 border border-emerald-800/50 rounded-lg text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          {mode === 'register' && (
            <>
              <div>
                <label className="block font-mono text-[11px] text-[#8e9195] uppercase mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Juan Dela Cruz"
                  className="w-full bg-[#0c0e11] border border-[#383b40] px-3.5 py-2.5 rounded-lg text-white text-xs placeholder-[#666a70] focus:outline-none focus:border-white transition-colors"
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] text-[#8e9195] uppercase mb-1">
                  {role === 'student' ? 'School / University' : 'Company / Project Name'}
                </label>
                <input
                  type="text"
                  required
                  value={schoolOrCompany}
                  onChange={(e) => setSchoolOrCompany(e.target.value)}
                  placeholder={role === 'student' ? 'e.g. UST, DLSU, UP, PUP' : 'e.g. Nexus Tech Corp'}
                  className="w-full bg-[#0c0e11] border border-[#383b40] px-3.5 py-2.5 rounded-lg text-white text-xs placeholder-[#666a70] focus:outline-none focus:border-white transition-colors"
                />
              </div>

              {role === 'student' && (
                <div>
                  <label className="block font-mono text-[11px] text-[#8e9195] uppercase mb-1">
                    Student ID / Course (Optional)
                  </label>
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="e.g. BS Computer Engineering"
                    className="w-full bg-[#0c0e11] border border-[#383b40] px-3.5 py-2.5 rounded-lg text-white text-xs placeholder-[#666a70] focus:outline-none focus:border-white transition-colors"
                  />
                </div>
              )}
            </>
          )}

          <div>
            <label className="block font-mono text-[11px] text-[#8e9195] uppercase mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@email.com"
              className="w-full bg-[#0c0e11] border border-[#383b40] px-3.5 py-2.5 rounded-lg text-white text-xs placeholder-[#666a70] focus:outline-none focus:border-white transition-colors"
            />
          </div>

          <div>
            <label className="block font-mono text-[11px] text-[#8e9195] uppercase mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#0c0e11] border border-[#383b40] px-3.5 py-2.5 rounded-lg text-white text-xs placeholder-[#666a70] focus:outline-none focus:border-white transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 py-3 bg-white text-[#111316] hover:bg-[#e4e7eb] font-semibold text-xs rounded-lg transition-all shadow-md mt-2 cursor-pointer disabled:opacity-50 active:scale-[0.99]"
          >
            <span>{loading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Create Account'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Toggle Mode */}
        {/* <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              setError('');
            }}
            className="text-xs text-[#8e9195] hover:text-white underline transition-colors cursor-pointer"
          >
            {mode === 'login'
              ? "Don't have an account? Create one here"
              : 'Already have an account? Sign In'}
          </button>
        </div> */}

        {/* 1-Click Fast Demos for Quick Testing */}

      </div>
    </div>
  );
};
