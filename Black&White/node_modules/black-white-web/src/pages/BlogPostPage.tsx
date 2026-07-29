// apps/web/src/pages/BlogPostPage.tsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_BLOG_ARTICLES } from '../data/mockData';

export const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const article = MOCK_BLOG_ARTICLES.find((a) => a.slug === slug) || MOCK_BLOG_ARTICLES[0];

  return (
    <div className="bg-black text-white min-h-screen pt-12 pb-24">
      <div className="container mx-auto px-6 max-w-4xl space-y-10">
        <Link to="/blog" className="text-xs font-mono text-amber-400 uppercase tracking-widest hover:underline">
          &larr; Back to The Journal
        </Link>

        <div>
          <span className="text-amber-400 font-mono text-xs uppercase tracking-[0.3em] block mb-2">{article.category}</span>
          <h1 className="text-3xl md:text-5xl font-serif font-black uppercase text-white leading-tight">
            {article.title}
          </h1>
          <div className="flex items-center gap-4 text-xs font-mono text-zinc-500 uppercase tracking-widest mt-4 border-b border-zinc-800 pb-6">
            <span>By {article.author}</span>
            <span>•</span>
            <span>Published {article.published_at}</span>
            <span>•</span>
            <span>{article.read_time}</span>
          </div>
        </div>

        <div className="h-96 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800">
          <img src={article.cover_image} alt={article.title} className="w-full h-full object-cover" />
        </div>

        <div className="prose prose-invert max-w-none text-zinc-300 font-light text-base leading-relaxed space-y-6">
          <p className="text-lg font-serif text-white font-normal italic border-l-2 border-amber-400 pl-4 py-1">
            "{article.excerpt}"
          </p>
          <p>{article.content}</p>
          <p>
            When selecting sea island cotton or virgin cashmere garments, fiber staple length determines both luster and long-term durability. Our atelier partners directly with hereditary weaving houses in Bergamo and Biella to guarantee uncompromised quality.
          </p>
        </div>

        <div className="pt-8 border-t border-zinc-800 flex justify-between items-center text-xs font-mono text-zinc-400 uppercase tracking-widest">
          <div className="flex gap-2">
            {article.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded">
                #{tag}
              </span>
            ))}
          </div>
          <Link to="/blog" className="text-amber-400 font-bold hover:underline">More Essays &rarr;</Link>
        </div>
      </div>
    </div>
  );
};

export default BlogPostPage;
