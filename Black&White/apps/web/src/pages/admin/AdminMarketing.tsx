// apps/web/src/pages/admin/AdminMarketing.tsx
import React, { useState } from 'react';
import { useToast } from '../../contexts/ToastContext';

export const AdminMarketing: React.FC = () => {
  const [subscribers] = useState([
    { email: 'alexander.sterling@luxury.com', date: '2025-11-04', tier: 'Platinum' },
    { email: 'lord.pendelton@mayfair.co.uk', date: '2026-02-18', tier: 'Gold' }
  ]);
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const { showToast } = useToast();

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(`Dispatched gazette newsletter to ${subscribers.length} patrons.`, 'success', 'Broadcast Sent');
    setSubject('');
    setContent('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
        <div>
          <span className="text-amber-400 font-mono text-xs uppercase tracking-widest">Patron Gazette</span>
          <h1 className="text-3xl font-serif font-black uppercase text-white">Newsletter & Marketing</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 bg-zinc-950 border border-zinc-800 p-6 rounded-xl space-y-4">
          <h2 className="font-serif font-bold text-lg uppercase text-white">Create Broadcast Gazette</h2>
          <form onSubmit={handleBroadcast} className="space-y-4 text-xs font-sans">
            <div>
              <label className="text-zinc-400 uppercase font-mono text-[10px] block mb-1">Email Subject Line</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Exclusive Invitation: Autumn Haute Couture Trunk Show"
                className="w-full bg-black border border-zinc-800 p-2.5 rounded text-white outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="text-zinc-400 uppercase font-mono text-[10px] block mb-1">Gazette Body</label>
              <textarea
                rows={6}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Honored Patrons, we are delighted to invite you..."
                className="w-full bg-black border border-zinc-800 p-3 rounded text-white outline-none focus:border-amber-400"
              />
            </div>
            <button type="submit" className="w-full py-3 bg-amber-400 text-black font-bold uppercase text-xs tracking-widest rounded hover:bg-white transition-colors">
              Dispatch Campaign Broadcast
            </button>
          </form>
        </div>

        <div className="lg:col-span-5 bg-zinc-950 border border-zinc-800 p-6 rounded-xl space-y-4">
          <h2 className="font-serif font-bold text-lg uppercase text-white">Subscribers List ({subscribers.length})</h2>
          <div className="space-y-2">
            {subscribers.map((sub, i) => (
              <div key={i} className="p-3 bg-black border border-zinc-800 rounded flex justify-between text-xs">
                <div>
                  <span className="font-mono text-white block">{sub.email}</span>
                  <span className="text-zinc-500 text-[10px]">Joined {sub.date}</span>
                </div>
                <span className="text-amber-400 font-mono font-bold text-[10px] uppercase">{sub.tier}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMarketing;
