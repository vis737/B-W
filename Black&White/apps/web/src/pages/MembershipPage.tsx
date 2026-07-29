// apps/web/src/pages/MembershipPage.tsx
import React, { useState } from 'react';
import { MEMBERSHIP_TIERS, GENTLEMEN_SUBSCRIPTION_PLANS, MembershipTier } from '@black-white/shared';
import { DigitalMembershipCard } from '../components/loyalty/DigitalMembershipCard';
import { useToast } from '../contexts/ToastContext';

export const MembershipPage: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [selectedTier, setSelectedTier] = useState<MembershipTier>('gold');
  const { showToast } = useToast();

  const tiers = Object.values(MEMBERSHIP_TIERS);
  const plans = Object.values(GENTLEMEN_SUBSCRIPTION_PLANS);

  const handleSubscribe = (planName: string, price: number) => {
    showToast(
      `Subscribed to "${planName}" (${billingCycle.toUpperCase()} - $${price.toLocaleString()}). Welcome to the Gentlemen's Atelier Club!`,
      'success',
      'Subscription Activated'
    );
  };

  return (
    <div className="bg-white text-black min-h-screen pt-8 pb-24">
      {/* Hero Banner with High Contrast B&W */}
      <div className="border-b-2 border-black bg-zinc-50 py-16 px-6 text-center">
        <div className="container mx-auto max-w-4xl space-y-8">
          <div>
            <span className="px-4 py-1.5 bg-black text-white text-xs font-mono font-bold uppercase tracking-[0.3em] rounded-full">
              Gentlemen Only Atelier Club
            </span>
            <h1 className="text-4xl md:text-6xl font-serif font-black uppercase tracking-tight text-black mt-4 mb-4">
              The Gentleman's Privilege & Subscription
            </h1>
            <p className="text-zinc-600 text-base md:text-lg font-light leading-relaxed max-w-2xl mx-auto">
              Exclusively engineered for the modern gentleman. Join our bespoke wardrobe subscription box or elevate your patron loyalty level across Silver, Gold, Platinum, and Diamond tiers.
            </p>
          </div>

          {/* Digital Membership Pass Card Preview */}
          <div className="pt-2">
            <DigitalMembershipCard
              customerName="Lord Harrison Vance"
              customerId="bw-gentleman-9842"
              tier={selectedTier}
              lifetimeSpending={3450}
              rewardPoints={1250}
              onTierChange={setSelectedTier}
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 max-w-6xl mt-20 space-y-24">
        {/* SECTION 1: GENTLEMAN'S BESPOKE SUBSCRIPTION PLANS */}
        <section className="space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-amber-600 font-bold">
              Bespoke Wardrobe Delivery
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-black uppercase text-black">
              Gentlemen's Subscription Boxes
            </h2>
            <p className="text-zinc-600 text-sm max-w-xl mx-auto">
              Receive hand-crafted Italian suits, Sea Island cotton shirts, and curated leather goods delivered on your schedule with custom master tailor sizing.
            </p>

            {/* Monthly / Annual Billing Toggle */}
            <div className="flex justify-center items-center gap-4 pt-4">
              <span className={`text-xs font-mono uppercase ${billingCycle === 'monthly' ? 'text-black font-bold' : 'text-zinc-400'}`}>
                Monthly Billing
              </span>
              <button
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
                className="w-14 h-8 rounded-full bg-black p-1 transition-colors relative cursor-pointer"
              >
                <div
                  className={`w-6 h-6 rounded-full bg-white transition-transform duration-300 ${
                    billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
              <span className={`text-xs font-mono uppercase flex items-center gap-1 ${billingCycle === 'annual' ? 'text-black font-bold' : 'text-zinc-400'}`}>
                Annual Billing <span className="text-[10px] px-2 py-0.5 bg-amber-500 text-white rounded font-mono font-bold">Save 20%</span>
              </span>
            </div>
          </div>

          {/* Subscription Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => {
              const price = billingCycle === 'annual' ? plan.price_annual : plan.price_monthly;
              const isPopular = plan.id === 'plan_vip';

              return (
                <div
                  key={plan.id}
                  className={`relative p-8 rounded-2xl border-2 transition-all duration-300 hover-lift flex flex-col justify-between ${
                    isPopular
                      ? 'border-black bg-black text-white shadow-2xl scale-105'
                      : 'border-zinc-300 bg-white text-black hover:border-black shadow-lg'
                  }`}
                >
                  {isPopular && (
                    <span className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-amber-500 text-black font-mono text-[10px] uppercase font-black tracking-widest rounded-full shadow">
                      ★ Most Preferred by Gentlemen
                    </span>
                  )}

                  <div className="space-y-6">
                    <div>
                      <h3 className="font-serif text-2xl font-black uppercase mb-1">{plan.name}</h3>
                      <p className={`text-xs font-mono ${isPopular ? 'text-zinc-400' : 'text-zinc-500'}`}>
                        {plan.deliveries}
                      </p>
                    </div>

                    <div className="pb-4 border-b border-current opacity-20">
                      <div className="flex items-baseline gap-1 font-mono">
                        <span className="text-4xl font-bold">${price.toLocaleString()}</span>
                        <span className="text-xs uppercase font-medium">/{billingCycle === 'annual' ? 'year' : 'month'}</span>
                      </div>
                      <div className="text-[11px] font-sans mt-2 font-medium opacity-90">
                        📦 Includes: {plan.items_included}
                      </div>
                    </div>

                    <ul className="space-y-3 text-xs font-sans">
                      {plan.benefits.map((b, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <span className={isPopular ? 'text-amber-400 font-bold' : 'text-black font-bold'}>✓</span>
                          <span className={isPopular ? 'text-zinc-200' : 'text-zinc-700'}>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => handleSubscribe(plan.name, price)}
                    className={`w-full py-4 mt-8 font-mono text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-300 focus:outline-none ${
                      isPopular
                        ? 'bg-amber-500 text-black hover:bg-white'
                        : 'bg-black text-white hover:bg-amber-500 hover:text-black'
                    }`}
                  >
                    Subscribe Gentlemen Box
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 2: GENTLEMEN LOYALTY LEVEL MATRIX */}
        <section className="space-y-12 bg-zinc-900 text-white rounded-3xl p-8 md:p-12 border-2 border-black shadow-2xl">
          <div className="text-center space-y-3">
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-amber-400 font-bold">
              Level Progression
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-black uppercase text-white">
              Gentleman Loyalty Tiers
            </h2>
            <p className="text-zinc-400 text-sm max-w-xl mx-auto font-light">
              Every purchase elevates your gentleman status across Silver, Gold, Platinum, and Diamond levels.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tiers.map((t) => (
              <div
                key={t.tier}
                onClick={() => setSelectedTier(t.tier as MembershipTier)}
                className={`p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-6 ${
                  selectedTier === t.tier
                    ? 'border-amber-400 bg-black shadow-2xl scale-105'
                    : 'border-zinc-800 bg-zinc-950/80 hover:border-zinc-600'
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
                      {t.tier} Gentleman
                    </span>
                    <span className="text-white font-mono font-bold text-xs">{t.discount_percentage}% OFF</span>
                  </div>
                  <h3 className="font-serif text-2xl font-black uppercase text-white mb-1">{t.tier} Level</h3>
                  <p className="text-[11px] font-mono text-zinc-400 mb-6">
                    Lifetime Spend: ${t.min_lifetime_spending.toLocaleString()}
                  </p>

                  <ul className="space-y-2.5 text-xs font-sans text-zinc-300 font-light border-t border-zinc-800 pt-4">
                    {t.benefits.map((b, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-amber-400 font-bold">•</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  className={`w-full py-3 text-center text-xs font-mono font-bold uppercase tracking-widest rounded-xl transition-colors ${
                    selectedTier === t.tier
                      ? 'bg-amber-400 text-black'
                      : 'bg-zinc-800 text-white hover:bg-zinc-700'
                  }`}
                >
                  {selectedTier === t.tier ? 'Active Level' : 'Select Level'}
                </button>
              </div>
            ))}
          </div>

          {/* Privilege Comparison Matrix */}
          <div className="bg-black border border-zinc-800 p-8 rounded-2xl space-y-6">
            <h3 className="font-serif font-black text-xl uppercase tracking-wider text-white">
              Gentleman Privilege Comparison Matrix
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono text-zinc-300">
                <thead>
                  <tr className="border-b border-zinc-800 text-amber-400 font-mono uppercase">
                    <th className="pb-4">Gentleman Privilege</th>
                    <th className="pb-4">Silver ($0+)</th>
                    <th className="pb-4">Gold ($1,000+)</th>
                    <th className="pb-4">Platinum ($3,000+)</th>
                    <th className="pb-4">Diamond ($7,500+)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  <tr><td className="py-3.5 font-bold text-white">Catalog Discount</td><td>5%</td><td>10%</td><td>15%</td><td className="text-amber-400 font-bold">20%</td></tr>
                  <tr><td className="py-3.5 font-bold text-white">Reward Multiplier</td><td>1.0x</td><td>1.5x</td><td>2.0x</td><td className="text-amber-400 font-bold">3.0x</td></tr>
                  <tr><td className="py-3.5 font-bold text-white">Private Tailor Home Visit</td><td>—</td><td>—</td><td>1 / year</td><td className="text-amber-400 font-bold">Unlimited Visits</td></tr>
                  <tr><td className="py-3.5 font-bold text-white">Bespoke Alterations</td><td>Standard</td><td>Free Sizing</td><td>Free Lifetime</td><td className="text-amber-400 font-bold">Free Master Alterations</td></tr>
                  <tr><td className="py-3.5 font-bold text-white">Dedicated Concierge</td><td>—</td><td>—</td><td>✓</td><td className="text-amber-400 font-bold">24/7 Private Concierge</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MembershipPage;
