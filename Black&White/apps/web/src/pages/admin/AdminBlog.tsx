// apps/web/src/pages/admin/AdminBlog.tsx
import React, { useState } from 'react';
import { MOCK_BLOG_ARTICLES } from '../../data/mockData';
import { useToast } from '../../contexts/ToastContext';

export const AdminBlog: React.FC = () => {
  const [articles, setArticles] = useState(MOCK_BLOG_ARTICLES);
  const { showToast } = useToast();

  const handleTogglePublish = (id: string) => {
    setArticles((prev) =>
      prev.map((a) => (a.id === id ? { ...a, is_published: !a.is_published } : a))
    );
    showToast('Article publish status updated.', 'info', 'Journal Updated');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
        <div>
          <span className="text-amber-400 font-mono text-xs uppercase tracking-widest">Editorial Management</span>
          <h1 className="text-3xl font-serif font-black uppercase text-white">Blog & Journal Essays</h1>
        </div>
      </div>

      <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-xs font-mono text-zinc-300">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900 text-amber-400 uppercase">
              <th className="p-4">Title</th>
              <th className="p-4">Author</th>
              <th className="p-4">Category</th>
              <th className="p-4">Date</th>
              <th className="p-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {articles.map((a) => (
              <tr key={a.id} className="hover:bg-zinc-900/50">
                <td className="p-4 font-bold text-white flex items-center gap-3">
                  <img src={a.cover_image} alt={a.title} className="w-10 h-10 object-cover rounded bg-zinc-900" />
                  <span>{a.title}</span>
                </td>
                <td className="p-4">{a.author}</td>
                <td className="p-4 uppercase text-amber-400">{a.category}</td>
                <td className="p-4 text-zinc-500">{a.published_at}</td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => handleTogglePublish(a.id)}
                    className={`px-3 py-1 text-[10px] font-bold uppercase rounded ${a.is_published ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-zinc-800 text-zinc-500'}`}
                  >
                    {a.is_published ? 'Published' : 'Draft'}
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

export default AdminBlog;
