// apps/web/src/components/loyalty/DigitalMembershipCard.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MembershipTier, MEMBERSHIP_TIERS } from '@black-white/shared';

interface DigitalMembershipCardProps {
  customerName: string;
  customerId: string;
  tier: MembershipTier;
  lifetimeSpending: number;
  rewardPoints: number;
  onTierChange?: (newTier: MembershipTier) => void;
}

const TIER_ORDER: MembershipTier[] = ['silver', 'gold', 'platinum', 'diamond'];

export const DigitalMembershipCard: React.FC<DigitalMembershipCardProps> = ({
  customerName,
  customerId,
  tier: initialTier,
  lifetimeSpending,
  rewardPoints,
  onTierChange,
}) => {
  const [activeTier, setActiveTier] = useState<MembershipTier>(initialTier);
  const currentTierInfo = MEMBERSHIP_TIERS[activeTier] || MEMBERSHIP_TIERS.silver;

  const currentTierIndex = TIER_ORDER.indexOf(activeTier);
  const nextTierKey = TIER_ORDER[currentTierIndex + 1] as MembershipTier | undefined;
  const nextTierInfo = nextTierKey ? MEMBERSHIP_TIERS[nextTierKey] : null;

  let progressPercentage = 100;
  let remainingSpend = 0;

  if (nextTierInfo) {
    const currentMin = currentTierInfo.min_lifetime_spending;
    const nextMin = nextTierInfo.min_lifetime_spending;
    const spentInTier = Math.max(0, lifetimeSpending - currentMin);
    const tierRange = Math.max(1, nextMin - currentMin);
    progressPercentage = Math.min(100, Math.round((spentInTier / tierRange) * 100));
    remainingSpend = Math.max(0, nextMin - lifetimeSpending);
  }

  const handleSelectTier = (t: MembershipTier) => {
    setActiveTier(t);
    if (onTierChange) onTierChange(t);
  };

  // High-contrast Black & White luxury card themes for Gentlemen
  const cardStyles: Record<MembershipTier, string> = {
    silver: 'bg-white text-black border-2 border-black shadow-[0_15px_35px_rgba(0,0,0,0.12)]',
    gold: 'bg-gradient-to-br from-amber-500 via-amber-400 to-amber-600 text-black border-2 border-black shadow-[0_20px_40px_rgba(217,119,6,0.3)]',
    platinum: 'bg-black text-white border-2 border-zinc-400 shadow-[0_20px_40px_rgba(0,0,0,0.4)]',
    diamond: 'bg-gradient-to-tr from-black via-zinc-900 to-black text-white border-2 border-amber-400 shadow-[0_25px_50px_rgba(245,158,11,0.35)]',
  };

  return (
    <div className="space-y-6">
      {/* Gentlemen Level Selection Pills */}
      <div className="flex justify-center flex-wrap gap-2 max-w-md mx-auto">
        {TIER_ORDER.map((t) => {
          const isSelected = activeTier === t;
          return (
            <button
              key={t}
              onClick={() => handleSelectTier(t)}
              className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-widest transition-all duration-300 ${
                isSelected
                  ? 'bg-black text-white border-2 border-black shadow-md scale-105'
                  : 'bg-zinc-100 text-zinc-600 border border-zinc-300 hover:bg-zinc-200'
              }`}
            >
              {t} Level
            </button>
          );
        })}
      </div>

      {/* 3D Membership Digital Card */}
      <motion.div
        key={activeTier}
        initial={{ rotateY: -10, opacity: 0, scale: 0.95 }}
        animate={{ rotateY: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        whileHover={{ scale: 1.03, rotateY: 3 }}
        className={`relative w-full max-w-md mx-auto aspect-[1.586/1] rounded-2xl p-6 md:p-8 ${cardStyles[activeTier]} flex flex-col justify-between overflow-hidden transition-all duration-500 hover-lift`}
      >
        {/* Background Emblem Watermark */}
        <div className="absolute -right-8 -bottom-8 opacity-10 text-9xl font-serif select-none pointer-events-none">
          ❖
        </div>

        {/* Top Header */}
        <div className="flex justify-between items-start z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-amber-500 text-lg font-black">❖</span>
              <span className="font-serif font-black uppercase tracking-widest text-sm md:text-base">
                Black & White
              </span>
            </div>
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] opacity-75 block mt-0.5 font-bold">
              Gentleman's Atelier Pass
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest border border-current opacity-90 backdrop-blur-md">
              {activeTier} Patron
            </span>
          </div>
        </div>

        {/* Card Number & Chip */}
        <div className="z-10 my-auto">
          <div className="w-10 h-7 rounded bg-amber-500/20 border border-amber-500/60 mb-3 flex items-center justify-center">
            <div className="w-6 h-4 border border-amber-500/80 rounded-xs grid grid-cols-2 gap-0.5 p-0.5">
              <div className="bg-amber-500/60" />
              <div className="bg-amber-500/60" />
            </div>
          </div>
          <div className="font-mono text-sm md:text-lg tracking-[0.25em] font-bold">
            BW • {customerId.toUpperCase().slice(0, 4)} • 9842 • {activeTier.toUpperCase().slice(0, 3)}
          </div>
        </div>

        {/* Footer info */}
        <div className="flex justify-between items-end z-10">
          <div>
            <div className="text-[9px] font-mono uppercase tracking-widest opacity-75 font-bold">Gentleman Patron</div>
            <div className="font-serif font-black text-sm md:text-base tracking-wider uppercase">
              {customerName}
            </div>
          </div>

          <div className="text-right">
            <div className="text-[9px] font-mono uppercase tracking-widest opacity-75 font-bold">Reward Balance</div>
            <div className="font-mono font-bold text-sm md:text-base text-amber-500">
              {rewardPoints.toLocaleString()} PTS
            </div>
          </div>
        </div>
      </motion.div>

      {/* Progress to Next Tier */}
      <div className="max-w-md mx-auto bg-white border-2 border-black rounded-xl p-5 space-y-3 shadow-md">
        <div className="flex justify-between items-center text-xs font-mono">
          <span className="text-black font-bold uppercase tracking-widest">Gentleman Level Progress</span>
          <span className="text-amber-600 font-bold">{progressPercentage}% Complete</span>
        </div>

        <div className="w-full h-2.5 bg-zinc-200 rounded-full overflow-hidden border border-zinc-300">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full bg-black rounded-full"
          />
        </div>

        {nextTierInfo ? (
          <div className="text-xs text-zinc-700 font-serif text-center pt-1">
            Spend <span className="text-black font-mono font-bold">${remainingSpend.toLocaleString()}</span> more to unlock{' '}
            <span className="text-black font-bold uppercase tracking-wider">{nextTierInfo.tier} Gentleman</span> status & {nextTierInfo.discount_percentage}% off all custom menswear.
          </div>
        ) : (
          <div className="text-xs text-amber-600 font-serif text-center pt-1 font-bold">
            👑 You hold Diamond Patron status—our ultimate level of bespoke menswear privilege!
          </div>
        )}
      </div>

      {/* Tier Benefits */}
      <div className="max-w-md mx-auto bg-zinc-50 border border-zinc-300 rounded-xl p-5 space-y-3 shadow-sm">
        <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-black font-bold border-b border-zinc-300 pb-2">
          {currentTierInfo.tier.toUpperCase()} Gentleman Privileges
        </h4>
        <ul className="space-y-2">
          {currentTierInfo.benefits.map((benefit, idx) => (
            <li key={idx} className="flex items-center gap-2.5 text-xs text-zinc-800 font-medium">
              <span className="text-amber-500 font-black">❖</span>
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
