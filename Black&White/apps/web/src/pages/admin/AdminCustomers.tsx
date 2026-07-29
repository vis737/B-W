// apps/web/src/pages/admin/AdminCustomers.tsx
import React, { useState, useEffect } from 'react';
import { MOCK_CUSTOMER } from '../../data/mockData';
import { useToast } from '../../contexts/ToastContext';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

interface CustomerRecord {
  id: string;
  full_name: string;
  email: string;
  customer_id: string;
  lifetime_spending: number;
  reward_points: number;
  membership_tier: string;
}

export const AdminCustomers: React.FC = () => {
  const { customer: currentCustomer } = useAuth();
  const { showToast } = useToast();
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCustomers() {
      setIsLoading(true);
      const defaultList: CustomerRecord[] = [
        {
          id: MOCK_CUSTOMER.id,
          full_name: MOCK_CUSTOMER.full_name,
          email: MOCK_CUSTOMER.email,
          customer_id: MOCK_CUSTOMER.customer_id,
          lifetime_spending: MOCK_CUSTOMER.lifetime_spending,
          reward_points: MOCK_CUSTOMER.reward_points,
          membership_tier: MOCK_CUSTOMER.membership_tier,
        },
        {
          id: 'cust-2',
          full_name: 'Julian Vance',
          email: 'julian.vance@luxury.com',
          customer_id: 'BW-CUST-99210',
          lifetime_spending: 8400,
          reward_points: 840,
          membership_tier: 'diamond',
        },
      ];

      // If current logged-in customer exists, prepend them to list if not already present
      if (currentCustomer) {
        const loggedInRecord: CustomerRecord = {
          id: currentCustomer.id,
          full_name: currentCustomer.name || currentCustomer.email.split('@')[0],
          email: currentCustomer.email,
          customer_id: currentCustomer.customer_id || `BW-VIP-${currentCustomer.id.slice(-4).toUpperCase()}`,
          lifetime_spending: 2500,
          reward_points: 250,
          membership_tier: currentCustomer.membership_tier || 'platinum',
        };

        if (!defaultList.some((c) => c.email.toLowerCase() === currentCustomer.email.toLowerCase())) {
          defaultList.unshift(loggedInRecord);
        }
      }

      // Try fetching live users from Supabase Postgres database
      if (supabase) {
        try {
          const { data, error } = await supabase.from('users').select('*');
          if (!error && data && data.length > 0) {
            const mappedSupabaseUsers: CustomerRecord[] = data.map((u: any) => ({
              id: u.id || u.clerk_id,
              full_name: `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.email.split('@')[0],
              email: u.email,
              customer_id: u.customer_id || `BW-CUST-${u.id.slice(-4).toUpperCase()}`,
              lifetime_spending: u.lifetime_spending || 1200,
              reward_points: u.reward_points || 120,
              membership_tier: u.membership_tier || 'gold',
            }));

            // Merge Supabase users with default list, ensuring unique emails
            const merged = [...mappedSupabaseUsers];
            defaultList.forEach((c) => {
              if (!merged.some((m) => m.email.toLowerCase() === c.email.toLowerCase())) {
                merged.push(c);
              }
            });

            setCustomers(merged);
            setIsLoading(false);
            return;
          }
        } catch (err) {
          console.error('Failed to fetch customers from Supabase:', err);
        }
      }

      setCustomers(defaultList);
      setIsLoading(false);
    }

    loadCustomers();
  }, [currentCustomer]);

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
        {isLoading ? (
          <div className="p-8 text-center text-zinc-400 font-mono text-xs animate-pulse">
            Loading client records from Supabase...
          </div>
        ) : (
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
                  <td className="p-4 font-bold text-white flex items-center gap-2">
                    <span>{c.full_name}</span>
                    {currentCustomer && currentCustomer.email.toLowerCase() === c.email.toLowerCase() && (
                      <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[9px] uppercase font-bold rounded">
                        Logged In
                      </span>
                    )}
                  </td>
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
        )}
      </div>
    </div>
  );
};

export default AdminCustomers;
