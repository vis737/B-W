// apps/web/src/pages/WishlistPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../contexts/ToastContext';
import { EmptyState } from '../components/ui/EmptyState';

export const WishlistPage: React.FC = () => {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addItem } = useCart();
  const { showToast } = useToast();

  const handleMoveToCart = (product: typeof wishlist[0]) => {
    const variant = product.variants[0];
    addItem({
      id: `${product.id}-${variant.id}`,
      product_id: product.id,
      variant_id: variant.id,
      product_name: product.name,
      product_slug: product.slug,
      image_url: product.images[0].url,
      color: variant.color,
      size: variant.size,
      quantity: 1,
      unit_price: product.base_price,
      discount_price: product.discount_price,
      total_price: product.discount_price || product.base_price
    });
    removeFromWishlist(product.id);
    showToast(`Moved ${product.name} to shopping bag.`, 'success', 'Bag Updated');
  };

  const handleShareWishlist = () => {
    navigator.clipboard?.writeText?.(window.location.href);
    showToast('Wishlist link copied to clipboard.', 'info', 'Link Copied');
  };

  return (
    <div className="bg-black text-white min-h-screen pt-12 pb-24">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-zinc-800 mb-8 gap-4">
          <div>
            <span className="text-amber-400 font-mono text-xs uppercase tracking-[0.3em]">Saved Selection</span>
            <h1 className="text-3xl font-serif font-black uppercase tracking-tight mt-1">My Wishlist ({wishlist.length})</h1>
          </div>

          {wishlist.length > 0 && (
            <div className="flex gap-3">
              <button
                onClick={handleShareWishlist}
                className="px-4 py-2 border border-zinc-700 text-xs uppercase font-bold tracking-widest text-zinc-300 hover:text-white hover:border-zinc-500 transition-all rounded"
              >
                Share Wishlist
              </button>
              <button
                onClick={clearWishlist}
                className="px-4 py-2 text-xs uppercase font-mono text-red-400 hover:text-red-300 transition-colors"
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {wishlist.length === 0 ? (
          <EmptyState
            title="Your Wishlist Is Empty"
            description="Explore our haute couture collections and click the heart icon to save garments for future consideration."
            actionText="Discover Collection"
            actionLink="/shop"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((product) => (
              <div key={product.id} className="bg-zinc-950 border border-zinc-800 rounded overflow-hidden flex flex-col justify-between group">
                <div className="relative h-80 overflow-hidden bg-zinc-900">
                  <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="absolute top-3 right-3 p-2 bg-black/70 rounded-full text-zinc-400 hover:text-white transition-colors"
                    title="Remove item"
                  >
                    ✕
                  </button>
                </div>

                <div className="p-5 space-y-4">
                  <div>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">{product.brand}</span>
                    <Link to={`/product/${product.slug}`}>
                      <h3 className="font-serif font-bold text-white uppercase text-base hover:text-amber-400 transition-colors mt-0.5">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-amber-400 font-bold text-sm mt-1">${(product.discount_price || product.base_price).toFixed(2)}</p>
                  </div>

                  <button
                    onClick={() => handleMoveToCart(product)}
                    className="w-full py-2.5 bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-amber-400 transition-colors rounded"
                  >
                    Move to Bag
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
