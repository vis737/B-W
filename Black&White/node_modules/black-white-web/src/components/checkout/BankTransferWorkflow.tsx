// apps/web/src/components/checkout/BankTransferWorkflow.tsx
import React, { useState } from 'react';
import { BANK_DETAILS } from '@black-white/shared';
import { useToast } from '../../contexts/ToastContext';

interface BankTransferWorkflowProps {
  orderNumber: string;
  totalAmount: number;
  currency: string;
  onReceiptSubmitted: (data: { reference: string; receiptUrl: string; notes?: string }) => void;
}

export const BankTransferWorkflow: React.FC<BankTransferWorkflowProps> = ({
  orderNumber,
  totalAmount,
  currency,
  onReceiptSubmitted,
}) => {
  const { showToast } = useToast();
  const [transactionRef, setTransactionRef] = useState('');
  const [receiptFileName, setReceiptFileName] = useState('');
  const [receiptPreviewUrl, setReceiptPreviewUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    showToast(`Copied ${label} to clipboard.`, 'info');
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptFileName(file.name);
      const fakeUrl = URL.createObjectURL(file);
      setReceiptPreviewUrl(fakeUrl);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionRef.trim()) {
      showToast('Please enter your transaction reference number.', 'error');
      return;
    }
    if (!receiptFileName) {
      showToast('Please upload a copy of your bank transfer receipt.', 'error');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsCompleted(true);
      onReceiptSubmitted({
        reference: transactionRef,
        receiptUrl: receiptPreviewUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1000',
        notes,
      });
      showToast('Bank transfer receipt submitted for verification!', 'success', 'Verification Pending');
    }, 1000);
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 md:p-8 space-y-8 text-white">
      {/* Header */}
      <div className="border-b border-zinc-800 pb-4">
        <span className="text-xs font-mono uppercase tracking-[0.3em] text-amber-400">Payment Gateway</span>
        <h3 className="text-2xl font-serif font-black uppercase text-white mt-1">
          Direct Bank Transfer (Bespoke Wire)
        </h3>
        <p className="text-xs text-zinc-400 mt-1">
          Please transfer exact payment to our official corporate account. Your order will be processed immediately upon receipt verification.
        </p>
      </div>

      {/* Bank Account Details Card */}
      <div className="bg-zinc-900/90 border border-amber-500/20 rounded-lg p-6 space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-zinc-800">
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
            Official Beneficiary Details
          </span>
          <span className="text-xs font-mono text-zinc-400">Order: {orderNumber}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div>
            <span className="text-zinc-500 block uppercase">Bank Name</span>
            <div className="flex items-center justify-between mt-1 p-2 bg-zinc-950 rounded border border-zinc-800">
              <span className="text-white font-bold">{BANK_DETAILS.bank_name}</span>
              <button
                type="button"
                onClick={() => copyToClipboard(BANK_DETAILS.bank_name, 'Bank Name')}
                className="text-[10px] text-amber-400 hover:text-white uppercase tracking-widest"
              >
                {copiedField === 'Bank Name' ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          <div>
            <span className="text-zinc-500 block uppercase">Account Name</span>
            <div className="flex items-center justify-between mt-1 p-2 bg-zinc-950 rounded border border-zinc-800">
              <span className="text-white font-bold truncate">{BANK_DETAILS.account_name}</span>
              <button
                type="button"
                onClick={() => copyToClipboard(BANK_DETAILS.account_name, 'Account Name')}
                className="text-[10px] text-amber-400 hover:text-white uppercase tracking-widest ml-2"
              >
                {copiedField === 'Account Name' ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          <div>
            <span className="text-zinc-500 block uppercase">Account Number</span>
            <div className="flex items-center justify-between mt-1 p-2 bg-zinc-950 rounded border border-zinc-800">
              <span className="text-amber-400 font-bold tracking-wider">{BANK_DETAILS.account_number}</span>
              <button
                type="button"
                onClick={() => copyToClipboard(BANK_DETAILS.account_number, 'Account Number')}
                className="text-[10px] text-amber-400 hover:text-white uppercase tracking-widest"
              >
                {copiedField === 'Account Number' ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          <div>
            <span className="text-zinc-500 block uppercase">SWIFT / BIC Code</span>
            <div className="flex items-center justify-between mt-1 p-2 bg-zinc-950 rounded border border-zinc-800">
              <span className="text-white font-bold tracking-wider">{BANK_DETAILS.swift_code}</span>
              <button
                type="button"
                onClick={() => copyToClipboard(BANK_DETAILS.swift_code, 'SWIFT Code')}
                className="text-[10px] text-amber-400 hover:text-white uppercase tracking-widest"
              >
                {copiedField === 'SWIFT Code' ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </div>

        <div className="pt-2 text-[11px] text-amber-300 font-serif flex items-center gap-2">
          <span>⚠️</span>
          <span>
            Please include order reference <strong className="font-mono text-white">{orderNumber}</strong> in your wire description. Total Payable:{' '}
            <strong className="font-mono text-amber-400 font-bold">${totalAmount.toLocaleString()} {currency}</strong>
          </span>
        </div>
      </div>

      {/* Submission Form or Success View */}
      {!isCompleted ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-400">
              Upload Transfer Proof & Reference
            </h4>

            <div>
              <label className="block text-xs font-mono text-zinc-400 uppercase mb-1">
                Transaction Reference / Ref No. *
              </label>
              <input
                type="text"
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
                placeholder="e.g. TR-98420194812"
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-4 py-3 text-sm text-white font-mono placeholder-zinc-600 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 uppercase mb-1">
                Bank Transfer Receipt (Image / PDF) *
              </label>
              <div className="border-2 border-dashed border-zinc-800 hover:border-amber-500/50 rounded-lg p-6 text-center cursor-pointer transition-colors bg-zinc-900/50">
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="receipt-upload-input"
                />
                <label htmlFor="receipt-upload-input" className="cursor-pointer block">
                  <div className="text-2xl mb-2">📄</div>
                  <div className="text-xs font-mono text-amber-400 font-bold">
                    {receiptFileName ? `Selected: ${receiptFileName}` : 'Click to select or drop receipt file'}
                  </div>
                  <div className="text-[10px] text-zinc-500 mt-1">Supports JPG, PNG, PDF up to 10MB</div>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 uppercase mb-1">
                Additional Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Sender bank name, account holder name if different..."
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-white text-black font-semibold text-xs uppercase tracking-widest hover:bg-amber-400 transition-colors shadow-xl focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:opacity-50"
          >
            {isSubmitting ? 'Verifying File Submission...' : 'Submit Payment Receipt For Verification'}
          </button>
        </form>
      ) : (
        /* Status & Timeline */
        <div className="space-y-6 bg-zinc-900 p-6 rounded-lg border border-emerald-500/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xl">
              ✓
            </div>
            <div>
              <h4 className="text-base font-serif font-bold text-white uppercase">
                Payment Verification Pending
              </h4>
              <p className="text-xs text-zinc-400">
                Receipt received! Our accounts desk is validating your transfer reference{' '}
                <span className="font-mono text-amber-400">{transactionRef}</span>.
              </p>
            </div>
          </div>

          {/* Timeline */}
          <div className="pt-4 border-t border-zinc-800 space-y-4">
            <div className="text-xs font-mono uppercase text-zinc-400 tracking-widest">
              Live Order Payment Status Timeline
            </div>

            <div className="space-y-4 pl-4 border-l-2 border-amber-400/80">
              <div className="relative">
                <div className="absolute -left-[21px] top-0 w-3.5 h-3.5 rounded-full bg-amber-400" />
                <div className="text-xs font-bold text-white">Order Reserved</div>
                <div className="text-[11px] text-zinc-400">Items reserved for 24 hours while payment completes.</div>
              </div>

              <div className="relative">
                <div className="absolute -left-[21px] top-0 w-3.5 h-3.5 rounded-full bg-amber-400" />
                <div className="text-xs font-bold text-white">Receipt Submitted</div>
                <div className="text-[11px] text-zinc-400">Proof uploaded with ref: {transactionRef}.</div>
              </div>

              <div className="relative opacity-60">
                <div className="absolute -left-[21px] top-0 w-3.5 h-3.5 rounded-full bg-zinc-700" />
                <div className="text-xs font-bold text-zinc-300">Admin Audit & Verification</div>
                <div className="text-[11px] text-zinc-400">Bank ledger match in progress (usually 1-3 hours).</div>
              </div>

              <div className="relative opacity-40">
                <div className="absolute -left-[21px] top-0 w-3.5 h-3.5 rounded-full bg-zinc-800" />
                <div className="text-xs font-bold text-zinc-400">Couture Dispatch</div>
                <div className="text-[11px] text-zinc-500">Tracking code will be sent via SMS & Email.</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
