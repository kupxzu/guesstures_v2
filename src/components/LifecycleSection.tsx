import React, { useState } from 'react';
import { LifecyclePhase } from '../types';
import { ArrowRight, CheckCircle, Code2, Cpu, FileText, Rocket } from 'lucide-react';

interface LifecycleSectionProps {
  phases: LifecyclePhase[];
}

export const LifecycleSection: React.FC<LifecycleSectionProps> = ({ phases }) => {
  const [activePhaseIndex, setActivePhaseIndex] = useState<number | null>(null);

  const phaseIcons = [FileText, Code2, Cpu, Rocket];

  return (
    <section
      id="lifecycle"
      className="w-full bg-[#111316] px-4 sm:px-6 lg:px-8 py-16 lg:py-24 border-b border-[#44474a]/20"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        <div>
          <span className="font-mono text-xs text-[#8e9195] uppercase tracking-wider block">
            // SIMPLE 4-STEP PROCESS
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight mt-1 uppercase font-sans">
            How We Work
          </h2>
          <p className="text-xs sm:text-sm text-[#c5c6cb] max-w-xl mt-2 leading-relaxed">
            From initial concept to final delivery. A clear, step-by-step workflow with regular updates so you always know your project's status.
          </p>
        </div>

        {/* Phase Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {phases.map((phase, idx) => {
            const Icon = phaseIcons[idx] || CheckCircle;
            const isHovered = activePhaseIndex === idx;

            return (
              <div
                key={phase.phase}
                id={`lifecycle-phase-${idx + 1}`}
                onMouseEnter={() => setActivePhaseIndex(idx)}
                onMouseLeave={() => setActivePhaseIndex(null)}
                className={`bg-[#1a1c1f] border rounded-lg p-5 sm:p-6 flex flex-col justify-between transition-all duration-200 ${
                  isHovered
                    ? 'border-white/60 bg-[#1e2023] shadow-lg translate-y-[-2px]'
                    : 'border-[#44474a]/30 hover:border-[#8e9195]/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs px-2 py-0.5 bg-[#1e2023] border border-[#44474a]/50 text-white rounded font-bold">
                      {phase.phase}
                    </span>
                    <span className="font-mono text-[11px] text-[#8e9195]">
                      {phase.timeframe}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-4 h-4 text-[#8e9195]" />
                    <h4 className="text-base font-semibold text-white">
                      {phase.title}
                    </h4>
                  </div>

                  <p className="text-xs text-[#c5c6cb] leading-relaxed mb-6">
                    {phase.description}
                  </p>
                </div>

                <div className="bg-[#0c0e11] border border-[#44474a]/40 p-2.5 rounded font-mono text-[10px] sm:text-[11px] text-[#8e9195]">
                  <span className="text-white font-medium">{phase.deliverable.split(':')[0]}:</span>
                  <span className="text-[#c5c6cb]">{phase.deliverable.split(':')[1]}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
