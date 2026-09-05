// apps/web/src/pages/HomePage.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { MOCK_PRODUCTS, MOCK_CATEGORIES, MOCK_AGE_GROUPS, MOCK_BANNERS } from '../data/mockData';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useToast } from '../contexts/ToastContext';

export const HomePage: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeAgeIndex, setActiveAgeIndex] = useState(7); // Young Adult / Adult Gentlemen
  const { addItem } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();

  // Flash sale countdown timer
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 32, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAddToCart = (product: typeof MOCK_PRODUCTS[0]) => {
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
      total_price: product.discount_price || product.base_price,
    });
    showToast(`Added ${product.name} to shopping bag.`, 'success', 'Bag Updated');
  };

  return (
    <div className="w-full bg-white text-black min-h-screen">
      {/* 1. HERO BANNER CAROUSEL (HIGH-CONTRAST B&W) */}
      <section className="relative h-[90vh] w-full overflow-hidden flex items-center justify-center bg-black">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="absolute inset-0 z-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${MOCK_BANNERS[currentSlide % MOCK_BANNERS.length].image_url}')` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/70" />
          </motion.div>
        </AnimatePresence>

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto flex flex-col items-center">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-amber-400 font-mono text-xs uppercase tracking-[0.4em] mb-4 font-bold border-2 border-amber-400/40 px-5 py-1.5 backdrop-blur-md rounded-full shadow-lg"
          >
            Gentlemen's Haute Couture • Autumn Winter ’26
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-7xl lg:text-8xl font-serif font-black tracking-tight uppercase leading-none text-white mb-6"
          >
            {MOCK_BANNERS[currentSlide % MOCK_BANNERS.length].title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-zinc-300 font-sans text-sm md:text-lg font-light tracking-widest max-w-2xl uppercase mb-10 leading-relaxed"
          >
            {MOCK_BANNERS[currentSlide % MOCK_BANNERS.length].subtitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-5"
          >
            <Link
              to="/shop"
              className="px-10 py-4 bg-white text-black font-mono font-bold text-xs uppercase tracking-[0.25em] hover:bg-amber-400 transition-all duration-300 shadow-2xl hover-lift"
            >
              Explore Gentlemen Catalog &rarr;
            </Link>
          </motion.div>
        </div>

        {/* Carousel indicators */}
        <div className="absolute bottom-8 z-20 flex gap-3">
          {MOCK_BANNERS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 transition-all duration-300 cursor-pointer ${
                currentSlide === idx ? 'w-10 bg-amber-400' : 'w-3 bg-zinc-600 hover:bg-white'
              }`}
            />
          ))}
        </div>
      </section>

      {/* 2. GENTLEMEN CATEGORIES SHOWCASE GRID (WHITE BACKGROUND, BLACK BORDERS) */}
      <section className="py-24 px-6 container mx-auto bg-white text-black">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b-2 border-black pb-6 gap-4">
          <div>
            <span className="text-amber-600 font-mono text-xs uppercase tracking-[0.3em] font-bold">
              Atelier Index Strictly For Gentlemen
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-black uppercase tracking-tight text-black mt-1">
              Bespoke Menswear Categories
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs uppercase font-bold font-mono tracking-[0.2em] text-black hover:text-amber-600 transition-colors underline-sweep"
          >
            Explore All 35+ Categories &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-5">
          {MOCK_CATEGORIES.slice(0, 12).map((cat) => (
            <Link
              key={cat.id}
              to={`/shop?category=${cat.slug}`}
              className="group relative aspect-[4/5] sm:aspect-auto sm:h-64 overflow-hidden rounded-xl border-2 border-black bg-zinc-900 flex flex-col justify-end p-3 sm:p-4 transition-all duration-300 hover-lift shadow-md"
            >
              <img
                src={cat.image_url}
                alt={cat.name}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-110 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="relative z-10">
                <h3 className="font-serif text-sm sm:text-lg font-bold uppercase tracking-wider text-white group-hover:text-amber-400 transition-colors">
                  {cat.name}
                </h3>
                <p className="hidden sm:block text-[11px] font-sans text-zinc-300 line-clamp-1 mt-0.5">{cat.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. AGE-BASED MENSWEAR MATRIX (STARK CONTRAST PANEL) */}
      <section className="py-24 bg-zinc-50 border-b-2 border-black text-black">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-amber-600 font-mono text-xs uppercase tracking-[0.3em] font-bold">
              Generational Menswear Precision
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-black uppercase text-black">
              Shop Gentlemen By Age Bracket
            </h2>
            <p className="text-zinc-600 text-sm font-light">
              Tailored proportions for every milestone from young gentleman distinction to senior executive heritage.
            </p>
          </div>

          {/* Age Group Tab Bar */}
          <div className="flex overflow-x-auto gap-2.5 pb-6 scrollbar-thin border-b-2 border-zinc-300">
            {MOCK_AGE_GROUPS.map((ag, idx) => (
              <button
                key={ag.id}
                onClick={() => setActiveAgeIndex(idx)}
                className={`px-5 py-2.5 rounded-full text-xs font-mono font-bold uppercase tracking-widest whitespace-nowrap transition-all duration-300 cursor-pointer ${
                  activeAgeIndex === idx
                    ? 'bg-black text-white shadow-lg scale-105'
                    : 'bg-white text-zinc-700 border border-zinc-300 hover:bg-zinc-100 hover:text-black'
                }`}
              >
                {ag.name}
              </button>
            ))}
          </div>

          {/* Active Age Group Spotlight */}
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 relative h-96 rounded-2xl overflow-hidden border-2 border-black shadow-xl hover-lift">
              <img
                src={MOCK_AGE_GROUPS[activeAgeIndex].image_url}
                alt={MOCK_AGE_GROUPS[activeAgeIndex].name}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent p-8 flex flex-col justify-end text-white">
                <span className="text-amber-400 text-xs font-mono uppercase tracking-widest font-bold">
                  Active Age Bracket
                </span>
                <h3 className="text-3xl font-serif font-black uppercase">{MOCK_AGE_GROUPS[activeAgeIndex].name}</h3>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <h3 className="text-2xl font-serif font-bold uppercase tracking-wider text-black">
                Featured Menswear for {MOCK_AGE_GROUPS[activeAgeIndex].name}
              </h3>
              <p className="text-zinc-600 text-sm font-light leading-relaxed">
                Handcrafted apparel specifically graded for {MOCK_AGE_GROUPS[activeAgeIndex].name}. Featuring Italian wool-silk blazers, Sea Island cotton shirts, and tapered trousers tailored to perfection.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {MOCK_PRODUCTS.slice(0, 2).map((prod) => (
                  <div key={prod.id} className="p-4 border-2 border-black rounded-xl bg-white flex gap-4 items-center hover-lift shadow-md">
                    <img src={prod.images[0].url} alt={prod.name} loading="lazy" decoding="async" className="w-16 h-20 object-cover rounded-lg bg-zinc-100" />
                    <div>
                      <h4 className="font-serif text-sm font-bold text-black line-clamp-1">{prod.name}</h4>
                      <p className="text-amber-600 font-mono font-bold text-xs mt-1">${prod.base_price.toLocaleString()}</p>
                      <Link to={`/product/${prod.slug}`} className="text-[11px] font-mono uppercase tracking-widest text-black hover:text-amber-600 mt-1 inline-block font-bold">
                        View Item &rarr;
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                to={`/shop?age=${MOCK_AGE_GROUPS[activeAgeIndex].slug}`}
                className="inline-block px-8 py-3.5 bg-black text-white font-mono text-xs uppercase font-bold tracking-[0.2em] hover:bg-amber-500 hover:text-black transition-all shadow-lg hover-lift"
              >
                Shop All {MOCK_AGE_GROUPS[activeAgeIndex].name} &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FLASH SALE PRIVATE EVENT (BLACK & GOLD FLASH) */}
      <section className="py-16 bg-black text-white border-b-2 border-black">
        <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-mono uppercase tracking-widest mb-2 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
              <span>Gentlemen Private Event</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-black uppercase text-white">24-Hour Flash Suit Sale</h2>
            <p className="text-zinc-400 text-sm font-light mt-1">Receive up to 25% off selected Italian suits, silk shirts & overcoats.</p>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-4 bg-zinc-900 border-2 border-amber-500/50 px-8 py-4 rounded-2xl shadow-2xl">
            <div className="text-center">
              <span className="text-3xl font-mono font-bold text-amber-400">{String(timeLeft.hours).padStart(2, '0')}</span>
              <span className="block text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-bold">Hours</span>
            </div>
            <span className="text-2xl text-amber-400 font-bold">:</span>
            <div className="text-center">
              <span className="text-3xl font-mono font-bold text-amber-400">{String(timeLeft.minutes).padStart(2, '0')}</span>
              <span className="block text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-bold">Mins</span>
            </div>
            <span className="text-2xl text-amber-400 font-bold">:</span>
            <div className="text-center">
              <span className="text-3xl font-mono font-bold text-amber-400">{String(timeLeft.seconds).padStart(2, '0')}</span>
              <span className="block text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-bold">Secs</span>
            </div>
          </div>

          <Link
            to="/shop?badge=sale"
            className="px-8 py-4 bg-amber-400 text-black font-mono text-xs uppercase font-bold tracking-[0.2em] hover:bg-white transition-colors hover-lift"
          >
            Access Private Sale &rarr;
          </Link>
        </div>
      </section>

      {/* 6. FEATURED GENTLEMEN PRODUCTS GRID (WHITE CARDS WITH B&W CONTRAST) */}
      <section className="py-24 container mx-auto px-6 bg-white text-black">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <span className="text-amber-600 font-mono text-xs uppercase tracking-[0.3em] font-bold">
            Haute Couture Editions
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-black uppercase tracking-tight text-black">
            Featured Menswear Pieces
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
          {MOCK_PRODUCTS.map((product) => (
            <div
              key={product.id}
              className="group relative bg-white border-2 border-black rounded-xl sm:rounded-2xl overflow-hidden flex flex-col justify-between hover-lift shadow-lg transition-all duration-300"
            >
              {/* Badges */}
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
                {product.is_limited_edition && (
                  <span className="px-2.5 py-1 bg-amber-500 text-black text-[10px] uppercase font-mono font-bold tracking-wider rounded-md shadow">
                    Limited
                  </span>
                )}
                {product.discount_price && (
                  <span className="px-2.5 py-1 bg-red-600 text-white text-[10px] uppercase font-mono font-bold tracking-wider rounded-md shadow">
                    Sale
                  </span>
                )}
              </div>

              {/* Wishlist button */}
              <button
                onClick={() => addToWishlist(product)}
                className={`absolute top-4 right-4 z-10 p-2.5 rounded-full backdrop-blur-md border-2 transition-colors ${
                  isInWishlist(product.id)
                    ? 'bg-black text-amber-400 border-black'
                    : 'bg-white/80 text-black border-black hover:bg-black hover:text-white'
                }`}
                title="Add to Wishlist"
              >
                <svg className="w-4 h-4" fill={isInWishlist(product.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                </svg>
              </button>

              {/* Product Image with Zoom Effect */}
              <div className="relative">
                <Link to={`/product/${product.slug}`} className="block overflow-hidden bg-zinc-100 img-zoom-container aspect-[3/4]">
                  <img
                    src={product.images[0].url}
                    alt={product.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                </Link>
                {/* Mobile quick-add (kept outside the link for valid markup) */}
                <button
                  onClick={() => handleAddToCart(product)}
                  aria-label={`Add ${product.name} to bag`}
                  className="absolute bottom-3 right-3 z-10 flex sm:hidden items-center justify-center w-11 h-11 rounded-full bg-black/90 text-white border border-white/25 shadow-xl backdrop-blur-sm hover:bg-amber-500 hover:text-black active:scale-90 transition-all duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                  </svg>
                </button>
              </div>

              {/* Product Details */}
              <div className="p-3 sm:p-4 lg:p-6 flex flex-col flex-1 justify-between bg-white border-t-2 border-black">
                <div>
                  <span className="text-[10px] sm:text-[11px] font-mono text-zinc-500 uppercase tracking-widest font-bold line-clamp-1">
                    {product.brand}
                  </span>
                  <Link to={`/product/${product.slug}`}>
                    <h3 className="font-serif text-sm sm:text-base lg:text-lg font-bold text-black uppercase hover:text-amber-600 transition-colors mt-1 leading-snug line-clamp-2">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="hidden sm:block text-zinc-600 text-xs font-light mt-2 line-clamp-2">{product.short_description}</p>
                </div>

                <div className="mt-2 sm:mt-6 pt-2 sm:pt-4 border-t border-zinc-200 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    {product.discount_price ? (
                      <div className="flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
                        <span className="text-black font-mono font-bold text-sm sm:text-lg">${product.discount_price.toLocaleString()}</span>
                        <span className="text-zinc-400 line-through text-[10px] sm:text-xs font-mono hidden min-[420px]:inline">${product.base_price.toLocaleString()}</span>
                      </div>
                    ) : (
                      <span className="text-black font-mono font-bold text-sm sm:text-lg">${product.base_price.toLocaleString()}</span>
                    )}
                  </div>
                  <Button
                    onClick={() => handleAddToCart(product)}
                    variant="outline"
                    size="sm"
                    className="hidden sm:inline-flex text-[11px] font-mono uppercase tracking-wider font-bold border-2 border-black hover:bg-black hover:text-white px-3 py-1.5"
                  >
                    + Add Bag
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
