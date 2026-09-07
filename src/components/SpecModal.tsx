import React from 'react';
import { Discipline } from '../types';
import { X, ArrowRight, CheckCircle2, Cpu, Terminal, Layers } from 'lucide-react';

interface SpecModalProps {
  discipline: Discipline | null;
  onClose: () => void;
  onSelectForCommission: (disciplineId: Discipline['id']) => void;
}

export const SpecModal: React.FC<SpecModalProps> = ({
  discipline,
  onClose,
  onSelectForCommission,
}) => {
  if (!discipline) return null;

  return (
    <div
      id="spec-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        id="spec-modal-container"
        className="relative w-full max-w-3xl bg-[#1a1c1f] border border-[#44474a] rounded-xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          id="btn-close-spec-modal"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-5 right-5 p-1.5 text-[#8e9195] hover:text-white rounded-lg bg-[#111316] border border-[#44474a]/40 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <span className="font-mono text-xs text-white font-bold tracking-wider">
            {discipline.code}
          </span>
          <span className="font-mono text-[11px] px-2 py-0.5 bg-[#333538] text-[#c5c6cb] rounded border border-[#44474a]">
            {discipline.tag}
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight uppercase font-sans mb-1">
          {discipline.title}
        </h2>
        <p className="font-mono text-xs text-[#8e9195] mb-5">
          CATEGORY: {discipline.category}
        </p>

        {/* Overview */}
        <p className="text-xs sm:text-sm text-[#c5c6cb] leading-relaxed mb-6">
          {discipline.description}
        </p>

        {/* Benchmark Readout Banner */}
        <div className="bg-[#0c0e11] border border-[#44474a]/40 p-3.5 rounded font-mono text-xs text-[#bdc2ff] flex items-center justify-between gap-2 mb-6">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>{discipline.benchmark}</span>
          </span>
          <span className="text-[#8e9195] text-[11px]">OPTIMIZED &amp; TESTED</span>
        </div>

        {/* Tech Stack Matrix */}
        <div className="mb-6">
          <h4 className="font-mono text-xs text-[#8e9195] uppercase mb-2 flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5 text-white" />
            <span>Technologies &amp; Tools Used</span>
          </h4>
          <div className="flex flex-wrap gap-2">
            {discipline.specDetails.stack.map((tech, idx) => (
              <span
                key={idx}
                className="font-mono text-xs px-2.5 py-1 bg-[#1e2023] border border-[#44474a]/60 text-white rounded"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Architectural Flow / Blueprint */}
        <div className="mb-6">
          <h4 className="font-mono text-xs text-[#8e9195] uppercase mb-2 flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-white" />
            <span>Architecture &amp; System Flow</span>
          </h4>
          <div className="bg-[#0c0e11] border border-[#44474a]/40 p-4 rounded font-mono text-xs text-[#c5c6cb] space-y-2">
            <p className="text-xs leading-relaxed text-[#8e9195]">
              {discipline.specDetails.architecture}
            </p>
            <div className="pt-2 border-t border-[#44474a]/30 text-white overflow-x-auto whitespace-pre-wrap">
              <code>{discipline.specDetails.sampleSchematic}</code>
            </div>
          </div>
        </div>

        {/* Key Deliverables */}
        <div className="mb-6">
          <h4 className="font-mono text-xs text-[#8e9195] uppercase mb-2 flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-white" />
            <span>Deliverables &amp; Inclusions</span>
          </h4>
          <div className="space-y-2">
            {discipline.specDetails.keyDeliverables.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-[#c5c6cb]">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Latency / SLA Profile */}
        <div className="mb-8 p-3 bg-[#1e2023] border border-[#44474a]/40 rounded font-mono text-xs flex items-center justify-between">
          <span className="text-[#8e9195]">PERFORMANCE PROFILE:</span>
          <span className="text-white font-medium">{discipline.specDetails.latencyProfile}</span>
        </div>

        {/* CTA */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#44474a]/30">
          <button
            id="btn-close-spec-footer"
            onClick={onClose}
            className="px-4 py-2 text-xs font-mono text-[#c5c6cb] hover:text-white transition-colors cursor-pointer"
          >
            Close
          </button>
          <button
            id="btn-commission-spec-cta"
            onClick={() => onSelectForCommission(discipline.id)}
            className="inline-flex items-center gap-2 text-xs font-bold bg-white text-[#161c22] px-5 py-2.5 rounded shadow hover:bg-[#dde3eb] transition-all cursor-pointer"
          >
            <span>Inquire for This Service</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
