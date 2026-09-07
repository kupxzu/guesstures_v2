import React, { useState, useEffect } from 'react';
import { ArrowRight, Layers, ShieldCheck, Gauge, Lock } from 'lucide-react';

interface HeroSectionProps {
  onRequestCommission: () => void;
  onExploreDisciplines: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onRequestCommission,
  onExploreDisciplines,
}) => {
  const fullText = "CUSTOM SOFTWARE, AI & ROBOTICS BUILT FOR YOU.";
  const [displayedText, setDisplayedText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsTypingComplete(true);
        clearInterval(typingInterval);
      }
    }, 60); // Bilis ng bawat character

    return () => clearInterval(typingInterval);
  }, [fullText]);

  return (
    <section
      id="hero-section"
      className="relative w-full bg-[#0c0e11] px-4 sm:px-6 lg:px-8 pt-12 pb-16 lg:pt-16 lg:pb-24 overflow-hidden border-b border-[#44474a]/20"
    >
      {/* Background ambient lighting mesh */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1e2023]/25 via-transparent to-[#0c0e11] pointer-events-none" />
      <div className="absolute -top-32 right-1/4 w-96 h-96 bg-white/[0.04] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -left-20 w-80 h-80 bg-[#bdc2ff]/[0.03] rounded-full blur-3xl pointer-events-none" />

      {/* Grid overlay lines */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#1f2329_1px,transparent_1px),linear-gradient(to_bottom,#1f2329_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35 pointer-events-none"
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Operational Status Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1a1c1f] border border-[#44474a]/40 rounded-full shadow-sm mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-mono text-[11px] uppercase tracking-widest text-[#c5c6cb] font-medium">
            OPEN FOR LOCAL &amp; GLOBAL CLIENTS
          </span>
        </div>

        {/* Hero Headline Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end mb-12 lg:mb-16">
          <div className="lg:col-span-8 flex flex-col gap-3 min-h-[140px] sm:min-h-[160px] lg:min-h-[180px]">
            {/* Animated Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-bold text-white tracking-tight leading-[1.08] uppercase font-sans">
              {displayedText}
              <span
                className={`inline-block w-[3px] h-[0.8em] bg-emerald-400 ml-1.5 align-middle ${
                  isTypingComplete ? 'animate-pulse' : 'animate-ping'
                }`}
              />
            </h1>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-6">
            <p className="text-sm sm:text-base text-[#c5c6cb] leading-relaxed">
              We build clean web applications, mobile apps, AI pipelines, and robotics automation projects for students, startups, and clients worldwide.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <button
                id="btn-hero-request"
                onClick={onRequestCommission}
                className="inline-flex items-center gap-2 text-sm font-semibold bg-white text-[#161c22] px-5 py-2.5 rounded shadow-[0_0_15px_rgba(255,255,255,0.15)] hover:bg-[#dde3eb] hover:shadow-[0_0_20px_rgba(255,255,255,0.25)] transition-all active:scale-[0.99] cursor-pointer"
              >
                <span>Request a Project</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                id="btn-hero-pricing"
                onClick={onExploreDisciplines}
                className="inline-flex items-center gap-2 text-sm font-medium bg-[#1e2023] text-white hover:text-white hover:bg-[#282a2d] border border-[#44474a]/40 px-4 py-2.5 rounded transition-all cursor-pointer"
              >
                <span>Services &amp; Pricing</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Telemetry / Metric Bar */}
        <div className="w-full bg-[#1a1c1f]/90 border border-[#44474a]/40 rounded-lg p-3 sm:p-4 shadow-xl backdrop-blur-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* Metric 1 */}
            <div className="flex flex-col p-3.5 bg-[#0c0e11] border border-[#44474a]/30 rounded hover:border-[#8e9195]/40 transition-colors">
              <div className="flex items-center justify-between text-[#8e9195]">
                <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-wider">TECH FIELDS</span>
                <Layers className="w-4 h-4 text-[#8e9195]" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-bold text-white font-mono">04</span>
                <span className="text-xs text-[#c5c6cb] font-sans">Core Services</span>
              </div>
              <span className="font-mono text-[10px] text-[#8e9195] mt-1 truncate">Web / Mobile / AI / Robotics</span>
            </div>

            {/* Metric 2 */}
            <div className="flex flex-col p-3.5 bg-[#0c0e11] border border-[#44474a]/30 rounded hover:border-[#8e9195]/40 transition-colors">
              <div className="flex items-center justify-between text-[#8e9195]">
                <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-wider">RELIABLE QUALITY</span>
                <ShieldCheck className="w-4 h-4 text-[#8e9195]" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-bold text-white font-mono">100%</span>
                <span className="text-xs text-[#c5c6cb] font-sans">Working Code</span>
              </div>
              <span className="font-mono text-[10px] text-[#8e9195] mt-1 truncate">Tested &amp; ready to present</span>
            </div>

            {/* Metric 3 */}
            <div className="flex flex-col p-3.5 bg-[#0c0e11] border border-[#44474a]/30 rounded hover:border-[#8e9195]/40 transition-colors">
              <div className="flex items-center justify-between text-[#8e9195]">
                <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-wider">FAST DELIVERY</span>
                <Gauge className="w-4 h-4 text-[#8e9195]" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-bold text-white font-mono">1-2 Wks</span>
                <span className="text-xs text-[#c5c6cb] font-sans">Quick Turnaround</span>
              </div>
              <span className="font-mono text-[10px] text-[#8e9195] mt-1 truncate">Regular updates &amp; live demos</span>
            </div>

            {/* Metric 4 */}
            <div className="flex flex-col p-3.5 bg-[#0c0e11] border border-[#44474a]/30 rounded hover:border-[#8e9195]/40 transition-colors">
              <div className="flex items-center justify-between text-[#8e9195]">
                <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-wider">FULL OWNERSHIP</span>
                <Lock className="w-4 h-4 text-[#8e9195]" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-bold text-white font-mono">100%</span>
                <span className="text-xs text-[#c5c6cb] font-sans">Source Code Yours</span>
              </div>
              <span className="font-mono text-[10px] text-[#8e9195] mt-1 truncate">All files, models &amp; docs handed over</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};