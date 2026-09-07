import React, { useState, useEffect } from 'react';
import { User as UserType } from '../types';
import { Shield, Menu, X, ArrowUpRight, User, GraduationCap, Building2, ShieldAlert, LogOut } from 'lucide-react';

interface HeaderProps {
  currentUser?: UserType | null;
  onOpenSignIn: () => void;
  onOpenCommission: () => void;
  onOpenDashboard: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onOpenSignIn,
  onOpenCommission,
  onOpenDashboard,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('home');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = ['disciplines', 'pricing', 'lifecycle', 'terms', 'inquiry'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom >= 120) {
            setActiveSection(section);
            break;
          }
        }
      }
      if (window.scrollY < 200) {
        setActiveSection('home');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-200 ${
        scrolled
          ? 'bg-[#111316]/90 backdrop-blur-md border-b border-[#44474a]/40 shadow-lg'
          : 'bg-[#111316]/75 backdrop-blur-sm border-b border-[#44474a]/20'
      }`}
    >
      <div className="h-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <button
            id="nav-logo-btn"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2.5 group text-left cursor-pointer"
          >
            <img 
              src="/headlogo.png" 
              alt="Guesstures Logo" 
              className="w-7 h-7 object-contain rounded group-hover:scale-105 transition-transform"
            />
            <span className="font-mono text-xs tracking-widest text-white font-bold uppercase">
              GUESSTURES
            </span>
          </button>
          <span className="hidden xl:inline-block font-mono text-[10px] text-[#8e9195] tracking-wider uppercase border-l border-[#44474a]/60 pl-3">
            // DEV STUDIO
          </span>
        </div>

        {/* Navigation Desktop */}
        <nav id="desktop-nav" className="hidden lg:flex items-center gap-6 text-xs font-sans">
          <button
            id="nav-link-domains"
            onClick={() => scrollTo('disciplines')}
            className={`transition-colors py-1 cursor-pointer ${
              activeSection === 'disciplines' ? 'text-white font-medium border-b border-white' : 'text-[#c5c6cb] hover:text-white'
            }`}
          >
            Services
          </button>
          <button
            id="nav-link-pricing"
            onClick={() => scrollTo('pricing')}
            className={`transition-colors py-1 cursor-pointer ${
              activeSection === 'pricing' ? 'text-white font-medium border-b border-white' : 'text-[#c5c6cb] hover:text-white'
            }`}
          >
            Pricing
          </button>
          <button
            id="nav-link-process"
            onClick={() => scrollTo('lifecycle')}
            className={`transition-colors py-1 cursor-pointer ${
              activeSection === 'lifecycle' ? 'text-white font-medium border-b border-white' : 'text-[#c5c6cb] hover:text-white'
            }`}
          >
            Process
          </button>
          <button
            id="nav-link-terms"
            onClick={() => scrollTo('terms')}
            className={`transition-colors py-1 cursor-pointer ${
              activeSection === 'terms' ? 'text-white font-medium border-b border-white' : 'text-[#c5c6cb] hover:text-white'
            }`}
          >
            Terms &amp; Ownership
          </button>
          <button
            id="nav-link-commissions"
            onClick={() => scrollTo('inquiry')}
            className={`transition-colors py-1 cursor-pointer ${
              activeSection === 'inquiry' ? 'text-white font-medium border-b border-white' : 'text-[#c5c6cb] hover:text-white'
            }`}
          >
            Contact / Inquire
          </button>
        </nav>

        {/* Actions Desktop */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-2.5">
              <button
                onClick={onOpenDashboard}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#1e2023] hover:bg-[#282a2d] border border-[#44474a]/60 text-white text-xs font-mono transition-all cursor-pointer shadow"
              >
                {currentUser.role === 'admin' ? (
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                ) : currentUser.role === 'student' ? (
                  <GraduationCap className="w-3.5 h-3.5 text-[#bdc2ff]" />
                ) : (
                  <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                )}
                <span className="font-semibold">{currentUser.name.split(' ')[0]}</span>
                <span className="text-[10px] uppercase text-[#8e9195] px-1.5 py-0.5 bg-[#0c0e11] rounded border border-[#383b40]">
                  {currentUser.role === 'admin' ? 'Admin Console →' : `${currentUser.role} Dashboard →`}
                </span>
              </button>

              <button
                onClick={onLogout}
                title="Sign out"
                className="p-2 text-[#8e9195] hover:text-white bg-[#1e2023] hover:bg-[#282a2d] border border-[#44474a]/40 rounded-lg transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <>
              <button
                id="btn-sign-in"
                onClick={onOpenSignIn}
                className="text-xs text-[#c5c6cb] hover:text-white px-3 py-1.5 transition-colors font-mono cursor-pointer"
              >
                Client Portal
              </button>
              <button
                id="btn-header-commission"
                onClick={onOpenCommission}
                className="inline-flex items-center justify-center text-xs font-semibold bg-white text-[#161c22] px-4 py-2 rounded shadow-[0_0_15px_rgba(255,255,255,0.15)] hover:bg-[#dde3eb] hover:shadow-[0_0_20px_rgba(255,255,255,0.25)] transition-all duration-150 active:scale-[0.98] cursor-pointer"
              >
                Start a Project
              </button>
            </>
          )}

          {/* Mobile menu toggle */}
          <button
            id="btn-mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 text-[#c5c6cb] hover:text-white cursor-pointer"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div id="mobile-menu-drawer" className="lg:hidden bg-[#0c0e11] border-b border-[#44474a] px-4 py-4 space-y-3">
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <button
              onClick={() => scrollTo('disciplines')}
              className="p-2.5 text-left rounded bg-[#1e2023] text-white hover:bg-[#282a2d]"
            >
              Services
            </button>
            <button
              onClick={() => scrollTo('pricing')}
              className="p-2.5 text-left rounded bg-[#1e2023] text-white hover:bg-[#282a2d]"
            >
              Pricing
            </button>
            <button
              onClick={() => scrollTo('lifecycle')}
              className="p-2.5 text-left rounded bg-[#1e2023] text-white hover:bg-[#282a2d]"
            >
              Process
            </button>
            <button
              onClick={() => scrollTo('terms')}
              className="p-2.5 text-left rounded bg-[#1e2023] text-white hover:bg-[#282a2d]"
            >
              Terms
            </button>
            <button
              onClick={() => scrollTo('inquiry')}
              className="p-2.5 text-left rounded bg-[#1e2023] text-white hover:bg-[#282a2d] col-span-2"
            >
              Contact / Inquire
            </button>
            {currentUser ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenDashboard();
                }}
                className="p-2.5 text-left rounded bg-[#1a1c1f] border border-emerald-500/50 text-emerald-400 hover:bg-[#282a2d] col-span-2 font-bold"
              >
                Open {currentUser.role.toUpperCase()} Dashboard →
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSignIn();
                }}
                className="p-2.5 text-left rounded bg-[#1a1c1f] border border-[#44474a] text-white hover:bg-[#282a2d] col-span-2"
              >
                Client Portal →
              </button>
            )}
          </div>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenCommission();
            }}
            className="w-full text-center text-xs font-bold bg-white text-[#161c22] py-2.5 rounded shadow cursor-pointer"
          >
            Start a Project
          </button>
        </div>
      )}
    </header>
  );
};