// apps/web/src/components/shop/ProductCompareModal.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '@black-white/shared';

interface ProductCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onRemoveProduct: (productId: string) => void;
}

export const ProductCompareModal: React.FC<ProductCompareModalProps> = ({
  isOpen,
  onClose,
  products,
  onRemoveProduct,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-6xl bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden z-10 text-white max-h-[90vh] flex flex-col"
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono uppercase tracking-[0.3em] text-amber-400">Atelier Comparison</span>
                <h3 className="text-2xl font-serif font-black uppercase text-white mt-1">
                  Compare Couture Products ({products.length})
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-zinc-400 hover:text-white rounded-full bg-zinc-900 border border-zinc-800"
              >
                ✕
              </button>
            </div>

            {/* Comparison Grid */}
            <div className="p-6 overflow-x-auto overflow-y-auto flex-1 scrollbar-thin">
              {products.length === 0 ? (
                <div className="text-center py-16 text-zinc-500 font-serif">
                  No products added to comparison list. Select "Compare" on product items in the shop.
                </div>
              ) : (
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr>
                      <th className="p-4 w-40 text-xs font-mono uppercase tracking-widest text-zinc-500 border-b border-zinc-800">
                        Specification
                      </th>
                      {products.map((p) => (
                        <th key={p.id} className="p-4 border-b border-zinc-800 align-top">
                          <div className="relative group">
                            <button
                              onClick={() => onRemoveProduct(p.id)}
                              className="absolute -top-2 -right-2 p-1 text-zinc-400 hover:text-rose-400 bg-zinc-900 rounded-full border border-zinc-800 z-10"
                              title="Remove"
                            >
                              ✕
                            </button>
                            <img
                              src={p.images[0]?.url}
                              alt={p.name}
                              className="w-full h-40 object-cover rounded-lg mb-3 border border-zinc-800"
                            />
                            <div className="text-xs font-mono text-amber-400 uppercase tracking-wider">
                              {p.brand}
                            </div>
                            <div className="text-base font-serif font-bold text-white leading-tight">
                              {p.name}
                            </div>
                            <div className="text-sm font-bold text-amber-400 font-mono mt-1">
                              ${(p.discount_price || p.base_price).toLocaleString()}
                            </div>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60 text-xs md:text-sm">
                    <tr>
                      <td className="p-4 font-mono text-zinc-400 uppercase text-[11px] font-bold">Primary Category</td>
                      {products.map((p) => (
                        <td key={p.id} className="p-4 text-zinc-200">
                          {p.categories.map((c) => c.name).join(', ') || 'N/A'}
                        </td>
                      ))}
                    </tr>

                    <tr>
                      <td className="p-4 font-mono text-amber-400 uppercase text-[11px] font-bold">Age Groups</td>
                      {products.map((p) => (
                        <td key={p.id} className="p-4">
                          <div className="flex flex-wrap gap-1">
                            {p.age_groups.map((ag) => (
                              <span key={ag.id} className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-300">
                                {ag.name}
                              </span>
                            ))}
                          </div>
                        </td>
                      ))}
                    </tr>

                    <tr>
                      <td className="p-4 font-mono text-zinc-400 uppercase text-[11px] font-bold">Fit Type</td>
                      {products.map((p) => (
                        <td key={p.id} className="p-4 text-zinc-200">
                          {p.fit_type || p.fit_guide || 'Tailored Regular'}
                        </td>
                      ))}
                    </tr>

                    <tr>
                      <td className="p-4 font-mono text-zinc-400 uppercase text-[11px] font-bold">Fabric & Material</td>
                      {products.map((p) => (
                        <td key={p.id} className="p-4 text-zinc-200">
                          {p.material || p.fabric_info || '100% Fine Luxury Blend'}
                        </td>
                      ))}
                    </tr>

                    <tr>
                      <td className="p-4 font-mono text-zinc-400 uppercase text-[11px] font-bold">Patron Rating</td>
                      {products.map((p) => (
                        <td key={p.id} className="p-4 text-zinc-200 font-mono">
                          ⭐ {p.average_rating || 4.8} / 5.0 ({p.review_count || 12} reviews)
                        </td>
                      ))}
                    </tr>

                    <tr>
                      <td className="p-4 font-mono text-zinc-400 uppercase text-[11px] font-bold">Available Sizes</td>
                      {products.map((p) => (
                        <td key={p.id} className="p-4 text-zinc-300 font-mono">
                          {p.variants.map((v) => v.size).filter(Boolean).join(', ')}
                        </td>
                      ))}
                    </tr>

                    <tr>
                      <td className="p-4 font-mono text-zinc-400 uppercase text-[11px] font-bold">Care Guide</td>
                      {products.map((p) => (
                        <td key={p.id} className="p-4 text-zinc-400">
                          {p.wash_care || 'Dry clean recommended.'}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
