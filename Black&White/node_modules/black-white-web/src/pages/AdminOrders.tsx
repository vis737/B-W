// apps/web/src/pages/AdminOrders.tsx
import React, { useState } from 'react';
import { MOCK_ORDERS } from '../data/mockData';
import { useToast } from '../contexts/ToastContext';

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<typeof MOCK_ORDERS[0] | null>(null);
  const { showToast } = useToast();

  const handleUpdateStatus = (orderId: string, newStatus: any) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    showToast(`Order status updated to "${newStatus}".`, 'success', 'Order Updated');
  };

  const filteredOrders = orders.filter(
    (o) => selectedStatus === 'all' || o.status === selectedStatus
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
        <div>
          <span className="text-amber-400 font-mono text-xs uppercase tracking-widest">Fulfillment System</span>
          <h1 className="text-3xl font-serif font-black uppercase text-white">Orders Management</h1>
        </div>
        <div className="flex gap-2">
          {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded border ${
                selectedStatus === st ? 'bg-amber-400 text-black font-bold border-amber-400' : 'border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-xs font-mono text-zinc-300">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900 text-amber-400 uppercase">
              <th className="p-4">Order #</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Date</th>
              <th className="p-4">Total</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {filteredOrders.map((ord) => (
              <tr key={ord.id} className="hover:bg-zinc-900/50 transition-colors">
                <td className="p-4 font-bold text-white">{ord.order_number}</td>
                <td className="p-4">{ord.customer_id === 'cust-1' ? 'Alexander Sterling' : 'Client'}</td>
                <td className="p-4 text-zinc-500">{ord.created_at.split('T')[0]}</td>
                <td className="p-4 font-bold text-amber-400">${ord.total.toFixed(2)}</td>
                <td className="p-4">
                  <select
                    value={ord.status}
                    onChange={(e) => handleUpdateStatus(ord.id, e.target.value)}
                    className="bg-black border border-zinc-800 text-amber-400 font-bold text-xs p-1.5 rounded outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => setSelectedOrder(ord)}
                    className="px-3 py-1 bg-zinc-800 text-white rounded text-[11px] hover:bg-amber-400 hover:text-black font-bold uppercase transition-colors"
                  >
                    Inspect
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Inspect Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-xl max-w-lg w-full space-y-6">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
              <h3 className="font-serif font-bold text-lg uppercase text-white">Inspect Order {selectedOrder.order_number}</h3>
              <button onClick={() => setSelectedOrder(null)} className="text-zinc-500 hover:text-white">✕</button>
            </div>
            <div className="space-y-3 text-xs text-zinc-300 font-mono">
              <p><strong>Subtotal:</strong> ${selectedOrder.subtotal.toFixed(2)}</p>
              <p><strong>Shipping:</strong> ${selectedOrder.shipping_cost.toFixed(2)}</p>
              <p><strong>Tax:</strong> ${selectedOrder.tax_amount.toFixed(2)}</p>
              <p className="text-amber-400 font-bold"><strong>Total:</strong> ${selectedOrder.total.toFixed(2)}</p>
              {selectedOrder.notes && <p><strong>Notes:</strong> {selectedOrder.notes}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
