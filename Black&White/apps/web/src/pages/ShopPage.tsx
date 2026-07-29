// apps/web/src/pages/ShopPage.tsx
import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '../data/mockData';
import { CLOTHING_SIZES, FOOTWEAR_SIZES, FIT_TYPES } from '@black-white/shared';
import { Product } from '@black-white/shared';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useToast } from '../contexts/ToastContext';
import { FilterSidebar } from '../components/shop/FilterSidebar';
import { ProductCompareModal } from '../components/shop/ProductCompareModal';
import { EmptyState } from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';

export const ShopPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategorySlug = searchParams.get('category') || '';
  const selectedAgeSlug = searchParams.get('age') || '';
  const selectedBadge = searchParams.get('badge') || '';
  const initialSearch = searchParams.get('search') || '';

  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedFit, setSelectedFit] = useState<string>('');
  const maxPrice = 2000;
  const [selectedPrice, setSelectedPrice] = useState<number>(2000);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const isLoading = false;

  // Compare products state
  const [compareProducts, setCompareProducts] = useState<Product[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState<boolean>(false);

  const { addItem } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();

  const handleAddToCart = (product: Product) => {
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

  const toggleCompare = (product: Product) => {
    if (compareProducts.some((p) => p.id === product.id)) {
      setCompareProducts(compareProducts.filter((p) => p.id !== product.id));
      showToast(`Removed ${product.name} from comparison.`, 'info');
    } else {
      if (compareProducts.length >= 4) {
        showToast('You can compare a maximum of 4 products at a time.', 'info');
        return;
      }
      setCompareProducts([...compareProducts, product]);
      showToast(`Added ${product.name} to comparison list.`, 'success', 'Added To Compare');
    }
  };

  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((prod) => {
      // Category filter
      if (selectedCategorySlug) {
        const matchesCategory = prod.categories.some((c) => c.slug === selectedCategorySlug);
        if (!matchesCategory) return false;
      }

      // Age Group Filter (Highest Priority)
      if (selectedAgeSlug) {
        const matchesAge = prod.age_groups.some((a) => a.slug === selectedAgeSlug);
        if (!matchesAge) return false;
      }

      // Collection Badge filter
      if (selectedBadge === 'limited' && !prod.is_limited_edition) return false;
      if (selectedBadge === 'new' && !prod.is_new_arrival) return false;
      if (selectedBadge === 'trending' && !prod.is_trending) return false;
      if (selectedBadge === 'sale' && !prod.discount_price) return false;

      // Color filter
      if (selectedColors.length > 0) {
        const matchesColor = prod.variants.some((v) => v.color && selectedColors.includes(v.color));
        if (!matchesColor) return false;
      }

      // Size filter
      if (selectedSizes.length > 0) {
        const matchesSize = prod.variants.some((v) => v.size && selectedSizes.includes(v.size));
        if (!matchesSize) return false;
      }

      // Fit filter
      if (selectedFit) {
        const matchesFit = (prod as any).attributes?.fit?.toLowerCase() === selectedFit.toLowerCase();
        if (!matchesFit) return false;
      }

      // Price filter
      const effectivePrice = prod.discount_price || prod.base_price;
      if (effectivePrice > selectedPrice) return false;

      // Search query filter
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesName = prod.name.toLowerCase().includes(q);
        const matchesDesc = prod.short_description?.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return (a.discount_price || a.base_price) - (b.discount_price || b.base_price);
      if (sortBy === 'price_desc') return (b.discount_price || b.base_price) - (a.discount_price || a.base_price);
      if (sortBy === 'rating') return ((b as any).rating || 0) - ((a as any).rating || 0);
      return 0; // Default newest
    });
  }, [
    selectedCategorySlug,
    selectedAgeSlug,
    selectedBadge,
    selectedColors,
    selectedSizes,
    selectedFit,
    selectedPrice,
    searchQuery,
    sortBy,
  ]);

  const clearAllFilters = () => {
    setSelectedColors([]);
    setSelectedSizes([]);
    setSelectedFit('');
    setSelectedPrice(maxPrice);
    setSearchQuery('');
    searchParams.delete('category');
    searchParams.delete('age');
    searchParams.delete('badge');
    searchParams.delete('search');
    setSearchParams(searchParams);
    showToast('All filters have been reset.', 'info');
  };

  const allCategories = MOCK_CATEGORIES.map((c) => c.name);
  const availableColors = ['Midnight Black', 'Chalk White', 'Obsidian', 'Indigo', 'Charcoal'];
  const availableSizes = [...CLOTHING_SIZES, ...FOOTWEAR_SIZES.slice(0, 4)];
  const availableFits = Array.from(FIT_TYPES);

  return (
    <div className="bg-white text-black min-h-screen pt-8 pb-24">
      {/* Product Compare Modal */}
      <ProductCompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        products={compareProducts}
        onRemoveProduct={(id) => setCompareProducts(compareProducts.filter((p) => p.id !== id))}
      />

      {/* Header Banner */}
      <div className="border-b-2 border-black bg-zinc-50 py-12 px-6 mb-8">
        <div className="container mx-auto">
          <span className="text-amber-600 font-mono text-xs uppercase tracking-[0.3em] font-bold">
            Gentlemen's Bespoke Atelier
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-black uppercase tracking-tight text-black mt-1">
            {selectedCategorySlug
              ? MOCK_CATEGORIES.find((c) => c.slug === selectedCategorySlug)?.name || selectedCategorySlug
              : "Gentlemen's Haute Menswear"}
          </h1>
          <p className="text-zinc-600 text-xs md:text-sm font-light mt-2 max-w-2xl">
            Explore handcrafted luxury suits, Sea Island cotton dress shirts, and outerwear. Deeply filtered by age group, fit, and category.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Filters */}
        <div className="lg:col-span-3">
          <FilterSidebar
            categories={allCategories}
            selectedCategory={
              selectedCategorySlug
                ? MOCK_CATEGORIES.find((c) => c.slug === selectedCategorySlug)?.name || ''
                : ''
            }
            onSelectCategory={(catName) => {
              const catObj = MOCK_CATEGORIES.find((c) => c.name === catName);
              if (catObj) {
                searchParams.set('category', catObj.slug);
              } else {
                searchParams.delete('category');
              }
              setSearchParams(searchParams);
            }}
            selectedAgeSlug={selectedAgeSlug}
            onSelectAgeSlug={(ageSlug) => {
              if (ageSlug) searchParams.set('age', ageSlug);
              else searchParams.delete('age');
              setSearchParams(searchParams);
            }}
            colors={availableColors}
            selectedColors={selectedColors}
            onToggleColor={(col) =>
              setSelectedColors((prev) => (prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]))
            }
            sizes={availableSizes}
            selectedSizes={selectedSizes}
            onToggleSize={(sz) =>
              setSelectedSizes((prev) => (prev.includes(sz) ? prev.filter((s) => s !== sz) : [...prev, sz]))
            }
            fits={availableFits}
            selectedFit={selectedFit}
            onSelectFit={setSelectedFit}
            maxPrice={maxPrice}
            selectedPrice={selectedPrice}
            onChangePrice={setSelectedPrice}
            selectedBadge={selectedBadge}
            onSelectBadge={(badge) => {
              if (badge) searchParams.set('badge', badge);
              else searchParams.delete('badge');
              setSearchParams(searchParams);
            }}
            onClearAll={clearAllFilters}
          />
        </div>

        {/* Main Products Listing */}
        <div className="lg:col-span-9 space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-xl border-2 border-black gap-4 shadow-md">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-zinc-700">
                Showing <strong className="text-black font-bold">{filteredProducts.length}</strong> menswear items
              </span>
              {compareProducts.length > 0 && (
                <button
                  onClick={() => setIsCompareOpen(true)}
                  className="px-3 py-1 bg-amber-500 text-black text-[10px] uppercase font-mono font-bold tracking-widest rounded-full shadow hover:bg-black hover:text-white transition-colors"
                >
                  Compare ({compareProducts.length}) Items
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-black font-bold uppercase">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border-2 border-black text-black text-xs px-3 py-2 rounded font-mono font-bold outline-none cursor-pointer"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Highest Rating</option>
              </select>
            </div>
          </div>

          {/* Active Filters Bar */}
          {(selectedCategorySlug || selectedAgeSlug || selectedBadge || selectedFit || searchQuery) && (
            <div className="flex flex-wrap items-center gap-2 bg-zinc-100 p-3 rounded-xl border border-zinc-300 text-xs font-mono">
              <span className="text-zinc-600 uppercase text-[10px] tracking-widest pr-1 font-bold">Active:</span>
              {selectedCategorySlug && (
                <span className="px-2.5 py-1 bg-white border border-black rounded-lg text-black font-bold flex items-center gap-1">
                  Category: {selectedCategorySlug}
                  <button onClick={() => { searchParams.delete('category'); setSearchParams(searchParams); }}>✕</button>
                </span>
              )}
              {selectedAgeSlug && (
                <span className="px-2.5 py-1 bg-black border border-black rounded-lg text-white font-bold flex items-center gap-1">
                  Age: {selectedAgeSlug}
                  <button onClick={() => { searchParams.delete('age'); setSearchParams(searchParams); }}>✕</button>
                </span>
              )}
              {selectedFit && (
                <span className="px-2.5 py-1 bg-white border border-zinc-400 rounded-lg text-zinc-800 flex items-center gap-1">
                  Fit: {selectedFit}
                  <button onClick={() => setSelectedFit('')}>✕</button>
                </span>
              )}
            </div>
          )}

          {/* Products Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} variant="rect" className="h-96 w-full rounded-xl" />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <EmptyState
              title="No Menswear Items Match Refinement"
              description="Adjust your age group, category, or fit settings to view our complete haute couture catalog."
              actionText="Clear All Refinements"
              onAction={clearAllFilters}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => {
                const isCompared = compareProducts.some((p) => p.id === product.id);
                return (
                  <div
                    key={product.id}
                    className="group relative bg-white border-2 border-black rounded-2xl overflow-hidden flex flex-col justify-between hover-lift shadow-lg transition-all duration-300"
                  >
                    {/* Badges */}
                    <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
                      {product.is_limited_edition && (
                        <span className="px-2.5 py-1 bg-amber-500 text-black text-[9px] uppercase font-mono font-bold tracking-widest rounded shadow">
                          Limited
                        </span>
                      )}
                      {product.discount_price && (
                        <span className="px-2.5 py-1 bg-rose-600 text-white text-[9px] uppercase font-mono font-bold tracking-widest rounded shadow">
                          Sale
                        </span>
                      )}
                    </div>

                    {/* Utils Overlay */}
                    <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5">
                      <button
                        onClick={() => addToWishlist(product)}
                        title="Wishlist"
                        className={`p-2 rounded-full backdrop-blur-md border-2 transition-colors ${
                          isInWishlist(product.id)
                            ? 'bg-black text-amber-400 border-black'
                            : 'bg-white/80 text-black border-black hover:bg-black hover:text-white'
                        }`}
                      >
                        <svg className="w-4 h-4" fill={isInWishlist(product.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                        </svg>
                      </button>

                      <button
                        onClick={() => toggleCompare(product)}
                        title="Compare Specs"
                        className={`p-2 rounded-full backdrop-blur-md border-2 text-[10px] font-mono transition-colors ${
                          isCompared
                            ? 'bg-amber-500 text-black border-amber-500 font-bold'
                            : 'bg-white/80 text-black border-black hover:bg-black hover:text-white'
                        }`}
                      >
                        ⚖️
                      </button>
                    </div>

                    {/* Image with Zoom */}
                    <Link to={`/product/${product.slug}`} className="relative block h-80 overflow-hidden bg-zinc-100 img-zoom-container">
                      <img
                        src={product.images[0]?.url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </Link>

                    {/* Product Info */}
                    <div className="p-5 flex flex-col flex-1 justify-between bg-white border-t-2 border-black">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-amber-600 uppercase tracking-widest font-bold">
                            {product.brand}
                          </span>
                          {product.age_groups[0] && (
                            <span className="text-[9px] font-mono bg-zinc-100 border border-zinc-300 text-black px-2 py-0.5 rounded font-bold">
                              {product.age_groups[0].name}
                            </span>
                          )}
                        </div>

                        <Link to={`/product/${product.slug}`}>
                          <h3 className="font-serif text-base font-bold text-black uppercase hover:text-amber-600 transition-colors mt-1">
                            {product.name}
                          </h3>
                        </Link>
                        <p className="text-zinc-600 text-xs font-light mt-1.5 line-clamp-2">
                          {product.short_description}
                        </p>
                      </div>

                      {/* Pricing & Add to Cart */}
                      <div className="mt-5 pt-3 border-t border-zinc-200 flex items-center justify-between">
                        <div>
                          {product.discount_price ? (
                            <div className="flex items-center gap-2">
                              <span className="text-black font-mono font-bold text-base">
                                ${product.discount_price.toLocaleString()}
                              </span>
                              <span className="text-zinc-400 line-through text-xs font-mono">
                                ${product.base_price.toLocaleString()}
                              </span>
                            </div>
                          ) : (
                            <span className="text-black font-mono font-bold text-base">
                              ${product.base_price.toLocaleString()}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="px-3.5 py-1.5 bg-black text-white text-[10px] font-mono uppercase font-bold tracking-wider hover:bg-amber-500 hover:text-black transition-colors rounded-lg shadow"
                        >
                          + Add Bag
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
