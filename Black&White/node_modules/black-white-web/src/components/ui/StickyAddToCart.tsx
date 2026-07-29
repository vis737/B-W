// apps/web/src/components/ui/StickyAddToCart.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product, ProductVariant } from '@black-white/shared';

interface StickyAddToCartProps {
  product: Product;
  selectedVariant: ProductVariant;
  onAddToCart: () => void;
}

export const StickyAddToCart: React.FC<StickyAddToCartProps> = ({
  product,
  selectedVariant,
  onAddToCart,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show when user scrolls past 500px
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const price = product.discount_price || product.base_price;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 border-t border-amber-500/20 backdrop-blur-lg px-6 py-4 shadow-2xl"
        >
          <div className="container mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              {product.images[0] && (
                <img
                  src={product.images[0].url}
                  alt={product.name}
                  className="w-12 h-12 object-cover rounded border border-zinc-800 flex-shrink-0"
                />
              )}
              <div className="truncate">
                <h4 className="text-sm font-serif font-bold text-white uppercase tracking-wider truncate">
                  {product.name}
                </h4>
                <div className="text-xs text-zinc-400 flex items-center gap-2">
                  <span>Size: {selectedVariant.size || 'Standard'}</span>
                  <span>•</span>
                  <span>Color: {selectedVariant.color || 'Obsidian'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 flex-shrink-0">
              <div className="text-right hidden sm:block">
                <div className="text-xs text-zinc-400 uppercase tracking-widest">Price</div>
                <div className="text-base font-bold text-amber-400 font-mono">${price.toLocaleString()}</div>
              </div>
              <button
                onClick={onAddToCart}
                className="px-6 py-3 bg-white text-black font-semibold text-xs uppercase tracking-widest hover:bg-amber-400 transition-colors shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                Add to Bag
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
