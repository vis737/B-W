// apps/web/src/pages/admin/AdminCategories.tsx
import React, { useState } from 'react';
import { MOCK_CATEGORIES, MOCK_AGE_GROUPS } from '../../data/mockData';
import { useToast } from '../../contexts/ToastContext';

export const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState(MOCK_CATEGORIES);
  const [ageGroups] = useState(MOCK_AGE_GROUPS);
  const { showToast } = useToast();

  const handleToggleCategoryFeatured = (id: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, is_featured: !c.is_featured } : c))
    );
    showToast('Category featured status toggled.', 'info', 'Category Updated');
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
        <div>
          <span className="text-amber-400 font-mono text-xs uppercase tracking-widest">Taxonomy System</span>
          <h1 className="text-3xl font-serif font-black uppercase text-white">Categories & Age Groups</h1>
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 space-y-4">
        <h2 className="font-serif font-bold text-xl uppercase text-white">35+ Product Categories</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono text-zinc-300">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900 text-amber-400 uppercase">
                <th className="p-3">Category</th>
                <th className="p-3">Slug</th>
                <th className="p-3">Description</th>
                <th className="p-3">Featured</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {categories.map((c) => (
                <tr key={c.id} className="hover:bg-zinc-900/50">
                  <td className="p-3 font-bold text-white flex items-center gap-3">
                    <img src={c.image_url} alt={c.name} className="w-8 h-8 object-cover rounded bg-zinc-900" />
                    <span>{c.name}</span>
                  </td>
                  <td className="p-3 text-zinc-500">{c.slug}</td>
                  <td className="p-3 text-zinc-400 max-w-xs truncate">{c.description}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 text-[9px] uppercase font-bold rounded ${c.is_featured ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-zinc-800 text-zinc-500'}`}>
                      {c.is_featured ? 'Featured' : 'Standard'}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleToggleCategoryFeatured(c.id)}
                      className="px-3 py-1 bg-zinc-800 text-amber-400 rounded text-[10px] font-bold uppercase hover:bg-amber-400 hover:text-black transition-colors"
                    >
                      Toggle Featured
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Age Groups Matrix */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 space-y-4">
        <h2 className="font-serif font-bold text-xl uppercase text-white">11 Age Group Brackets</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {ageGroups.map((ag) => (
            <div key={ag.id} className="p-4 bg-black border border-zinc-800 rounded flex gap-3 items-center">
              <img src={ag.image_url} alt={ag.name} className="w-12 h-14 object-cover rounded" />
              <div>
                <h4 className="font-serif font-bold text-white text-xs uppercase">{ag.name}</h4>
                <span className="text-[10px] font-mono text-zinc-500">{ag.slug}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminCategories;
