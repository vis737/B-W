// apps/web/src/pages/admin/AdminReviews.tsx
import React, { useState } from 'react';
import { MOCK_REVIEWS } from '../../data/mockData';
import { useToast } from '../../contexts/ToastContext';

export const AdminReviews: React.FC = () => {
  const [reviews, setReviews] = useState(MOCK_REVIEWS);
  const { showToast } = useToast();

  const handleToggleApprove = (id: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, is_approved: !r.is_approved } : r))
    );
    showToast('Review moderation state toggled.', 'info', 'Review Moderated');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
        <div>
          <span className="text-amber-400 font-mono text-xs uppercase tracking-widest">Reputation Control</span>
          <h1 className="text-3xl font-serif font-black uppercase text-white">Reviews Moderation</h1>
        </div>
      </div>

      <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-xs font-mono text-zinc-300">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900 text-amber-400 uppercase">
              <th className="p-4">Customer</th>
              <th className="p-4">Rating</th>
              <th className="p-4">Review Title</th>
              <th className="p-4">Verified Tag</th>
              <th className="p-4">Approval</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {reviews.map((r) => (
              <tr key={r.id} className="hover:bg-zinc-900/50">
                <td className="p-4 font-bold text-white">{r.customer_name}</td>
                <td className="p-4 text-amber-400 font-bold">{'★'.repeat(r.rating)}</td>
                <td className="p-4 text-zinc-300 font-bold">{r.title}</td>
                <td className="p-4">
                  <span className="px-2 py-0.5 bg-amber-400/20 text-amber-400 text-[10px] uppercase font-bold rounded">
                    {r.is_verified_purchase ? 'Verified Purchase' : 'Guest'}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-2.5 py-0.5 text-[10px] uppercase font-bold rounded ${r.is_approved ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-red-950 text-red-400 border border-red-800'}`}>
                    {r.is_approved ? 'Approved' : 'Pending'}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => handleToggleApprove(r.id)}
                    className="px-3 py-1 bg-zinc-800 text-amber-400 font-bold rounded text-[10px] uppercase hover:bg-amber-400 hover:text-black transition-colors"
                  >
                    {r.is_approved ? 'Unpublish' : 'Approve & Publish'}
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

export default AdminReviews;
