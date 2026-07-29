// apps/web/src/pages/SearchPage.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '../data/mockData';
import { EmptyState } from '../components/ui/EmptyState';

export const SearchPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const popularSearches = ['Tuxedo', 'Sea Island Cotton', 'Overcoat', 'Velvet Blazer', 'Oud Perfume', 'Selvedge Denim'];

  const searchResults = query.trim()
    ? MOCK_PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.brand.toLowerCase().includes(query.toLowerCase()) ||
          p.categories.some((c) => c.name.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  return (
    <div className="bg-black text-white min-h-screen pt-16 pb-24">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Search Bar */}
        <div className="relative mb-12">
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search fine garments, perfumes, footwear..."
            className="w-full bg-zinc-950 border-b-2 border-amber-400 text-2xl md:text-3xl font-serif text-white py-4 px-2 outline-none placeholder-zinc-700"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

        {/* Popular Tags */}
        {!query && (
          <div className="space-y-8">
            <div>
              <h3 className="text-xs uppercase font-mono tracking-[0.2em] text-amber-400 mb-4">Popular Search Queries</h3>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-full text-xs font-sans text-zinc-300 hover:border-amber-400 hover:text-amber-400 transition-all"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs uppercase font-mono tracking-[0.2em] text-amber-400 mb-4">Browse By Category</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {MOCK_CATEGORIES.slice(0, 8).map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/shop?category=${cat.slug}`}
                    className="p-3 bg-zinc-950 border border-zinc-800/80 rounded text-xs font-serif uppercase tracking-wider text-zinc-300 hover:border-amber-400 hover:text-amber-400 transition-all"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {query && (
          <div className="space-y-6">
            <h3 className="text-xs uppercase font-mono tracking-widest text-zinc-400">
              Found <strong className="text-white">{searchResults.length}</strong> matching results for "{query}"
            </h3>

            {searchResults.length === 0 ? (
              <EmptyState
                title="No Matching Atelier Items"
                description={`We couldn't find any products matching "${query}". Try searching for categories like Tuxedo, Shoes, or Coats.`}
                actionText="Browse Shop Catalog"
                actionLink="/shop"
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {searchResults.map((prod) => (
                  <Link
                    key={prod.id}
                    to={`/product/${prod.slug}`}
                    className="p-4 bg-zinc-950 border border-zinc-800/80 rounded flex gap-4 items-center group hover:border-amber-400/50 transition-all"
                  >
                    <img src={prod.images[0].url} alt={prod.name} className="w-20 h-24 object-cover rounded bg-zinc-900" />
                    <div>
                      <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">{prod.brand}</span>
                      <h4 className="font-serif font-bold text-white uppercase text-base group-hover:text-amber-400 transition-colors">
                        {prod.name}
                      </h4>
                      <p className="text-amber-400 font-bold text-sm mt-1">${(prod.discount_price || prod.base_price).toFixed(2)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
