// apps/web/src/pages/admin/AdminCustomers.tsx
import React, { useState } from 'react';
import { MOCK_CUSTOMER } from '../../data/mockData';
import { useToast } from '../../contexts/ToastContext';

export const AdminCustomers: React.FC = () => {
  const [customers, setCustomers] = useState([
    MOCK_CUSTOMER,
    {
      id: 'cust-2',
      role: 'customer' as const,
      full_name: 'Julian Vance',
      email: 'julian.vance@luxury.com',
      mobile_number: '+1 (555) 881-2291',
      customer_id: 'BW-CUST-99210',
      registration_date: '2026-01-12',
      lifetime_spending: 8400,
      reward_points: 840,
      membership_tier: 'diamond' as const,
      created_at: '2026-01-12T00:00:00Z',
      updated_at: '2026-07-24T00:00:00Z'
    }
  ]);
  const { showToast } = useToast();

  const handleAdjustPoints = (id: string, delta: number) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, reward_points: Math.max(0, c.reward_points + delta) } : c))
    );
    showToast('Customer reward points adjusted.', 'success', 'Points Updated');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
        <div>
          <span className="text-amber-400 font-mono text-xs uppercase tracking-widest">Client Records</span>
          <h1 className="text-3xl font-serif font-black uppercase text-white">Customers & Memberships</h1>
        </div>
      </div>

      <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-xs font-mono text-zinc-300">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900 text-amber-400 uppercase">
              <th className="p-4">Customer Name</th>
              <th className="p-4">Email / ID</th>
              <th className="p-4">Lifetime Spend</th>
              <th className="p-4">Points</th>
              <th className="p-4">Membership Tier</th>
              <th className="p-4 text-right">Adjust Points</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {customers.map((c) => (
              <tr key={c.id} className="hover:bg-zinc-900/50">
                <td className="p-4 font-bold text-white">{c.full_name}</td>
                <td className="p-4 text-zinc-400">{c.email} ({c.customer_id})</td>
                <td className="p-4 font-bold text-white">${c.lifetime_spending.toLocaleString()}</td>
                <td className="p-4 text-amber-400 font-bold">{c.reward_points} pts</td>
                <td className="p-4">
                  <span className="px-2.5 py-0.5 bg-amber-400/20 text-amber-400 border border-amber-400/40 text-[10px] uppercase font-bold rounded">
                    {c.membership_tier}
                  </span>
                </td>
                <td className="p-4 text-right space-x-2">
                  <button
                    onClick={() => handleAdjustPoints(c.id, 100)}
                    className="px-3 py-1 bg-amber-400 text-black font-bold rounded text-[10px] uppercase hover:bg-white"
                  >
                    +100 Points
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCustomers;
