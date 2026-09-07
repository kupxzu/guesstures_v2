import React from 'react';
import { Discipline } from '../types';
import { ArrowRight } from 'lucide-react';

interface DisciplinesSectionProps {
  disciplines: Discipline[];
  onSelectSpec: (discipline: Discipline) => void;
}

export const DisciplinesSection: React.FC<DisciplinesSectionProps> = ({
  disciplines,
  onSelectSpec,
}) => {
  return (
    <section
      id="disciplines"
      className="w-full bg-[#111316] px-4 sm:px-6 lg:px-8 py-16 lg:py-24 border-b border-[#44474a]/20"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="font-mono text-xs text-[#8e9195] uppercase tracking-wider block">
              // WHAT WE BUILD
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight mt-1 uppercase font-sans">
              Our Services
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#c5c6cb] max-w-md leading-relaxed">
            Full-stack software, mobile apps, AI pipelines, and custom robotics projects. Made easy to understand and ready to use.
          </p>
        </div>

        {/* 4 Disciplines Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {disciplines.map((item) => (
            <div
              key={item.id}
              id={`discipline-card-${item.id}`}
              className="group flex flex-col justify-between bg-[#1a1c1f] hover:bg-[#1e2023] border border-[#44474a]/30 hover:border-[#8e9195]/40 rounded-lg p-6 sm:p-7 shadow-sm transition-all duration-200"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs sm:text-sm text-white font-bold tracking-wider">
                    {item.code}
                  </span>
                  <span className="font-mono text-[11px] px-2 py-0.5 bg-[#333538] text-[#c5c6cb] rounded border border-[#44474a]/40">
                    {item.tag}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl text-white mb-2 font-semibold">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#c5c6cb] mb-6 leading-relaxed">
                  {item.description}
                </p>

                {/* Bullets */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-[11px] sm:text-xs text-[#8e9195] mb-6">
                  {item.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-white rounded-full flex-shrink-0" />
                      <span className="truncate text-[#c5c6cb]">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Benchmark & Explore Spec */}
              <div className="bg-[#0c0e11] border border-[#44474a]/30 p-3 rounded font-mono text-[11px] text-[#8e9195] flex items-center justify-between gap-2">
                <span className="text-[#c5c6cb] truncate">{item.benchmark}</span>
                <button
                  id={`btn-explore-spec-${item.id}`}
                  onClick={() => onSelectSpec(item)}
                  className="inline-flex items-center gap-1 text-white font-semibold group-hover:translate-x-0.5 transition-transform flex-shrink-0 hover:text-[#bdc2ff] cursor-pointer"
                >
                  <span>VIEW DETAILS</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
