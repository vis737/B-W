// apps/web/src/pages/AdminDashboard.tsx
import React from 'react';
import { MOCK_ORDERS, MOCK_PRODUCTS } from '../data/mockData';

export const AdminDashboard: React.FC = () => {
  const totalRevenue = MOCK_ORDERS.reduce((acc, o) => acc + o.total, 0);
  const totalOrders = MOCK_ORDERS.length;
  const pendingOrders = MOCK_ORDERS.filter((o) => (o.status as string) === 'processing' || (o.status as string) === 'pending').length;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
        <div>
          <span className="text-amber-400 font-mono text-xs uppercase tracking-widest">Executive Portal</span>
          <h1 className="text-3xl font-serif font-black uppercase text-white">Analytics Overview</h1>
        </div>
        <div className="text-xs font-mono text-zinc-500">
          Last Synced: <span className="text-emerald-400 font-bold">Live Realtime</span>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-xl space-y-2">
          <span className="text-xs font-mono text-zinc-500 uppercase">Gross Revenue</span>
          <h2 className="text-3xl font-mono font-bold text-white">${totalRevenue.toLocaleString()}</h2>
          <span className="text-[10px] text-emerald-400 font-mono">↑ 18.4% vs last month</span>
        </div>

        <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-xl space-y-2">
          <span className="text-xs font-mono text-zinc-500 uppercase">Total Orders</span>
          <h2 className="text-3xl font-mono font-bold text-white">{totalOrders}</h2>
          <span className="text-[10px] text-amber-400 font-mono">{pendingOrders} Pending Fulfillment</span>
        </div>

        <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-xl space-y-2">
          <span className="text-xs font-mono text-zinc-500 uppercase">Active Products</span>
          <h2 className="text-3xl font-mono font-bold text-white">{MOCK_PRODUCTS.length}</h2>
          <span className="text-[10px] text-zinc-400 font-mono">35 Categories Configured</span>
        </div>

        <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-xl space-y-2">
          <span className="text-xs font-mono text-zinc-500 uppercase">Platinum / Diamond VIPs</span>
          <h2 className="text-3xl font-mono font-bold text-amber-400">142</h2>
          <span className="text-[10px] text-emerald-400 font-mono">84% Retention Rate</span>
        </div>
      </div>

      {/* Sales Chart Mock & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-zinc-950 border border-zinc-800 p-6 rounded-xl space-y-4">
          <h3 className="font-serif font-bold text-lg uppercase text-white">Monthly Sales Breakdown ($)</h3>
          <div className="h-64 flex items-end justify-between gap-4 border-b border-zinc-800 pb-4 pt-10">
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'].map((m, idx) => {
              const heights = ['h-24', 'h-32', 'h-40', 'h-28', 'h-48', 'h-56', 'h-60'];
              return (
                <div key={m} className="flex-1 flex flex-col items-center gap-2">
                  <div className={`w-full bg-amber-400/80 rounded-t ${heights[idx]} transition-all hover:bg-amber-400`} />
                  <span className="text-xs font-mono text-zinc-500">{m}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-4 bg-zinc-950 border border-zinc-800 p-6 rounded-xl space-y-4">
          <h3 className="font-serif font-bold text-lg uppercase text-white">Fulfillment Monitor</h3>
          <div className="space-y-3">
            {MOCK_ORDERS.map((ord) => (
              <div key={ord.id} className="p-3 bg-black border border-zinc-800 rounded flex justify-between items-center text-xs">
                <div>
                  <span className="font-mono text-white font-bold block">{ord.order_number}</span>
                  <span className="text-zinc-500">{ord.created_at.split('T')[0]}</span>
                </div>
                <span className="px-2 py-0.5 bg-amber-400/20 text-amber-400 font-mono font-bold text-[10px] uppercase rounded">
                  {ord.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
