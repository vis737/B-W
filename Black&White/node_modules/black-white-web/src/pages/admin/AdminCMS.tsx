// apps/web/src/pages/admin/AdminCMS.tsx
import React, { useState } from 'react';
import { MOCK_BANNERS } from '../../data/mockData';
import { useToast } from '../../contexts/ToastContext';

export const AdminCMS: React.FC = () => {
  const [banners, setBanners] = useState(MOCK_BANNERS);
  const { showToast } = useToast();

  const handleToggleBanner = (id: string) => {
    setBanners((prev) =>
      prev.map((b) => (b.id === id ? { ...b, is_active: !b.is_active } : b))
    );
    showToast('Banner active state updated.', 'info', 'CMS Updated');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
        <div>
          <span className="text-amber-400 font-mono text-xs uppercase tracking-widest">Visual Merchandising</span>
          <h1 className="text-3xl font-serif font-black uppercase text-white">Homepage & Banner Manager</h1>
        </div>
      </div>

      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 space-y-4">
        <h2 className="font-serif font-bold text-xl uppercase text-white">Hero Banners & Promotional Sliders</h2>
        <div className="space-y-4">
          {banners.map((b) => (
            <div key={b.id} className="p-4 bg-black border border-zinc-800 rounded-xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img src={b.image_url} alt={b.title} className="w-24 h-16 object-cover rounded bg-zinc-900" />
                <div>
                  <span className="text-amber-400 font-mono text-[10px] uppercase font-bold">{b.type} Banner</span>
                  <h4 className="font-serif font-bold text-white text-base">{b.title}</h4>
                  <p className="text-xs text-zinc-400 font-light line-clamp-1">{b.subtitle}</p>
                </div>
              </div>
              <button
                onClick={() => handleToggleBanner(b.id)}
                className={`px-4 py-2 text-xs uppercase font-bold rounded transition-colors ${
                  b.is_active ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-zinc-800 text-zinc-500'
                }`}
              >
                {b.is_active ? 'Active' : 'Disabled'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminCMS;
