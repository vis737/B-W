// apps/web/src/pages/admin/AdminStaff.tsx
import React, { useState } from 'react';
import { MOCK_STAFF } from '../../data/mockData';
import { useToast } from '../../contexts/ToastContext';

export const AdminStaff: React.FC = () => {
  const [staffList, setStaffList] = useState(MOCK_STAFF);
  const { showToast } = useToast();

  const handleToggleStatus = (id: string) => {
    setStaffList((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: s.status === 'active' ? 'inactive' : 'active' } : s))
    );
    showToast('Staff account status toggled.', 'info', 'Staff Updated');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
        <div>
          <span className="text-amber-400 font-mono text-xs uppercase tracking-widest">Access Control</span>
          <h1 className="text-3xl font-serif font-black uppercase text-white">Staff Accounts & Roles</h1>
        </div>
      </div>

      <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-xs font-mono text-zinc-300">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900 text-amber-400 uppercase">
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Assigned Role</th>
              <th className="p-4">Last Active</th>
              <th className="p-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {staffList.map((s) => (
              <tr key={s.id} className="hover:bg-zinc-900/50">
                <td className="p-4 font-bold text-white">{s.name}</td>
                <td className="p-4 text-zinc-400">{s.email}</td>
                <td className="p-4 uppercase text-amber-400 font-bold">{s.role}</td>
                <td className="p-4 text-zinc-500">{s.last_login}</td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => handleToggleStatus(s.id)}
                    className={`px-3 py-1 text-[10px] font-bold uppercase rounded ${s.status === 'active' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-red-950 text-red-400 border border-red-800'}`}
                  >
                    {s.status}
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

export default AdminStaff;
