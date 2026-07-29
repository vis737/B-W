// apps/web/src/pages/MaintenancePage.tsx
import React from 'react';

export const MaintenancePage: React.FC = () => {
  return (
    <div className="bg-black text-white min-h-screen flex items-center justify-center p-6 text-center">
      <div className="max-w-xl space-y-6">
        <span className="text-amber-400 font-mono text-xs uppercase tracking-[0.4em] border border-amber-500/30 px-4 py-1.5 rounded backdrop-blur-md">
          System Maintenance
        </span>
        <h1 className="text-4xl md:text-5xl font-serif font-black uppercase tracking-tight text-white">
          Scheduled Upgrades
        </h1>
        <p className="text-zinc-400 text-sm font-light leading-relaxed">
          The Black & White platform is currently executing scheduled infrastructure updates. Concierge support and VIP order processing remain operational.
        </p>
        <p className="text-xs font-mono text-zinc-500">Estimated Duration: ~15 Minutes</p>
      </div>
    </div>
  );
};

export default MaintenancePage;
