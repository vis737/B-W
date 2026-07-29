// apps/web/src/pages/admin/AdminPaymentApprovals.tsx
import React, { useState } from 'react';
import { MOCK_BANK_RECEIPTS } from '../../data/mockData';
import { useToast } from '../../contexts/ToastContext';
import { PaymentStatus } from '@black-white/shared';

interface BankReceipt {
  id: string;
  order_id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  amount: number;
  currency: string;
  bank_name: string;
  transaction_reference: string;
  receipt_url: string;
  transfer_date: string;
  status: PaymentStatus;
  created_at: string;
}

export const AdminPaymentApprovals: React.FC = () => {
  const [receipts, setReceipts] = useState<BankReceipt[]>(MOCK_BANK_RECEIPTS as BankReceipt[]);
  const [selectedReceipt, setSelectedReceipt] = useState<BankReceipt | null>(null);
  const { showToast } = useToast();

  const handleApprove = (id: string) => {
    setReceipts((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'verified' as PaymentStatus } : r))
    );
    showToast('Bank transfer payment approved & order marked as paid.', 'success', 'Payment Verified');
    setSelectedReceipt(null);
  };

  const handleReject = (id: string) => {
    setReceipts((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'failed' as PaymentStatus } : r))
    );
    showToast('Bank transfer slip rejected. Client notified.', 'error', 'Payment Rejected');
    setSelectedReceipt(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
        <div>
          <span className="text-amber-400 font-mono text-xs uppercase tracking-widest">Finance Verification</span>
          <h1 className="text-3xl font-serif font-black uppercase text-white">Bank Transfer Receipts</h1>
        </div>
      </div>

      <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
        <table className="w-full text-left text-xs font-mono text-zinc-300">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900 text-amber-400 uppercase">
              <th className="p-4">Order #</th>
              <th className="p-4">Client Name</th>
              <th className="p-4">Bank Name</th>
              <th className="p-4">TRX Reference</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Review Receipt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {receipts.map((r) => (
              <tr key={r.id} className="hover:bg-zinc-900/50">
                <td className="p-4 font-bold text-white">{r.order_number}</td>
                <td className="p-4">{r.customer_name}</td>
                <td className="p-4">{r.bank_name}</td>
                <td className="p-4 text-zinc-400">{r.transaction_reference}</td>
                <td className="p-4 font-bold text-amber-400">${r.amount.toFixed(2)}</td>
                <td className="p-4">
                  <span
                    className={`px-2.5 py-0.5 text-[10px] uppercase font-bold rounded ${
                      r.status === 'verified'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : r.status === 'failed'
                        ? 'bg-red-950 text-red-400 border border-red-800'
                        : 'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}
                  >
                    {r.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => setSelectedReceipt(r)}
                    className="px-3 py-1 bg-amber-400 text-black text-[10px] font-bold uppercase rounded hover:bg-white transition-colors"
                  >
                    View Slip
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Slip Viewer Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-xl max-w-lg w-full space-y-6">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
              <h3 className="font-serif font-bold text-lg uppercase text-white">Bank Slip Verification</h3>
              <button onClick={() => setSelectedReceipt(null)} className="text-zinc-500 hover:text-white">✕</button>
            </div>
            <div className="space-y-4">
              <div className="h-64 rounded bg-zinc-900 border border-zinc-800 overflow-hidden">
                <img src={selectedReceipt.receipt_url} alt="Bank Slip" className="w-full h-full object-cover" />
              </div>
              <div className="text-xs font-mono text-zinc-300 space-y-1">
                <p><strong>Ref:</strong> {selectedReceipt.transaction_reference}</p>
                <p><strong>Transfer Date:</strong> {selectedReceipt.transfer_date}</p>
                <p><strong>Amount:</strong> ${selectedReceipt.amount.toFixed(2)}</p>
              </div>
              <div className="flex gap-4 pt-2">
                <button
                  onClick={() => handleReject(selectedReceipt.id)}
                  className="flex-1 py-3 bg-red-950 text-red-400 border border-red-800 rounded font-bold text-xs uppercase hover:bg-red-900"
                >
                  Reject Receipt
                </button>
                <button
                  onClick={() => handleApprove(selectedReceipt.id)}
                  className="flex-1 py-3 bg-emerald-500 text-black rounded font-bold text-xs uppercase hover:bg-white"
                >
                  Approve Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPaymentApprovals;
