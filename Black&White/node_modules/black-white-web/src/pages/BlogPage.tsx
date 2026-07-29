// apps/web/src/pages/BlogPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { MOCK_BLOG_ARTICLES } from '../data/mockData';

export const BlogPage: React.FC = () => {
  return (
    <div className="bg-black text-white min-h-screen pt-12 pb-24">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-amber-400 font-mono text-xs uppercase tracking-[0.4em]">Haute Gazette</span>
          <h1 className="text-4xl md:text-6xl font-serif font-black uppercase tracking-tight mt-2 mb-4">
            The Journal
          </h1>
          <p className="text-zinc-400 text-sm font-light leading-relaxed">
            Essays on menswear heritage, textile science, black-tie etiquette, and the art of living well.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {MOCK_BLOG_ARTICLES.map((article) => (
            <article key={article.id} className="bg-zinc-950 border border-zinc-800 rounded overflow-hidden flex flex-col justify-between group">
              <Link to={`/blog/${article.slug}`} className="relative h-72 overflow-hidden bg-zinc-900 block">
                <img
                  src={article.cover_image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <span className="absolute top-4 left-4 px-3 py-1 bg-amber-400 text-black text-[10px] uppercase font-bold tracking-widest rounded shadow">
                  {article.category}
                </span>
              </Link>

              <div className="p-8 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 text-[11px] font-mono text-zinc-500 uppercase tracking-widest mb-2">
                    <span>{article.author}</span>
                    <span>•</span>
                    <span>{article.published_at}</span>
                    <span>•</span>
                    <span>{article.read_time}</span>
                  </div>
                  <Link to={`/blog/${article.slug}`}>
                    <h2 className="font-serif font-bold text-2xl uppercase text-white group-hover:text-amber-400 transition-colors leading-tight">
                      {article.title}
                    </h2>
                  </Link>
                  <p className="text-zinc-400 text-xs font-light mt-3 leading-relaxed">{article.excerpt}</p>
                </div>

                <Link
                  to={`/blog/${article.slug}`}
                  className="inline-block text-xs uppercase tracking-[0.2em] font-bold text-amber-400 hover:text-white transition-colors pt-4 border-t border-zinc-800/80"
                >
                  Read Full Essay &rarr;
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
