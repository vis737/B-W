// apps/web/src/pages/ComingSoonPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';

export const ComingSoonPage: React.FC = () => {
  return (
    <div className="bg-black text-white min-h-screen flex items-center justify-center p-6 text-center">
      <div className="max-w-xl space-y-6">
        <span className="text-amber-400 font-mono text-xs uppercase tracking-[0.4em] border border-amber-500/30 px-4 py-1.5 rounded backdrop-blur-md">
          Private Drop Invites
        </span>
        <h1 className="text-4xl md:text-6xl font-serif font-black uppercase tracking-tight text-white">
          Coming Soon
        </h1>
        <p className="text-zinc-400 text-sm font-light leading-relaxed">
          The Autumn Haute Parfumerie & Private Bespoke Collection is undergoing final hand-packaging at our Milanese atelier.
        </p>
        <div className="pt-4 flex justify-center gap-4">
          <Link to="/" className="px-8 py-3 bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-amber-400 transition-colors">
            Return Home &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonPage;
