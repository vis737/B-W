// apps/web/src/pages/admin/AdminCoupons.tsx
import React, { useState } from 'react';
import { MOCK_COUPONS } from '../../data/mockData';
import { useToast } from '../../contexts/ToastContext';

export const AdminCoupons: React.FC = () => {
  const [coupons, setCoupons] = useState(MOCK_COUPONS);
  const [showModal, setShowModal] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newValue, setNewValue] = useState('20');
  const { showToast } = useToast();

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const created = {
      id: `coup-${Date.now()}`,
      code: newCode.toUpperCase() || 'AUTUMN20',
      type: 'percentage' as const,
      value: parseFloat(newValue) || 20,
      min_order_amount: 200,
      used_count: 0,
      usage_limit: 500,
      starts_at: '2026-07-24',
      expires_at: '2026-12-31',
      is_active: true,
      created_at: new Date().toISOString()
    };
    setCoupons([created, ...coupons]);
    showToast(`Created voucher "${created.code}".`, 'success', 'Coupon Issued');
    setShowModal(false);
    setNewCode('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
        <div>
          <span className="text-amber-400 font-mono text-xs uppercase tracking-widest">Promotional Engine</span>
          <h1 className="text-3xl font-serif font-black uppercase text-white">Coupons & Gift Cards</h1>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 bg-amber-400 text-black font-bold text-xs uppercase tracking-widest rounded hover:bg-white transition-colors"
        >
          + Issue New Coupon
        </button>
      </div>

      <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-xs font-mono text-zinc-300">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900 text-amber-400 uppercase">
              <th className="p-4">Code</th>
              <th className="p-4">Type & Value</th>
              <th className="p-4">Min Spend</th>
              <th className="p-4">Redemptions</th>
              <th className="p-4">Expiry Date</th>
              <th className="p-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {coupons.map((c) => (
              <tr key={c.id} className="hover:bg-zinc-900/50">
                <td className="p-4 font-bold text-amber-400">{c.code}</td>
                <td className="p-4 text-white font-bold">{c.value}% OFF</td>
                <td className="p-4">${c.min_order_amount || 0}</td>
                <td className="p-4">{c.used_count} times</td>
                <td className="p-4 text-zinc-500">{c.expires_at}</td>
                <td className="p-4 text-right">
                  <span className="px-2.5 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] uppercase font-bold rounded">
                    Active
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-xl max-w-md w-full space-y-4">
            <h3 className="font-serif font-bold text-lg uppercase text-white">Create Promotional Voucher</h3>
            <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
              <div>
                <label className="text-zinc-400 uppercase font-mono text-[10px] block mb-1">Coupon Code</label>
                <input
                  type="text"
                  required
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  placeholder="e.g. VIP50"
                  className="w-full bg-black border border-zinc-800 p-2.5 rounded text-white outline-none"
                />
              </div>
              <div>
                <label className="text-zinc-400 uppercase font-mono text-[10px] block mb-1">Discount %</label>
                <input
                  type="number"
                  required
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  className="w-full bg-black border border-zinc-800 p-2.5 rounded text-white outline-none"
                />
              </div>
              <button type="submit" className="w-full py-3 bg-amber-400 text-black font-bold uppercase tracking-widest rounded">
                Issue Voucher
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCoupons;
