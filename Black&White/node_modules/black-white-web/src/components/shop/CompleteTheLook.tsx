// apps/web/src/components/shop/CompleteTheLook.tsx
import React, { useState } from 'react';
import { Product } from '@black-white/shared';
import { useCart } from '../../contexts/CartContext';
import { useToast } from '../../contexts/ToastContext';

interface CompleteTheLookProps {
  mainProduct: Product;
  suggestedItems: Product[];
}

export const CompleteTheLook: React.FC<CompleteTheLookProps> = ({
  mainProduct,
  suggestedItems,
}) => {
  const { addItem } = useCart();
  const { showToast } = useToast();
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([
    mainProduct.id,
    ...suggestedItems.map((p) => p.id),
  ]);

  if (!suggestedItems || suggestedItems.length === 0) return null;

  const allItems = [mainProduct, ...suggestedItems];

  const toggleSelect = (id: string) => {
    if (id === mainProduct.id) return; // main product is always included
    if (selectedProductIds.includes(id)) {
      setSelectedProductIds(selectedProductIds.filter((item) => item !== id));
    } else {
      setSelectedProductIds([...selectedProductIds, id]);
    }
  };

  const selectedItems = allItems.filter((item) => selectedProductIds.includes(item.id));
  const rawTotal = selectedItems.reduce(
    (sum, item) => sum + (item.discount_price || item.base_price),
    0
  );
  // Bundle discount of 15% when 2 or more items are selected
  const hasBundleDiscount = selectedItems.length >= 2;
  const bundleDiscount = hasBundleDiscount ? Math.round(rawTotal * 0.15) : 0;
  const finalPrice = rawTotal - bundleDiscount;

  const handleAddBundleToBag = () => {
    selectedItems.forEach((product) => {
      const variant = product.variants[0];
      addItem({
        id: `${product.id}-${variant.id}`,
        product_id: product.id,
        variant_id: variant.id,
        product_name: product.name,
        product_slug: product.slug,
        image_url: product.images[0]?.url || '',
        color: variant.color,
        size: variant.size,
        quantity: 1,
        unit_price: product.base_price,
        discount_price: product.discount_price,
        total_price: product.discount_price || product.base_price,
      });
    });

    showToast(
      `Added ${selectedItems.length} curated outfit items to your shopping bag.`,
      'success',
      'Atelier Outfit Bundled'
    );
  };

  return (
    <section className="bg-zinc-950 border border-zinc-800/80 rounded-xl p-6 md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-4 border-b border-zinc-800">
        <div>
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-amber-400">Styling Atelier</span>
          <h3 className="text-xl md:text-2xl font-serif font-black uppercase text-white mt-0.5">
            Complete The Haute Ensemble
          </h3>
        </div>
        {hasBundleDiscount && (
          <span className="px-3 py-1 bg-amber-400/10 border border-amber-500/30 text-amber-400 text-xs font-mono uppercase font-bold rounded">
            ✨ Bundle & Save 15%
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Item Cards */}
        <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
          {allItems.map((product) => {
            const isSelected = selectedProductIds.includes(product.id);
            const isMain = product.id === mainProduct.id;
            const price = product.discount_price || product.base_price;

            return (
              <div
                key={product.id}
                onClick={() => toggleSelect(product.id)}
                className={`relative rounded-lg p-3 border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-zinc-900 border-amber-400/60 shadow-lg'
                    : 'bg-zinc-900/40 border-zinc-800/60 opacity-60 hover:opacity-100'
                }`}
              >
                {!isMain && (
                  <div
                    className={`absolute top-2 right-2 w-5 h-5 rounded-full border flex items-center justify-center text-[10px] ${
                      isSelected
                        ? 'bg-amber-400 border-amber-400 text-black font-bold'
                        : 'border-zinc-600 text-transparent'
                    }`}
                  >
                    ✓
                  </div>
                )}
                {isMain && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/80 border border-zinc-700 text-[9px] font-mono uppercase text-amber-400 rounded">
                    This Item
                  </span>
                )}

                <img
                  src={product.images[0]?.url}
                  alt={product.name}
                  className="w-full h-32 object-cover rounded mb-2 bg-zinc-800"
                />
                <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest truncate">
                  {product.brand}
                </div>
                <div className="text-xs font-serif font-bold text-white truncate">
                  {product.name}
                </div>
                <div className="text-xs font-mono text-amber-400 font-bold mt-1">
                  ${price.toLocaleString()}
                </div>
              </div>
            );
          })}
        </div>

        {/* Pricing Summary & Action */}
        <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800 space-y-4 text-center md:text-left">
          <div>
            <div className="text-xs font-mono text-zinc-400 uppercase tracking-widest">Selected Outfit</div>
            <div className="text-sm text-zinc-300 font-serif mt-1">
              {selectedItems.length} Piece{selectedItems.length > 1 ? 's' : ''} Included
            </div>
          </div>

          <div className="space-y-1">
            {hasBundleDiscount && (
              <div className="text-xs text-zinc-500 line-through font-mono">
                ${rawTotal.toLocaleString()}
              </div>
            )}
            <div className="text-2xl font-bold font-mono text-amber-400">
              ${finalPrice.toLocaleString()}
            </div>
            {hasBundleDiscount && (
              <div className="text-[11px] font-mono text-emerald-400">
                Saved ${bundleDiscount.toLocaleString()} with ensemble discount
              </div>
            )}
          </div>

          <button
            onClick={handleAddBundleToBag}
            className="w-full py-3 bg-white text-black font-semibold text-xs uppercase tracking-widest hover:bg-amber-400 transition-colors shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            Add Complete Look (${finalPrice.toLocaleString()})
          </button>
        </div>
      </div>
    </section>
  );
};
