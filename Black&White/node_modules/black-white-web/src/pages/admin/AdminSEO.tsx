// apps/web/src/pages/admin/AdminSEO.tsx
import React, { useState } from 'react';
import { useToast } from '../../contexts/ToastContext';

export const AdminSEO: React.FC = () => {
  const [seoData, setSeoData] = useState({
    metaTitle: 'Black & White | Haute Couture & Luxury Menswear',
    metaDescription: 'Shop handcrafted sea island cotton shirts, bespoke tuxedo blazers, Italian footwear, and haute parfumerie.',
    keywords: 'menswear, luxury shirts, tuxedo, silk suit, fine footwear, cashmere overcoat',
  });
  const { showToast } = useToast();

  const handleSaveSeo = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Global meta tags and SEO configuration saved.', 'success', 'SEO Saved');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
        <div>
          <span className="text-amber-400 font-mono text-xs uppercase tracking-widest">Search Engine Optimization</span>
          <h1 className="text-3xl font-serif font-black uppercase text-white">SEO Manager</h1>
        </div>
      </div>

      <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-xl max-w-2xl space-y-6">
        <h2 className="font-serif font-bold text-xl uppercase text-white border-b border-zinc-800 pb-4">Global Meta Tags</h2>
        <form onSubmit={handleSaveSeo} className="space-y-4 text-xs font-sans">
          <div>
            <label className="text-zinc-400 uppercase font-mono text-[10px] block mb-1">Meta Title Pattern</label>
            <input
              type="text"
              value={seoData.metaTitle}
              onChange={(e) => setSeoData({ ...seoData, metaTitle: e.target.value })}
              className="w-full bg-black border border-zinc-800 p-3 rounded text-white outline-none focus:border-amber-400"
            />
          </div>
          <div>
            <label className="text-zinc-400 uppercase font-mono text-[10px] block mb-1">Meta Description</label>
            <textarea
              rows={3}
              value={seoData.metaDescription}
              onChange={(e) => setSeoData({ ...seoData, metaDescription: e.target.value })}
              className="w-full bg-black border border-zinc-800 p-3 rounded text-white outline-none focus:border-amber-400"
            />
          </div>
          <div>
            <label className="text-zinc-400 uppercase font-mono text-[10px] block mb-1">Global Keywords</label>
            <input
              type="text"
              value={seoData.keywords}
              onChange={(e) => setSeoData({ ...seoData, keywords: e.target.value })}
              className="w-full bg-black border border-zinc-800 p-3 rounded text-white outline-none focus:border-amber-400"
            />
          </div>
          <button type="submit" className="w-full py-3 bg-amber-400 text-black font-bold uppercase text-xs tracking-widest rounded hover:bg-white transition-colors">
            Update SEO Meta Tags
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminSEO;
