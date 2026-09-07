import React, { useState } from 'react';
import { X, Key, ShieldCheck, CheckCircle2, Terminal, AlertCircle, RefreshCw, LogOut } from 'lucide-react';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SignInModal: React.FC<SignInModalProps> = ({ isOpen, onClose }) => {
  const [accessKey, setAccessKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [authenticatedUser, setAuthenticatedUser] = useState<{
    clientName: string;
    projectCode: string;
    phase: string;
    completionPct: number;
    leadArchitect: string;
    activeSince: string;
  } | null>(null);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!accessKey && !authenticatedUser) {
      setError('Enter a valid client access key or use Demo Preview.');
      return;
    }

    setLoading(true);
    setError('');

    setTimeout(() => {
      setAuthenticatedUser({
        clientName: 'Demo Client / Student Team',
        projectCode: 'GST-PROJECT-101',
        phase: 'PHASE 03 // TESTING & POLISHING',
        completionPct: 80,
        leadArchitect: 'Guesstures Dev Team',
        activeSince: 'March 2025',
      });
      setLoading(false);
    }, 500);
  };

  const handleDemoLogin = () => {
    setAccessKey('GST-DEMO-PASSKEY');
    setLoading(true);
    setError('');
    setTimeout(() => {
      setAuthenticatedUser({
        clientName: 'Student Capstone Research Team',
        projectCode: 'GST-CAPSTONE-2025',
        phase: 'PHASE 02 // CORE DEVELOPMENT',
        completionPct: 65,
        leadArchitect: 'Guesstures Dev Team',
        activeSince: 'March 2025',
      });
      setLoading(false);
    }, 400);
  };

  const handleSignOut = () => {
    setAuthenticatedUser(null);
    setAccessKey('');
    setError('');
  };

  return (
    <div
      id="signin-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        id="signin-modal-container"
        className="relative w-full max-w-lg bg-[#1a1c1f] border border-[#44474a] rounded-xl p-6 sm:p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          id="btn-close-signin-modal"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-5 right-5 p-1.5 text-[#8e9195] hover:text-white rounded-lg bg-[#111316] border border-[#44474a]/40 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {authenticatedUser ? (
          /* Logged-In Telemetry View */
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-[#44474a]/30 pb-3">
              <div>
                <div className="font-mono text-[10px] text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>CLIENT SESSION ACTIVE</span>
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight mt-0.5">
                  {authenticatedUser.clientName}
                </h3>
              </div>
              <button
                id="btn-sign-out"
                onClick={handleSignOut}
                className="inline-flex items-center gap-1 text-xs text-[#8e9195] hover:text-white font-mono p-1 rounded hover:bg-[#1e2023] transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>

            {/* Project Status Card */}
            <div className="bg-[#0c0e11] border border-[#44474a]/40 rounded-lg p-4 font-mono text-xs space-y-3">
              <div className="flex justify-between">
                <span className="text-[#8e9195]">PROJECT ID:</span>
                <span className="text-white font-bold">{authenticatedUser.projectCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8e9195]">CURRENT STATUS:</span>
                <span className="text-[#bdc2ff] font-semibold">{authenticatedUser.phase}</span>
              </div>
              <div>
                <div className="flex justify-between mb-1 text-[11px]">
                  <span className="text-[#8e9195]">PROGRESS:</span>
                  <span className="text-white">{authenticatedUser.completionPct}%</span>
                </div>
                <div className="w-full bg-[#1e2023] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-white h-full rounded-full transition-all duration-500"
                    style={{ width: `${authenticatedUser.completionPct}%` }}
                  />
                </div>
              </div>
              <div className="flex justify-between pt-1 border-t border-[#44474a]/30">
                <span className="text-[#8e9195]">ASSIGNED DEVELOPER:</span>
                <span className="text-[#c5c6cb] text-[11px] truncate">{authenticatedUser.leadArchitect}</span>
              </div>
            </div>

            {/* Test Harness Status */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 bg-[#1e2023] rounded border border-[#44474a]/30">
                <div className="text-[#8e9195] text-[10px]">TESTS COMPLETED</div>
                <div className="text-emerald-400 font-bold mt-0.5">✓ ALL CHECKS PASSED</div>
              </div>
              <div className="p-2.5 bg-[#1e2023] rounded border border-[#44474a]/30">
                <div className="text-[#8e9195] text-[10px]">SYSTEM STATUS</div>
                <div className="text-white font-bold mt-0.5">READY FOR DEMO</div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={onClose}
                className="w-full py-2.5 text-xs font-semibold bg-white text-[#161c22] rounded hover:bg-[#dde3eb] transition-colors cursor-pointer"
              >
                Return to Website
              </button>
            </div>
          </div>
        ) : (
          /* Sign In Form */
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-xs font-mono text-[#8e9195]">
              <Key className="w-4 h-4 text-white" />
              <span>CLIENT PORTAL</span>
            </div>

            <h3 className="text-xl font-bold text-white tracking-tight">
              Client Project Portal
            </h3>

            <p className="text-xs text-[#c5c6cb] leading-relaxed">
              Enter your project code or passkey provided during your project kickoff.
            </p>

            {error && (
              <div className="p-2.5 bg-red-950/40 border border-red-800/50 rounded text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="input-access-key" className="block font-mono text-[11px] text-[#8e9195] uppercase mb-1">
                Project Code / Passkey
              </label>
              <input
                id="input-access-key"
                type="text"
                value={accessKey}
                onChange={(e) => setAccessKey(e.target.value)}
                placeholder="GST-PASSKEY-XXXX"
                className="w-full bg-[#1e2023] border border-[#44474a]/40 px-3.5 py-2.5 rounded text-white text-xs font-mono placeholder-[#8e9195] focus:outline-none focus:border-white focus:bg-[#282a2d] transition-colors"
              />
            </div>

            <button
              id="btn-submit-login"
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 text-xs font-bold bg-white text-[#161c22] hover:bg-[#dde3eb] py-2.5 rounded transition-all shadow cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>CHECKING PASSKEY...</span>
                </span>
              ) : (
                <span>Sign In to Project</span>
              )}
            </button>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-[#44474a]/30"></div>
              <span className="flex-shrink mx-2 font-mono text-[10px] text-[#8e9195]">OR QUICK ACCESS</span>
              <div className="flex-grow border-t border-[#44474a]/30"></div>
            </div>

            <button
              id="btn-demo-login"
              type="button"
              onClick={handleDemoLogin}
              className="w-full text-center text-xs font-mono text-[#bdc2ff] bg-[#1e2023] hover:bg-[#282a2d] border border-[#44474a]/40 py-2.5 rounded transition-colors cursor-pointer"
            >
              View Sample Project Dashboard →
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
