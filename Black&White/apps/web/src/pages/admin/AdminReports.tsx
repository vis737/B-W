// apps/web/src/pages/admin/AdminReports.tsx
import React from 'react';
import { MOCK_AUDIT_LOGS } from '../../data/mockData';
import { useToast } from '../../contexts/ToastContext';

export const AdminReports: React.FC = () => {
  const { showToast } = useToast();

  const handleExportCSV = (reportName: string) => {
    showToast(`Exported ${reportName} to CSV file.`, 'success', 'Report Exported');
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
        <div>
          <span className="text-amber-400 font-mono text-xs uppercase tracking-widest">Financial & Audit Compliance</span>
          <h1 className="text-3xl font-serif font-black uppercase text-white">Reports & Staff Audit Logs</h1>
        </div>
      </div>

      {/* Reports Export Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-xl space-y-3">
          <span className="text-amber-400 font-mono text-xs uppercase">Financial Statement</span>
          <h3 className="text-lg font-serif font-bold text-white uppercase">Sales & Tax Report</h3>
          <p className="text-xs text-zinc-400 font-light">Gross revenue, VAT calculations, and net margin breakdown.</p>
          <button
            onClick={() => handleExportCSV('Sales & Tax Report')}
            className="w-full py-2 bg-white text-black text-xs font-bold uppercase tracking-wider rounded hover:bg-amber-400 transition-colors"
          >
            Export CSV
          </button>
        </div>

        <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-xl space-y-3">
          <span className="text-amber-400 font-mono text-xs uppercase">Asset Valuation</span>
          <h3 className="text-lg font-serif font-bold text-white uppercase">Inventory Valuation</h3>
          <p className="text-xs text-zinc-400 font-light">Current stock value at cost vs retail list prices.</p>
          <button
            onClick={() => handleExportCSV('Inventory Valuation')}
            className="w-full py-2 bg-white text-black text-xs font-bold uppercase tracking-wider rounded hover:bg-amber-400 transition-colors"
          >
            Export CSV
          </button>
        </div>

        <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-xl space-y-3">
          <span className="text-amber-400 font-mono text-xs uppercase">Patron Metrics</span>
          <h3 className="text-lg font-serif font-bold text-white uppercase">Customer Tier Report</h3>
          <p className="text-xs text-zinc-400 font-light">Active Platinum & Diamond account spend logs.</p>
          <button
            onClick={() => handleExportCSV('Customer Tier Report')}
            className="w-full py-2 bg-white text-black text-xs font-bold uppercase tracking-wider rounded hover:bg-amber-400 transition-colors"
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* Staff Audit Logs Table */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 space-y-4">
        <h2 className="font-serif font-bold text-xl uppercase text-white">Staff Activity Audit Logs</h2>
        <table className="w-full text-left text-xs font-mono text-zinc-300">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900 text-amber-400 uppercase">
              <th className="p-3">Timestamp</th>
              <th className="p-3">User</th>
              <th className="p-3">Role</th>
              <th className="p-3">Action</th>
              <th className="p-3">Target Resource</th>
              <th className="p-3">IP Address</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {MOCK_AUDIT_LOGS.map((log) => (
              <tr key={log.id} className="hover:bg-zinc-900/50">
                <td className="p-3 text-zinc-500">{log.timestamp}</td>
                <td className="p-3 font-bold text-white">{log.user}</td>
                <td className="p-3 text-amber-400 uppercase">{log.role}</td>
                <td className="p-3">{log.action}</td>
                <td className="p-3 font-bold text-zinc-300">{log.resource}</td>
                <td className="p-3 text-zinc-500">{log.ip_address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminReports;
