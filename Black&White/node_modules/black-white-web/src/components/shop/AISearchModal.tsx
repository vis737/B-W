// apps/web/src/components/shop/AISearchModal.tsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MOCK_PRODUCTS, MOCK_CATEGORIES, MOCK_AGE_GROUPS } from '../../data/mockData';
import { Product } from '@black-white/shared';

interface AISearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_SEARCHES = [
  'Tuxedos & Suits',
  'Cashmere Hoodies',
  'Sea Island Cotton Shirts',
  'Silk Kurtas',
  'Italian Leather Loafers',
  'Teen Formalwear',
];

export const AISearchModal: React.FC<AISearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedAge, setSelectedAge] = useState<string>('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      const saved = localStorage.getItem('bw_recent_searches');
      if (saved) {
        try {
          setRecentSearches(JSON.parse(saved));
        } catch {
          // ignore
        }
      }
    }
  }, [isOpen]);

  const saveRecentSearch = (term: string) => {
    if (!term.trim()) return;
    const updated = [term, ...recentSearches.filter((s) => s !== term)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('bw_recent_searches', JSON.stringify(updated));
  };

  const handleSelectProduct = (product: Product) => {
    saveRecentSearch(product.name);
    onClose();
    navigate(`/product/${product.slug}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      saveRecentSearch(query);
      onClose();
      let url = `/shop?search=${encodeURIComponent(query)}`;
      if (selectedAge) url += `&age=${selectedAge}`;
      navigate(url);
    }
  };

  // Live filtering
  const matchingProducts = query.trim()
    ? MOCK_PRODUCTS.filter((p) => {
        const q = query.toLowerCase();
        const matchesText =
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.categories.some((c) => c.name.toLowerCase().includes(q)) ||
          p.description?.toLowerCase().includes(q);
        const matchesAge = selectedAge
          ? p.age_groups.some((ag) => ag.slug === selectedAge)
          : true;
        return matchesText && matchesAge;
      }).slice(0, 6)
    : [];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-3xl bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden z-10 text-white"
          >
            {/* Header & Input */}
            <form onSubmit={handleSearchSubmit} className="p-6 border-b border-zinc-800 flex items-center gap-4">
              <span className="text-amber-400 text-xl">✨</span>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search haute couture, age group (e.g. teen, adult), cashmere..."
                className="w-full bg-transparent text-lg md:text-xl font-serif text-white placeholder-zinc-500 focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="text-xs text-zinc-500 hover:text-white uppercase tracking-widest"
                >
                  Clear
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="p-2 text-zinc-400 hover:text-white rounded-lg"
              >
                ✕
              </button>
            </form>

            {/* Age Filter Ribbon inside Search */}
            <div className="px-6 py-3 bg-zinc-900/60 border-b border-zinc-800/80 flex items-center gap-2 overflow-x-auto text-xs font-mono scrollbar-none">
              <span className="text-amber-400 font-bold uppercase tracking-widest text-[10px] pr-2">Age Group:</span>
              <button
                type="button"
                onClick={() => setSelectedAge('')}
                className={`px-3 py-1 rounded-full text-xs font-sans transition-colors ${
                  !selectedAge ? 'bg-amber-400 text-black font-bold' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                }`}
              >
                All Ages
              </button>
              {MOCK_AGE_GROUPS.map((ag) => (
                <button
                  type="button"
                  key={ag.id}
                  onClick={() => setSelectedAge(ag.slug === selectedAge ? '' : ag.slug)}
                  className={`px-3 py-1 rounded-full text-xs font-sans whitespace-nowrap transition-colors ${
                    ag.slug === selectedAge ? 'bg-amber-400 text-black font-bold' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                  }`}
                >
                  {ag.name}
                </button>
              ))}
            </div>

            {/* Content Body */}
            <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6">
              {/* If User typed query */}
              {query.trim() ? (
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-400 mb-4">
                    Matching Results ({matchingProducts.length})
                  </h4>

                  {matchingProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {matchingProducts.map((p) => (
                        <div
                          key={p.id}
                          onClick={() => handleSelectProduct(p)}
                          className="flex items-center gap-4 p-3 rounded-lg bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800/50 hover:border-amber-500/40 cursor-pointer transition-all group"
                        >
                          <img
                            src={p.images[0]?.url}
                            alt={p.name}
                            className="w-14 h-16 object-cover rounded bg-zinc-800"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-mono text-amber-400 uppercase tracking-widest">
                              {p.brand}
                            </div>
                            <div className="text-sm font-serif font-bold text-white group-hover:text-amber-400 truncate transition-colors">
                              {p.name}
                            </div>
                            <div className="text-xs text-zinc-400 mt-1">
                              ${(p.discount_price || p.base_price).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 text-zinc-500 font-serif">
                      No luxury items match "{query}". Try searching for categories like Suits, Shirts, or Hoodies.
                    </div>
                  )}
                </div>
              ) : (
                /* Default View when query is empty */
                <div className="space-y-6">
                  {recentSearches.length > 0 && (
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-400">
                          Recent Searches
                        </h4>
                        <button
                          onClick={() => {
                            setRecentSearches([]);
                            localStorage.removeItem('bw_recent_searches');
                          }}
                          className="text-[10px] text-zinc-500 hover:text-white uppercase tracking-widest"
                        >
                          Clear History
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {recentSearches.map((s) => (
                          <button
                            key={s}
                            onClick={() => setQuery(s)}
                            className="px-3 py-1.5 rounded bg-zinc-900 text-xs text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors border border-zinc-800 flex items-center gap-1.5"
                          >
                            <span className="text-zinc-500">🕒</span>
                            <span>{s}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-400 mb-3">
                      Popular Collections
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {POPULAR_SEARCHES.map((s) => (
                        <button
                          key={s}
                          onClick={() => setQuery(s)}
                          className="px-3 py-1.5 rounded bg-amber-400/10 border border-amber-500/20 text-xs text-amber-300 hover:bg-amber-400/20 transition-colors"
                        >
                          ✨ {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-400 mb-3">
                      Explore Categories
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {MOCK_CATEGORIES.slice(0, 6).map((c) => (
                        <button
                          key={c.id}
                          onClick={() => {
                            onClose();
                            navigate(`/shop?category=${c.slug}`);
                          }}
                          className="p-3 rounded bg-zinc-900 text-left text-xs font-serif hover:bg-zinc-800 text-zinc-200 hover:text-amber-400 transition-colors border border-zinc-800/80"
                        >
                          {c.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-zinc-900/80 border-t border-zinc-800 flex justify-between items-center text-xs text-zinc-500">
              <span>Press <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded text-zinc-300">ESC</kbd> to exit</span>
              <span className="text-amber-400/80">Black & White AI Intelligence v2.5</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
