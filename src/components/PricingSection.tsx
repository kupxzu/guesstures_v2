import React, { useState } from 'react';
import { PricingTier, PricingMode } from '../types';
import { CheckCircle2, Hand } from 'lucide-react';

interface PricingSectionProps {
  tiers: PricingTier[];
  onSelectTier: (tierId: string, mode: PricingMode) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({
  tiers,
  onSelectTier,
}) => {
  const [pricingMode, setPricingMode] = useState<PricingMode>('business');

  // Desktop Order: Default order mula sa props (Popular sa Gitna)
  const desktopTiers = tiers;

  // Mobile Order: Unahin ang recommended / most popular tier
  const mobileTiers = [...tiers].sort((a, b) => {
    if (a.recommended && !b.recommended) return -1;
    if (!a.recommended && b.recommended) return 1;
    return 0;
  });

  const renderCard = (tier: PricingTier) => {
    const currentPricing = pricingMode === 'business' ? tier.business : tier.student;
    const isFeatured = tier.recommended;

    return (
      <div
        key={tier.id}
        id={`tier-card-${tier.id}`}
        className={`w-full relative flex flex-col justify-between rounded-lg p-5 sm:p-7 transition-all duration-200 ${
          isFeatured
            ? 'bg-[#1e2023] border-2 border-white/80 shadow-[0_0_30px_rgba(255,255,255,0.06)]'
            : 'bg-[#1a1c1f] border border-[#44474a]/30 hover:border-[#8e9195]/40 shadow-sm'
        }`}
      >
        {/* Recommended Pill */}
        {isFeatured && (
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-white text-[#161c22] px-3 py-0.5 sm:px-3.5 sm:py-1 rounded-full font-mono text-[9px] sm:text-[11px] font-bold uppercase tracking-wider shadow-md flex items-center gap-1.5 whitespace-nowrap z-10">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>MOST POPULAR CHOICE</span>
          </div>
        )}

        <div>
          <div className={`flex items-center justify-between mb-3 ${isFeatured ? 'mt-1' : ''}`}>
            <span
              className={`font-mono text-[10px] sm:text-[11px] uppercase tracking-wider ${
                isFeatured ? 'text-white font-semibold' : 'text-[#8e9195]'
              }`}
            >
              {tier.tierCode}
            </span>
            <span className="font-mono text-[10px] sm:text-[11px] text-[#c5c6cb] bg-[#333538] px-2 py-0.5 rounded border border-[#44474a]/40">
              {tier.duration}
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            {tier.title}
          </h3>

          <p className="text-[11px] sm:text-xs text-[#c5c6cb] mt-1 mb-5 leading-relaxed">
            {tier.description}
          </p>

          <div className="mb-5 pb-5 border-b border-[#44474a]/30">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-4xl font-bold text-white font-mono tracking-tight">
                {currentPricing.price}
              </span>
              <span className="font-mono text-[10px] sm:text-xs text-[#8e9195]">
                {currentPricing.period}
              </span>
            </div>
            <p className="font-mono text-[10px] sm:text-[11px] text-[#8e9195] mt-1 leading-normal">
              {currentPricing.subtext}
            </p>
          </div>

          {/* Checklist */}
          <div className="space-y-2.5 sm:space-y-3 font-sans text-[11px] sm:text-xs text-[#c5c6cb] mb-6">
            {tier.features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-white flex-shrink-0 mt-0.5" />
                <span className="leading-tight">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          id={`btn-select-tier-${tier.id}`}
          onClick={() => onSelectTier(tier.id, pricingMode)}
          className={`w-full inline-flex items-center justify-center text-xs sm:text-sm font-semibold py-2 sm:py-2.5 rounded transition-all cursor-pointer ${
            isFeatured
              ? 'bg-white text-[#161c22] hover:bg-[#dde3eb] shadow-md active:scale-[0.99]'
              : 'bg-[#1e2023] hover:bg-[#282a2d] text-white border border-[#44474a]/40'
          }`}
        >
          {tier.ctaLabel}
        </button>
      </div>
    );
  };

  return (
    <section
      id="pricing"
      className="w-full bg-[#0c0e11] px-4 sm:px-6 lg:px-8 py-16 lg:py-24 border-b border-[#44474a]/20 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* Section Header */}
        <div className="text-center max-w-2xl mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight mt-1 uppercase font-sans">
            Pricing Packages
          </h2>
          <p className="text-xs sm:text-sm text-[#c5c6cb] mt-2 leading-relaxed">
            Transparent pricing with no hidden charges. Choose standard client rates or discounted student rates for school projects and thesis.
          </p>
        </div>

        {/* Segmented Pill Switch */}
        <div className="bg-[#1a1c1f] border border-[#44474a]/40 p-1 rounded-full inline-flex items-center gap-1 mb-8 sm:mb-12 shadow-md">
          <button
            id="btn-business-tier"
            onClick={() => setPricingMode('business')}
            className={`px-4 py-2 rounded-full font-mono text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
              pricingMode === 'business'
                ? 'bg-white text-[#161c22] shadow'
                : 'text-[#c5c6cb] hover:text-white'
            }`}
          >
            Regular / Business
          </button>
          <button
            id="btn-student-tier"
            onClick={() => setPricingMode('student')}
            className={`px-4 py-2 rounded-full font-mono text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-2 cursor-pointer ${
              pricingMode === 'student'
                ? 'bg-white text-[#161c22] shadow'
                : 'text-[#c5c6cb] hover:text-white'
            }`}
          >
            <span>Student &amp; Capstone</span>
            <span
              className={`font-mono text-[10px] px-1.5 py-0.5 rounded-full uppercase font-bold tracking-wider ${
                pricingMode === 'student'
                  ? 'bg-[#1e2023] text-[#bdc2ff]'
                  : 'bg-[#333538] text-[#bdc2ff]'
              }`}
            >
              DISCOUNTED
            </span>
          </button>
        </div>

        {/* Swipe Indication Badge (Mobile Only) */}
        <div className="lg:hidden flex items-center gap-2 text-[#8e9195] text-[11px] font-mono mb-4 animate-pulse">
          <Hand className="w-3.5 h-3.5 text-[#bdc2ff] -rotate-12" />
          <span>Swipe left / right to compare plans</span>
        </div>

        {/* 1. Mobile View: Compact Auto-Centered Swipeable Carousel */}
        <div className="lg:hidden w-full flex gap-4 overflow-x-auto snap-x snap-mandatory pt-4 pb-6 px-[12.5%] sm:px-[20%] scrollbar-none items-stretch">
          {mobileTiers.map((tier) => (
            <div
              key={tier.id}
              className="w-[75vw] max-w-[280px] snap-center flex-shrink-0 flex"
            >
              {renderCard(tier)}
            </div>
          ))}
        </div>

        {/* 2. Desktop View (lg+): Original Grid */}
        <div className="hidden lg:grid w-full lg:grid-cols-3 gap-6 items-stretch">
          {desktopTiers.map((tier) => renderCard(tier))}
        </div>
      </div>
    </section>
  );
};