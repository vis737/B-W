// apps/web/src/pages/admin/AdminSettings.tsx
import React, { useState } from 'react';
import { MOCK_SYSTEM_LOGS } from '../../data/mockData';
import { useToast } from '../../contexts/ToastContext';

export const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    siteName: 'Black & White Haute Couture',
    currency: 'USD',
    taxRate: '10',
    flatShipping: '15',
    freeShippingThreshold: '150',
    bankName: 'JPMorgan Chase Bank',
    accountNumber: '9876543210',
  });
  const { showToast } = useToast();

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Platform & System Settings saved.', 'success', 'Settings Saved');
  };

  const handleBackupDatabase = () => {
    showToast('Encrypted JSON database backup file generated & downloaded.', 'success', 'Backup Complete');
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
        <div>
          <span className="text-amber-400 font-mono text-xs uppercase tracking-widest">Platform Infrastructure</span>
          <h1 className="text-3xl font-serif font-black uppercase text-white">System Settings & Logs</h1>
        </div>
        <button
          onClick={handleBackupDatabase}
          className="px-5 py-2.5 bg-amber-400 text-black font-bold text-xs uppercase tracking-widest rounded hover:bg-white transition-colors"
        >
          ⬇ Download Database Backup
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Settings Form */}
        <div className="lg:col-span-7 bg-zinc-950 border border-zinc-800 p-8 rounded-xl space-y-6">
          <h2 className="font-serif font-bold text-xl uppercase text-white border-b border-zinc-800 pb-4">Store Configuration</h2>
          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs font-sans">
            <div>
              <label className="text-zinc-400 uppercase font-mono text-[10px] block mb-1">Brand Name</label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full bg-black border border-zinc-800 p-3 rounded text-white outline-none focus:border-amber-400"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-zinc-400 uppercase font-mono text-[10px] block mb-1">Tax Rate (%)</label>
                <input
                  type="number"
                  value={settings.taxRate}
                  onChange={(e) => setSettings({ ...settings, taxRate: e.target.value })}
                  className="w-full bg-black border border-zinc-800 p-3 rounded text-white outline-none"
                />
              </div>
              <div>
                <label className="text-zinc-400 uppercase font-mono text-[10px] block mb-1">Flat Shipping ($)</label>
                <input
                  type="number"
                  value={settings.flatShipping}
                  onChange={(e) => setSettings({ ...settings, flatShipping: e.target.value })}
                  className="w-full bg-black border border-zinc-800 p-3 rounded text-white outline-none"
                />
              </div>
            </div>
            <div>
              <label className="text-zinc-400 uppercase font-mono text-[10px] block mb-1">Bank Name for Wire Transfer</label>
              <input
                type="text"
                value={settings.bankName}
                onChange={(e) => setSettings({ ...settings, bankName: e.target.value })}
                className="w-full bg-black border border-zinc-800 p-3 rounded text-white outline-none"
              />
            </div>
            <button type="submit" className="w-full py-3 bg-amber-400 text-black font-bold uppercase text-xs tracking-widest rounded hover:bg-white transition-colors">
              Save Platform Configuration
            </button>
          </form>
        </div>

        {/* Live System Logs */}
        <div className="lg:col-span-5 bg-zinc-950 border border-zinc-800 p-6 rounded-xl space-y-4">
          <h2 className="font-serif font-bold text-lg uppercase text-white">Live System Event Logs</h2>
          <div className="space-y-3 font-mono text-[11px]">
            {MOCK_SYSTEM_LOGS.map((log) => (
              <div key={log.id} className="p-3 bg-black border border-zinc-800 rounded space-y-1">
                <div className="flex justify-between text-zinc-500 text-[10px]">
                  <span>{log.source}</span>
                  <span>{log.timestamp}</span>
                </div>
                <p className="text-amber-400 font-bold">{log.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
