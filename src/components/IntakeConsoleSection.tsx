import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { api } from '../services/api';
import { 
  Shield, 
  Clock, 
  Terminal, 
  Lock, 
  LogIn, 
  CheckCircle, 
  AlertCircle, 
  LogOut,
  UserPlus,
  CheckCircle2,
  UserCheck
} from 'lucide-react';

interface IntakeConsoleSectionProps {
  currentUser?: User | null;
  onAuthSuccess?: (user: User) => void;
  onLogout?: () => void;
  onRegisterClick?: () => void;
}

export const IntakeConsoleSection: React.FC<IntakeConsoleSectionProps> = ({
  currentUser,
  onAuthSuccess,
  onLogout,
  onRegisterClick,
}) => {
  const [consoleMode, setConsoleMode] = useState<'login' | 'register'>('login');

  // Login Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Register Form States
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPasswordConfirmation, setRegPasswordConfirmation] = useState(''); // <-- 1. IDINAGDAG DITO
  const [regRole, setRegRole] = useState<UserRole>('student');
  const [regCompany, setRegCompany] = useState('');
  const [regSubmitting, setRegSubmitting] = useState(false);
  const [regError, setRegError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setSubmitting(true);

    try {
      const res = await api.auth.login(email, password);
      const roleDisplayName = res.user.role ? res.user.role.toUpperCase() : 'CLIENT';
      setSuccessMsg(`Authenticated as ${roleDisplayName}! Redirecting...`);
      
      setTimeout(() => {
        if (onAuthSuccess) {
          onAuthSuccess(res.user);
        }
      }, 300);

    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    // Front-end check muna bago mag-API call
    if (regPassword !== regPasswordConfirmation) {
      setRegError('Passwords do not match.');
      return;
    }

    setRegSubmitting(true);

    try {
      const res = await api.auth.register({
        name: regName,
        email: regEmail,
        password: regPassword,
        password_confirmation: regPasswordConfirmation, // <-- 2. PINASA SA API PAYLOAD
        role: regRole,
        school_or_company: regCompany,
      });

      if (onAuthSuccess) {
        onAuthSuccess(res.user);
      }
    } catch (err: any) {
      setRegError(err.message || 'Registration failed. Please try again.');
    } finally {
      setRegSubmitting(false);
    }
  };

  const switchToRegister = () => {
    setError('');
    setSuccessMsg('');
    setConsoleMode('register');
  };

  const switchToLogin = () => {
    setRegError('');
    setConsoleMode('login');
  };

  return (
    <section
      id="inquiry"
      className="w-full bg-[#111316] px-4 sm:px-6 lg:px-8 py-16 lg:py-24 border-b border-[#44474a]/20"
    >
      <div className="max-w-7xl mx-auto">
        <div className="bg-[#1a1c1f] border border-[#44474a]/40 rounded-xl p-6 sm:p-8 lg:p-12 shadow-2xl flex flex-col lg:flex-row gap-10 lg:gap-14 items-stretch">
          
          {/* Left Column: Portal Information */}
          <div className="lg:w-1/2 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 font-mono text-xs text-[#8e9195] uppercase mb-4 tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>AUTHENTICATION GATEWAY</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight uppercase mb-4 font-sans">
                {consoleMode === 'login' ? 'Access Client Portal' : 'Create Portal Account'}
              </h2>

              <p className="text-sm sm:text-base text-[#c5c6cb] leading-relaxed mb-8">
                {consoleMode === 'login'
                  ? 'Sign in to your Guesstures account to manage your active project commissions, submit development briefs, and track project milestones in real-time.'
                  : 'Register a new account to kickstart your development projects, request customized pricing quotes, and collaborate with our technical team.'}
              </p>
            </div>

            {/* Security Badges */}
            <div className="space-y-3 font-mono text-xs text-[#8e9195] pt-4 border-t border-[#44474a]/30">
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-white flex-shrink-0" />
                <span>Encrypted end-to-end user authentication</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-white flex-shrink-0" />
                <span>Real-time dashboard &amp; project updates</span>
              </div>
              <div className="flex items-center gap-3">
                <Terminal className="w-4 h-4 text-white flex-shrink-0" />
                <span>Direct portal access to developer resources</span>
              </div>
            </div>
          </div>

          {/* Right Column: Console Switcher */}
          <div className="lg:w-1/2 bg-[#0c0e11] border border-[#44474a]/40 p-6 sm:p-8 rounded-lg flex flex-col justify-center shadow-inner transition-all duration-200">
            {currentUser ? (
              /* Authenticated View */
              <div className="flex flex-col gap-6 py-4">
                <div className="p-4 bg-[#1e2023] border border-[#44474a]/60 rounded text-white font-mono text-xs flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <div>
                    <div className="font-bold text-emerald-400">AUTHENTICATED SESSION ACTIVE</div>
                    <div className="text-[#8e9195] mt-0.5">Signed in as {currentUser.email}</div>
                  </div>
                </div>

                <div className="bg-[#1a1c1f] border border-[#44474a]/40 rounded-lg p-5 font-mono text-xs space-y-3">
                  <div className="flex justify-between border-b border-[#44474a]/30 pb-2">
                    <span className="text-[#8e9195]">ACCOUNT ID:</span>
                    <span className="text-white font-bold">{currentUser.id || 'USR-2026'}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#44474a]/30 pb-2">
                    <span className="text-[#8e9195]">ACCOUNT ROLE:</span>
                    <span className="text-emerald-400 font-bold uppercase">{currentUser.role || 'CLIENT'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8e9195]">GATEWAY STATUS:</span>
                    <span className="text-emerald-400">CONNECTED</span>
                  </div>
                </div>

                {onLogout && (
                  <button
                    onClick={onLogout}
                    className="w-full inline-flex items-center justify-center gap-2 text-xs font-semibold bg-[#1e2023] text-white hover:bg-[#282a2d] border border-[#44474a]/40 py-3 rounded transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-[#8e9195]" />
                    <span>Sign Out Account</span>
                  </button>
                )}
              </div>
            ) : consoleMode === 'login' ? (
              /* VIEW 1: Login Terminal */
              <form id="login-console-form" onSubmit={handleLogin} className="flex flex-col gap-5 py-2 animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b border-[#44474a]/30 pb-3">
                  <div className="flex items-center gap-2 font-mono text-xs text-white">
                    <Lock className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold uppercase tracking-wider">Client Login Terminal</span>
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-950/40 border border-red-800/50 rounded-lg text-red-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
                    <span>{error}</span>
                  </div>
                )}

                {successMsg && (
                  <div className="p-3 bg-emerald-950/40 border border-emerald-800/50 rounded-lg text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                    <span>{successMsg}</span>
                  </div>
                )}

                <div>
                  <label htmlFor="login-email" className="block font-mono text-[11px] text-[#c5c6cb] uppercase mb-1.5">
                    Email Address *
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="yourname@gmail.com"
                    className="w-full bg-[#1e2023] border border-[#44474a]/40 px-3.5 py-2.5 rounded text-white text-xs sm:text-sm placeholder-[#8e9195] focus:outline-none focus:border-white focus:bg-[#282a2d] transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="login-password" className="block font-mono text-[11px] text-[#c5c6cb] uppercase mb-1.5">
                    Password *
                  </label>
                  <input
                    id="login-password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#1e2023] border border-[#44474a]/40 px-3.5 py-2.5 rounded text-white text-xs sm:text-sm placeholder-[#8e9195] focus:outline-none focus:border-white focus:bg-[#282a2d] transition-colors"
                  />
                </div>

                <button
                  id="btn-login-submit"
                  type="submit"
                  disabled={submitting}
                  className="w-full inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-bold bg-white text-[#161c22] hover:bg-[#dde3eb] hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] py-3 rounded transition-all shadow-md mt-2 cursor-pointer disabled:opacity-50 active:scale-[0.99]"
                >
                  {submitting ? (
                    <span>AUTHENTICATING...</span>
                  ) : (
                    <>
                      <span>Sign In to Portal</span>
                      <LogIn className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="text-center pt-2 border-t border-[#44474a]/30 mt-1">
                  <p className="text-xs text-[#8e9195]">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={switchToRegister}
                      className="text-white hover:text-emerald-400 font-semibold underline underline-offset-4 transition-colors cursor-pointer inline-flex items-center gap-1"
                    >
                      <span>Create one here</span>
                      <UserPlus className="w-3 h-3 inline" />
                    </button>
                  </p>
                </div>
              </form>
            ) : (
              /* VIEW 2: Registration Terminal */
              <form id="register-console-form" onSubmit={handleRegisterSubmit} className="flex flex-col gap-3 py-1 animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b border-[#44474a]/30 pb-2">
                  <div className="flex items-center gap-2 font-mono text-xs text-white">
                    <UserPlus className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold uppercase tracking-wider">Account Registration</span>
                  </div>
                </div>

                {regError && (
                  <div className="p-2.5 bg-red-950/40 border border-red-800/50 rounded-lg text-red-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
                    <span>{regError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block font-mono text-[10px] text-[#c5c6cb] uppercase mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="Juan Dela Cruz"
                      className="w-full bg-[#1e2023] border border-[#44474a]/40 px-3 py-2 rounded text-white text-xs placeholder-[#8e9195] focus:outline-none focus:border-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] text-[#c5c6cb] uppercase mb-1">
                      Account Type
                    </label>
                    <select
                      value={regRole}
                      onChange={(e) => setRegRole(e.target.value as UserRole)}
                      className="w-full bg-[#1e2023] border border-[#44474a]/40 px-3 py-2 rounded text-white text-xs focus:outline-none focus:border-white transition-colors"
                    >
                      <option value="student">Student / Academic</option>
                      <option value="business">Business / Client</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[10px] text-[#c5c6cb] uppercase mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="yourname@gmail.com"
                    className="w-full bg-[#1e2023] border border-[#44474a]/40 px-3 py-2 rounded text-white text-xs placeholder-[#8e9195] focus:outline-none focus:border-white transition-colors"
                  />
                </div>

                {/* Password Fields Side-by-Side */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block font-mono text-[10px] text-[#c5c6cb] uppercase mb-1">
                      Password *
                    </label>
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-[#1e2023] border border-[#44474a]/40 px-3 py-2 rounded text-white text-xs placeholder-[#8e9195] focus:outline-none focus:border-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] text-[#c5c6cb] uppercase mb-1">
                      Confirm Password *
                    </label>
                    <input
                      type="password"
                      required
                      value={regPasswordConfirmation}
                      onChange={(e) => setRegPasswordConfirmation(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-[#1e2023] border border-[#44474a]/40 px-3 py-2 rounded text-white text-xs placeholder-[#8e9195] focus:outline-none focus:border-white transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[10px] text-[#c5c6cb] uppercase mb-1">
                    School or Company
                  </label>
                  <input
                    type="text"
                    value={regCompany}
                    onChange={(e) => setRegCompany(e.target.value)}
                    placeholder="e.g. Biringan State University"
                    className="w-full bg-[#1e2023] border border-[#44474a]/40 px-3 py-2 rounded text-white text-xs placeholder-[#8e9195] focus:outline-none focus:border-white transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={regSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 text-xs font-bold bg-white text-[#161c22] hover:bg-[#dde3eb] py-2.5 rounded transition-all shadow-md mt-1 cursor-pointer disabled:opacity-50"
                >
                  {regSubmitting ? (
                    <span>CREATING ACCOUNT...</span>
                  ) : (
                    <>
                      <span>Complete Registration</span>
                      <UserCheck className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="text-center pt-2 border-t border-[#44474a]/30 mt-0.5">
                  <p className="text-xs text-[#8e9195]">
                    Already registered?{' '}
                    <button
                      type="button"
                      onClick={switchToLogin}
                      className="text-white hover:text-emerald-400 font-semibold underline underline-offset-4 transition-colors cursor-pointer inline-flex items-center gap-1"
                    >
                      <span>Sign in here</span>
                      <LogIn className="w-3 h-3 inline" />
                    </button>
                  </p>
                </div>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};