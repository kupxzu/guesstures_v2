import React from 'react';
import { Twitter, Facebook, Instagram, Github } from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenPrivacy: () => void;
}

// Custom TikTok Icon para sa Lucide React
const TikTokIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .56.04.82.1v-3.6a6.37 6.37 0 0 0-.82-.05A6.34 6.34 0 0 0 3 15.5 6.34 6.34 0 0 0 9.34 21.84a6.34 6.34 0 0 0 6.34-6.34V9.05a8.28 8.28 0 0 0 4.76 1.5v-3.5a4.84 4.84 0 0 1-.85-.36z" />
  </svg>
);

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenPrivacy }) => {
  return (
    <footer
      id="main-footer"
      className="w-full bg-[#0c0e11] border-t border-[#44474a]/30 text-xs font-sans"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        
        {/* Mobile View Layout (Up-to-Down Stacked Layout) */}
        <div className="flex flex-col lg:hidden gap-8">
          
          {/* Brand Header & Description */}
          <div className="flex flex-col gap-3 text-center sm:text-left items-center sm:items-start">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white"></span>
              <span className="font-mono text-xs tracking-widest text-white font-bold uppercase">
                GUESSTURES
              </span>
              <span className="font-mono text-[10px] text-[#8e9195] px-1.5 py-0.5 border border-[#44474a]/40 rounded">
                DEV STUDIO
              </span>
            </div>

            <p className="text-xs text-[#c5c6cb] max-w-md leading-relaxed">
              Custom web apps, mobile apps, AI pipelines, and robotics automation for students, startups, and clients worldwide.
            </p>
          </div>

          {/* 2-Column Grid: Services | About & Terms */}
          <div className="grid grid-cols-2 gap-6 pt-2 border-t border-[#44474a]/20">
            {/* Services Column */}
            <div className="flex flex-col gap-2.5">
              <span className="font-mono text-[11px] text-[#8e9195] uppercase tracking-wider font-semibold">
                Services
              </span>
              <nav className="flex flex-col gap-2">
                <button
                  onClick={() => onNavigate('disciplines')}
                  className="text-left text-[#c5c6cb] hover:text-white transition-colors cursor-pointer"
                >
                  Web Development
                </button>
                <button
                  onClick={() => onNavigate('disciplines')}
                  className="text-left text-[#c5c6cb] hover:text-white transition-colors cursor-pointer"
                >
                  Mobile Apps
                </button>
                <button
                  onClick={() => onNavigate('disciplines')}
                  className="text-left text-[#c5c6cb] hover:text-white transition-colors cursor-pointer"
                >
                  AI &amp; Machine Learning
                </button>
                <button
                  onClick={() => onNavigate('disciplines')}
                  className="text-left text-[#c5c6cb] hover:text-white transition-colors cursor-pointer"
                >
                  Robotics &amp; Automation
                </button>
              </nav>
            </div>

            {/* About & Terms Column */}
            <div className="flex flex-col gap-2.5">
              <span className="font-mono text-[11px] text-[#8e9195] uppercase tracking-wider font-semibold">
                About &amp; Terms
              </span>
              <nav className="flex flex-col gap-2">
                <button
                  onClick={() => onNavigate('terms')}
                  className="text-left text-[#c5c6cb] hover:text-white transition-colors cursor-pointer"
                >
                  100% IP Ownership
                </button>
                <button
                  onClick={() => onNavigate('terms')}
                  className="text-left text-[#c5c6cb] hover:text-white transition-colors cursor-pointer"
                >
                  Student Discounts
                </button>
                <button
                  onClick={() => onNavigate('terms')}
                  className="text-left text-[#c5c6cb] hover:text-white transition-colors cursor-pointer"
                >
                  Free Revisions
                </button>
                <button
                  onClick={onOpenPrivacy}
                  className="text-left text-[#c5c6cb] hover:text-white transition-colors cursor-pointer"
                >
                  Privacy Policy
                </button>
              </nav>
            </div>
          </div>

          {/* Centered Connect Section with Social Icons */}
          <div className="flex flex-col items-center justify-center gap-3 pt-4 border-t border-[#44474a]/20">
            <span className="font-mono text-[11px] text-[#8e9195] uppercase tracking-wider font-semibold">
              Connect
            </span>
            <div className="flex items-center gap-4">
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter / X"
                className="p-2 rounded-full bg-[#1a1c1f] text-[#c5c6cb] hover:text-white hover:bg-[#282a2d] border border-[#44474a]/40 transition-all"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="p-2 rounded-full bg-[#1a1c1f] text-[#c5c6cb] hover:text-white hover:bg-[#282a2d] border border-[#44474a]/40 transition-all"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="p-2 rounded-full bg-[#1a1c1f] text-[#c5c6cb] hover:text-white hover:bg-[#282a2d] border border-[#44474a]/40 transition-all"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noreferrer"
                aria-label="TikTok"
                className="p-2 rounded-full bg-[#1a1c1f] text-[#c5c6cb] hover:text-white hover:bg-[#282a2d] border border-[#44474a]/40 transition-all"
              >
                <TikTokIcon className="w-4 h-4" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="p-2 rounded-full bg-[#1a1c1f] text-[#c5c6cb] hover:text-white hover:bg-[#282a2d] border border-[#44474a]/40 transition-all"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Desktop View Layout (Original 5-Column Grid) */}
        <div className="hidden lg:grid grid-cols-5 gap-10">
          {/* Studio Brand */}
          <div className="col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white"></span>
              <span className="font-mono text-xs tracking-widest text-white font-bold uppercase">
                GUESSTURES
              </span>
              <span className="font-mono text-[10px] text-[#8e9195] px-1.5 py-0.5 border border-[#44474a]/40 rounded">
                BETA 3.5
              </span>
            </div>

            <p className="text-xs text-[#c5c6cb] max-w-sm leading-relaxed">
              Custom web apps, mobile apps, AI pipelines, and robotics automation for students, startups, and clients worldwide.
            </p>

            <div className="font-mono text-[11px] text-[#8e9195] mt-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>PHILIPPINES</span>
            </div>
          </div>

          {/* Column 1: Services */}
          <div className="flex flex-col gap-3">
            <span className="font-mono text-[11px] text-[#8e9195] uppercase tracking-wider font-semibold">
              Services
            </span>
            <nav className="flex flex-col gap-2">
              <button
                onClick={() => onNavigate('disciplines')}
                className="text-left text-[#c5c6cb] hover:text-white transition-colors cursor-pointer"
              >
                Web Development
              </button>
              <button
                onClick={() => onNavigate('disciplines')}
                className="text-left text-[#c5c6cb] hover:text-white transition-colors cursor-pointer"
              >
                Mobile Apps
              </button>
              <button
                onClick={() => onNavigate('disciplines')}
                className="text-left text-[#c5c6cb] hover:text-white transition-colors cursor-pointer"
              >
                AI &amp; Machine Learning
              </button>
              <button
                onClick={() => onNavigate('disciplines')}
                className="text-left text-[#c5c6cb] hover:text-white transition-colors cursor-pointer"
              >
                Robotics &amp; Automation
              </button>
            </nav>
          </div>

          {/* Column 2: Governance */}
          <div className="flex flex-col gap-3">
            <span className="font-mono text-[11px] text-[#8e9195] uppercase tracking-wider font-semibold">
              About &amp; Terms
            </span>
            <nav className="flex flex-col gap-2">
              <button
                onClick={() => onNavigate('terms')}
                className="text-left text-[#c5c6cb] hover:text-white transition-colors cursor-pointer"
              >
                100% IP Ownership
              </button>
              <button
                onClick={() => onNavigate('terms')}
                className="text-left text-[#c5c6cb] hover:text-white transition-colors cursor-pointer"
              >
                Student Discounts
              </button>
              <button
                onClick={() => onNavigate('terms')}
                className="text-left text-[#c5c6cb] hover:text-white transition-colors cursor-pointer"
              >
                Free Revisions
              </button>
              <button
                onClick={onOpenPrivacy}
                className="text-left text-[#c5c6cb] hover:text-white transition-colors cursor-pointer"
              >
                Privacy Policy
              </button>
            </nav>
          </div>

          {/* Column 3: Connect */}
          <div className="flex flex-col gap-3">
            <span className="font-mono text-[11px] text-[#8e9195] uppercase tracking-wider font-semibold">
              Connect
            </span>
            <div className="flex flex-wrap gap-2.5">
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter / X"
                className="p-2 rounded bg-[#1a1c1f] text-[#c5c6cb] hover:text-white hover:bg-[#282a2d] border border-[#44474a]/40 transition-all"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="p-2 rounded bg-[#1a1c1f] text-[#c5c6cb] hover:text-white hover:bg-[#282a2d] border border-[#44474a]/40 transition-all"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="p-2 rounded bg-[#1a1c1f] text-[#c5c6cb] hover:text-white hover:bg-[#282a2d] border border-[#44474a]/40 transition-all"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noreferrer"
                aria-label="TikTok"
                className="p-2 rounded bg-[#1a1c1f] text-[#c5c6cb] hover:text-white hover:bg-[#282a2d] border border-[#44474a]/40 transition-all"
              >
                <TikTokIcon className="w-4 h-4" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="p-2 rounded bg-[#1a1c1f] text-[#c5c6cb] hover:text-white hover:bg-[#282a2d] border border-[#44474a]/40 transition-all"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 lg:mt-12 pt-6 border-t border-[#44474a]/20 flex flex-col sm:flex-row justify-between items-center gap-3 text-center sm:text-left">
          <span className="font-mono text-[11px] text-[#8e9195]">
            © 2026 GUESSTURES. All rights reserved.
          </span>
          <span className="font-mono text-[11px] text-[#8e9195]">
            BUILT FOR CLIENTS
          </span>
        </div>
      </div>
    </footer>
  );
};