import React, { useState } from 'react';
import { GovernanceTerm } from '../types';
import { ChevronDown } from 'lucide-react';

interface TermsSectionProps {
  terms: GovernanceTerm[];
}

export const TermsSection: React.FC<TermsSectionProps> = ({ terms }) => {
  // Term 1 is open by default like in the HTML
  const [openIds, setOpenIds] = useState<string[]>(['term-1']);

  const toggleTerm = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <section
      id="terms"
      className="w-full bg-[#0c0e11] px-4 sm:px-6 lg:px-8 py-16 lg:py-24 border-b border-[#44474a]/20"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="font-mono text-xs text-[#8e9195] uppercase tracking-wider block">
              // TRANSPARENCY &amp; GUARANTEE
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight mt-1 uppercase font-sans">
              Terms &amp; Project Ownership
            </h2>
          </div>
          <div className="font-mono text-xs text-[#8e9195]">
           <span className="text-[#44474a] mx-1"> </span> 
          </div>
        </div>

        {/* Accordion List */}
        <div className="flex flex-col gap-3">
          {terms.map((term) => {
            const isOpen = openIds.includes(term.id);

            return (
              <div
                key={term.id}
                id={`accordion-item-${term.id}`}
                className="bg-[#1a1c1f] border border-[#44474a]/30 rounded-lg overflow-hidden transition-all duration-200"
              >
                <button
                  id={`btn-term-${term.id}`}
                  onClick={() => toggleTerm(term.id)}
                  className="w-full p-5 sm:p-6 flex items-center justify-between text-left hover:bg-[#1e2023] transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-4 sm:gap-5">
                    <span className="font-mono text-xs sm:text-sm text-white font-bold">
                      {term.num}
                    </span>
                    <span className="text-base sm:text-lg text-white font-medium">
                      {term.title}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-[#8e9195] transition-transform duration-200 flex-shrink-0 ${
                      isOpen ? 'rotate-180 text-white' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div
                    id={`term-content-${term.id}`}
                    className="px-5 sm:px-6 pb-6 pt-1 border-t border-[#44474a]/20"
                  >
                    <p className="text-xs sm:text-sm text-[#c5c6cb] leading-relaxed mb-4">
                      {term.content}
                    </p>
                    <div className="font-mono text-[11px] sm:text-xs text-[#8e9195] bg-[#0c0e11] border border-[#44474a]/30 p-3 rounded">
                      {term.standardNote}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
