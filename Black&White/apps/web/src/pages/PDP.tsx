// apps/web/src/pages/PDP.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_PRODUCTS, MOCK_REVIEWS } from '../data/mockData';
import { Button } from '../components/ui/Button';
import { StickyAddToCart } from '../components/ui/StickyAddToCart';
import { CompleteTheLook } from '../components/shop/CompleteTheLook';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useToast } from '../contexts/ToastContext';

export const PDP: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const product = MOCK_PRODUCTS.find((p) => p.slug === slug) || MOCK_PRODUCTS[0];

  const [selectedColor, setSelectedColor] = useState(product.variants[0]?.color || '');
  const [selectedSize, setSelectedSize] = useState(product.variants[0]?.size || '');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showFitGuideModal, setShowFitGuideModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Gift options state
  const [isGiftWrapped, setIsGiftWrapped] = useState(false);
  const [giftMessage, setGiftMessage] = useState('');

  // Review Form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewBody, setReviewBody] = useState('');

  const { addItem } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();

  // Track Recently Viewed
  useEffect(() => {
    if (product) {
      const saved = localStorage.getItem('bw_recently_viewed');
      let list: string[] = saved ? JSON.parse(saved) : [];
      list = [product.id, ...list.filter((id) => id !== product.id)].slice(0, 8);
      localStorage.setItem('bw_recently_viewed', JSON.stringify(list));
    }
  }, [product]);

  const selectedVariant =
    product.variants.find((v) => v.color === selectedColor && v.size === selectedSize) ||
    product.variants[0];

  const handleAddToCart = () => {
    addItem({
      id: `${product.id}-${selectedVariant.id}`,
      product_id: product.id,
      variant_id: selectedVariant.id,
      product_name: product.name,
      product_slug: product.slug,
      image_url: product.images[activeImageIndex]?.url || product.images[0].url,
      color: selectedColor,
      size: selectedSize,
      quantity: 1,
      unit_price: product.base_price,
      discount_price: product.discount_price,
      total_price: product.discount_price || product.base_price,
    });

    if (isGiftWrapped) {
      showToast(`Added ${product.name} with Luxury Gift Packaging & Card.`, 'success', 'Gift Package Added');
    } else {
      showToast(`Added ${product.name} to shopping bag.`, 'success', 'Bag Updated');
    }
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Your review has been submitted for moderation.', 'success', 'Review Submitted');
    setShowReviewModal(false);
    setReviewTitle('');
    setReviewBody('');
  };

  const pointsEarned = Math.floor((product.discount_price || product.base_price) / 10);
  const suggestedEnsemble = MOCK_PRODUCTS.filter((p) => p.id !== product.id).slice(0, 2);

  return (
    <div className="bg-black text-white min-h-screen pt-8 pb-24">
      {/* Bottom Sticky Add To Cart */}
      <StickyAddToCart
        product={product}
        selectedVariant={selectedVariant}
        onAddToCart={handleAddToCart}
      />

      {/* Breadcrumb Navigation */}
      <div className="container mx-auto px-6 mb-8 text-xs font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-2">
        <Link to="/" className="hover:text-amber-400">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-amber-400">Shop</Link>
        <span>/</span>
        <span className="text-white font-bold">{product.name}</span>
      </div>

      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Side: Image Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative h-[550px] md:h-[650px] w-full overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 shadow-2xl">
            <img
              src={product.images[activeImageIndex]?.url || product.images[0].url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.is_limited_edition && (
              <span className="absolute top-4 left-4 px-3 py-1 bg-amber-400 text-black text-xs font-mono font-bold uppercase tracking-widest rounded shadow">
                Limited Edition
              </span>
            )}
          </div>

          {/* Thumbnails */}
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
            {product.images.map((img, idx) => (
              <button
                key={img.id}
                onClick={() => setActiveImageIndex(idx)}
                className={`w-24 h-32 rounded-lg overflow-hidden border transition-all ${
                  activeImageIndex === idx
                    ? 'border-amber-400 ring-2 ring-amber-400/20'
                    : 'border-zinc-800 opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img.url} alt={img.alt_text} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Specifications & Actions */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-amber-400 uppercase tracking-widest">{product.brand}</span>
              {product.age_groups[0] && (
                <span className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-300 rounded">
                  {product.age_groups[0].name}
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-black uppercase text-white tracking-tight mt-1">
              {product.name}
            </h1>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-xs font-mono text-amber-400">
                ⭐ {product.average_rating || 4.8} / 5.0 ({product.review_count || 18} Patron Reviews)
              </span>
              <span className="text-xs font-mono text-zinc-500">• SKU: {product.sku}</span>
            </div>
          </div>

          {/* Price & Reward points */}
          <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl space-y-1">
            <div className="flex items-baseline gap-3">
              {product.discount_price ? (
                <>
                  <span className="text-3xl font-mono font-bold text-amber-400">
                    ${product.discount_price.toLocaleString()}
                  </span>
                  <span className="text-base font-mono text-zinc-500 line-through">
                    ${product.base_price.toLocaleString()}
                  </span>
                </>
              ) : (
                <span className="text-3xl font-mono font-bold text-white">
                  ${product.base_price.toLocaleString()}
                </span>
              )}
            </div>
            <div className="text-xs font-mono text-amber-400/90 pt-1">
              ✨ Earn <strong className="font-bold">{pointsEarned} Reward Points</strong> with this purchase.
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-zinc-300 font-light leading-relaxed">
            {product.description}
          </p>

          {/* Color Selector */}
          <div>
            <div className="flex justify-between items-center text-xs font-mono text-zinc-400 uppercase mb-2">
              <span>Color Selection:</span>
              <span className="text-white font-bold">{selectedColor}</span>
            </div>
            <div className="flex gap-3">
              {Array.from(new Set(product.variants.map((v) => v.color))).map((col) => (
                <button
                  key={col}
                  onClick={() => setSelectedColor(col || '')}
                  className={`px-4 py-2 text-xs font-mono uppercase rounded border transition-all ${
                    selectedColor === col
                      ? 'bg-amber-400 text-black border-amber-400 font-bold shadow'
                      : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  {col}
                </button>
              ))}
            </div>
          </div>

          {/* Size Selector */}
          <div>
            <div className="flex justify-between items-center text-xs font-mono text-zinc-400 uppercase mb-2">
              <span>Size Selection:</span>
              <button
                onClick={() => setShowFitGuideModal(true)}
                className="text-amber-400 hover:underline uppercase text-[11px]"
              >
                Size & Measurement Guide 📐
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedSize(v.size || '')}
                  className={`w-12 h-12 rounded-lg font-mono text-xs border flex items-center justify-center transition-all ${
                    selectedSize === v.size
                      ? 'bg-white text-black border-white font-bold shadow-lg'
                      : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  {v.size}
                </button>
              ))}
            </div>
          </div>

          {/* Luxury Gift Options Toggle */}
          <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-3">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-300 flex items-center gap-2">
                <span>🎁</span> Signature Bespoke Gift Packaging
              </span>
              <input
                type="checkbox"
                checked={isGiftWrapped}
                onChange={(e) => setIsGiftWrapped(e.target.checked)}
                className="accent-amber-400 w-4 h-4 cursor-pointer"
              />
            </label>

            {isGiftWrapped && (
              <textarea
                value={giftMessage}
                onChange={(e) => setGiftMessage(e.target.value)}
                placeholder="Include personalized hand-written calligraphy card message..."
                rows={2}
                className="w-full bg-black border border-zinc-800 text-xs text-white p-3 rounded focus:outline-none focus:border-amber-400 placeholder-zinc-600"
              />
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-2">
            <Button
              variant="primary"
              size="lg"
              onClick={handleAddToCart}
              className="flex-1 uppercase font-bold text-xs tracking-widest py-4 bg-white text-black hover:bg-amber-400 transition-colors shadow-xl"
            >
              Add To Shopping Bag (${(product.discount_price || product.base_price).toLocaleString()})
            </Button>

            <button
              onClick={() => addToWishlist(product)}
              className={`px-5 rounded-lg border transition-colors ${
                isInWishlist(product.id)
                  ? 'bg-amber-400 text-black border-amber-400'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
              }`}
            >
              ♥
            </button>
          </div>

          {/* Guarantee Badges */}
          <div className="grid grid-cols-3 gap-2 text-center pt-4 border-t border-zinc-800 text-[10px] font-mono text-zinc-400">
            <div className="p-2 bg-zinc-950 rounded border border-zinc-900">
              <div className="text-amber-400 text-base mb-1">✈️</div>
              <div>Free Priority Courier</div>
            </div>
            <div className="p-2 bg-zinc-950 rounded border border-zinc-900">
              <div className="text-amber-400 text-base mb-1">🛡️</div>
              <div>30-Day Atelier Return</div>
            </div>
            <div className="p-2 bg-zinc-950 rounded border border-zinc-900">
              <div className="text-amber-400 text-base mb-1">🏛️</div>
              <div>Direct Wire Transfer</div>
            </div>
          </div>
        </div>
      </div>

      {/* Complete The Ensemble Styling Section */}
      <div className="container mx-auto px-6 mt-16">
        <CompleteTheLook mainProduct={product} suggestedItems={suggestedEnsemble} />
      </div>

      {/* Reviews Section */}
      <section className="container mx-auto px-6 mt-20 border-t border-zinc-800 pt-12 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-amber-400">Patron Feedback</span>
            <h2 className="text-2xl font-serif font-black uppercase text-white mt-1">Verified Client Reviews</h2>
          </div>
          <Button
            variant="outline"
            size="md"
            onClick={() => setShowReviewModal(true)}
            className="uppercase font-mono text-xs border-amber-500/40 text-amber-400 hover:bg-amber-400 hover:text-black"
          >
            Write a Review
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MOCK_REVIEWS.slice(0, 4).map((rev) => (
            <div key={rev.id} className="bg-zinc-950 border border-zinc-800 p-6 rounded-xl space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-serif font-bold text-white uppercase text-sm">{rev.customer_name}</div>
                  <div className="text-[10px] font-mono text-emerald-400 mt-0.5">✓ Verified Patron Purchase</div>
                </div>
                <div className="text-amber-400 text-xs font-mono">{'★'.repeat(rev.rating)}</div>
              </div>
              <p className="text-xs text-zinc-300 font-light italic">"{rev.body}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* Fit Guide Modal */}
      {showFitGuideModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-xl max-w-xl w-full space-y-6">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
              <h3 className="font-serif font-bold text-lg uppercase text-white">Size & Measurement Matrix</h3>
              <button onClick={() => setShowFitGuideModal(false)} className="text-zinc-500 hover:text-white">✕</button>
            </div>
            <table className="w-full text-left text-xs font-mono text-zinc-300">
              <thead>
                <tr className="border-b border-zinc-800 text-amber-400">
                  <th className="pb-2">Size</th>
                  <th className="pb-2">Chest (in)</th>
                  <th className="pb-2">Waist (in)</th>
                  <th className="pb-2">Shoulder (in)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                <tr><td className="py-2.5 font-bold text-white">S</td><td>36 - 38</td><td>30 - 31</td><td>17.5</td></tr>
                <tr><td className="py-2.5 font-bold text-white">M</td><td>39 - 41</td><td>32 - 34</td><td>18.2</td></tr>
                <tr><td className="py-2.5 font-bold text-white">L</td><td>42 - 44</td><td>35 - 37</td><td>19.0</td></tr>
                <tr><td className="py-2.5 font-bold text-white">XL</td><td>45 - 47</td><td>38 - 40</td><td>19.8</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-xl max-w-lg w-full space-y-6">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
              <h3 className="font-serif font-bold text-lg uppercase text-white">Submit Review</h3>
              <button onClick={() => setShowReviewModal(false)} className="text-zinc-500 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleAddReview} className="space-y-4">
              <div>
                <label className="text-xs uppercase font-mono text-zinc-400 block mb-1">Rating</label>
                <div className="flex gap-2 text-xl text-amber-400 cursor-pointer">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} onClick={() => setReviewRating(star)}>
                      {star <= reviewRating ? '★' : '☆'}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs uppercase font-mono text-zinc-400 block mb-1">Title</label>
                <input
                  type="text"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="Summary of experience"
                  className="w-full bg-black border border-zinc-800 text-white text-xs px-3 py-2 rounded outline-none focus:border-amber-400"
                  required
                />
              </div>
              <div>
                <label className="text-xs uppercase font-mono text-zinc-400 block mb-1">Review Details</label>
                <textarea
                  rows={4}
                  value={reviewBody}
                  onChange={(e) => setReviewBody(e.target.value)}
                  placeholder="Share details on sizing, fabric drape, and craftsmanship..."
                  className="w-full bg-black border border-zinc-800 text-white text-xs p-3 rounded outline-none focus:border-amber-400"
                  required
                />
              </div>
              <Button type="submit" variant="primary" size="md" className="w-full uppercase font-bold text-xs tracking-widest py-3">
                Post Review
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PDP;
