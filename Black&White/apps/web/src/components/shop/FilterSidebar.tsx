// apps/web/src/components/shop/FilterSidebar.tsx
import React, { useState } from 'react';
import { AGE_GROUPS } from '@black-white/shared';

interface FilterSidebarProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  selectedAgeSlug: string;
  onSelectAgeSlug: (ageSlug: string) => void;
  colors: string[];
  selectedColors: string[];
  onToggleColor: (color: string) => void;
  sizes: string[];
  selectedSizes: string[];
  onToggleSize: (size: string) => void;
  fits: string[];
  selectedFit: string;
  onSelectFit: (fit: string) => void;
  maxPrice: number;
  selectedPrice: number;
  onChangePrice: (price: number) => void;
  selectedBadge: string;
  onSelectBadge: (badge: string) => void;
  onClearAll: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  selectedAgeSlug,
  onSelectAgeSlug,
  colors,
  selectedColors,
  onToggleColor,
  sizes,
  selectedSizes,
  onToggleSize,
  fits,
  selectedFit,
  onSelectFit,
  maxPrice,
  selectedPrice,
  onChangePrice,
  selectedBadge,
  onSelectBadge,
  onClearAll,
}) => {
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (section: string) => {
    setCollapsedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const hasActiveFilters =
    Boolean(selectedCategory) ||
    Boolean(selectedAgeSlug) ||
    selectedColors.length > 0 ||
    selectedSizes.length > 0 ||
    Boolean(selectedFit) ||
    Boolean(selectedBadge) ||
    selectedPrice < maxPrice;

  return (
    <aside className="w-full md:w-72 flex flex-col gap-6 font-sans text-xs bg-white border-2 border-black rounded-2xl p-6 shadow-xl">
      {/* Sidebar Header */}
      <div className="flex justify-between items-center pb-4 border-b-2 border-black">
        <div className="flex items-center gap-2">
          <span className="text-amber-600 font-mono text-xs font-bold">❖</span>
          <h3 className="font-serif font-black uppercase text-black tracking-widest text-sm">
            Refine Gentlemen Catalog
          </h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onClearAll}
            className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-600 hover:text-black transition-colors"
          >
            Reset All
          </button>
        )}
      </div>

      {/* 1. AGE GROUP FILTER (PRIMARY PRIORITY) */}
      <section className="border-b border-zinc-200 pb-5">
        <div
          onClick={() => toggleSection('age')}
          className="flex justify-between items-center cursor-pointer mb-3 select-none"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <h4 className="font-bold text-black uppercase tracking-widest text-xs">
              Age Group (Primary)
            </h4>
          </div>
          <span className="text-black font-bold">{collapsedSections['age'] ? '+' : '−'}</span>
        </div>

        {!collapsedSections['age'] && (
          <div className="flex flex-col gap-1.5 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
            <button
              onClick={() => onSelectAgeSlug('')}
              className={`text-left px-3 py-1.5 rounded-lg transition-all font-mono ${
                !selectedAgeSlug
                  ? 'bg-black text-white font-bold'
                  : 'text-zinc-700 hover:bg-zinc-100 hover:text-black font-medium'
              }`}
            >
              <span>All Ages</span>
              {!selectedAgeSlug && <span className="float-right">✓</span>}
            </button>
            {AGE_GROUPS.map((ag) => (
              <button
                key={ag.slug}
                onClick={() => onSelectAgeSlug(ag.slug === selectedAgeSlug ? '' : ag.slug)}
                className={`text-left px-3 py-1.5 rounded-lg transition-all font-mono ${
                  selectedAgeSlug === ag.slug
                    ? 'bg-black text-white font-bold'
                    : 'text-zinc-700 hover:bg-zinc-100 hover:text-black font-medium'
                }`}
              >
                <span>{ag.name}</span>
                {selectedAgeSlug === ag.slug && <span className="float-right text-amber-400">✓</span>}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* 2. CATEGORY */}
      <section className="border-b border-zinc-200 pb-5">
        <div
          onClick={() => toggleSection('category')}
          className="flex justify-between items-center cursor-pointer mb-3 select-none"
        >
          <h4 className="font-bold text-black uppercase tracking-widest text-xs">
            Menswear Category
          </h4>
          <span className="text-black font-bold">{collapsedSections['category'] ? '+' : '−'}</span>
        </div>

        {!collapsedSections['category'] && (
          <div className="flex flex-col gap-1 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
            <button
              onClick={() => onSelectCategory('')}
              className={`text-left px-3 py-1.5 rounded-lg transition-colors ${
                !selectedCategory ? 'bg-zinc-100 font-bold text-black' : 'text-zinc-600 hover:text-black'
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat === selectedCategory ? '' : cat)}
                className={`text-left px-3 py-1.5 rounded-lg transition-colors ${
                  selectedCategory === cat ? 'bg-zinc-100 font-bold text-black' : 'text-zinc-600 hover:text-black'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* 3. COLLECTION STATUS */}
      <section className="border-b border-zinc-200 pb-5">
        <div
          onClick={() => toggleSection('collection')}
          className="flex justify-between items-center cursor-pointer mb-3 select-none"
        >
          <h4 className="font-bold text-black uppercase tracking-widest text-xs">
            Collection Status
          </h4>
          <span className="text-black font-bold">{collapsedSections['collection'] ? '+' : '−'}</span>
        </div>

        {!collapsedSections['collection'] && (
          <div className="flex flex-wrap gap-1.5">
            {[
              { label: 'Limited Edition', value: 'limited' },
              { label: 'New Arrivals', value: 'new' },
              { label: 'Trending', value: 'trending' },
              { label: 'Flash Sale', value: 'sale' },
            ].map((badge) => {
              const isSelected = selectedBadge === badge.value;
              return (
                <button
                  key={badge.value}
                  onClick={() => onSelectBadge(isSelected ? '' : badge.value)}
                  className={`px-3 py-1 rounded-lg border text-[11px] font-mono tracking-wider transition-all ${
                    isSelected
                      ? 'bg-black text-white border-black font-bold'
                      : 'bg-white text-zinc-700 border-zinc-300 hover:border-black hover:text-black'
                  }`}
                >
                  {badge.label}
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. PRICE RANGE */}
      <section className="border-b border-zinc-200 pb-5">
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-bold text-black uppercase tracking-widest text-xs">
            Price Ceiling
          </h4>
          <span className="font-mono text-amber-600 font-bold">${selectedPrice.toLocaleString()}</span>
        </div>
        <input
          type="range"
          min={50}
          max={maxPrice}
          step={50}
          value={selectedPrice}
          onChange={(e) => onChangePrice(Number(e.target.value))}
          className="w-full accent-black cursor-pointer bg-zinc-200 h-2 rounded-lg"
        />
        <div className="flex justify-between text-[10px] font-mono text-zinc-500 mt-1">
          <span>$50</span>
          <span>${maxPrice.toLocaleString()}</span>
        </div>
      </section>

      {/* 5. COLORS */}
      {colors.length > 0 && (
        <section className="border-b border-zinc-200 pb-5">
          <div
            onClick={() => toggleSection('color')}
            className="flex justify-between items-center cursor-pointer mb-3 select-none"
          >
            <h4 className="font-bold text-black uppercase tracking-widest text-xs">
              Color Palette
            </h4>
            <span className="text-black font-bold">{collapsedSections['color'] ? '+' : '−'}</span>
          </div>

          {!collapsedSections['color'] && (
            <div className="flex flex-wrap gap-1.5">
              {colors.map((col) => {
                const isSelected = selectedColors.includes(col);
                return (
                  <button
                    key={col}
                    onClick={() => onToggleColor(col)}
                    className={`px-3 py-1 rounded-lg border text-[11px] font-mono tracking-wider transition-all ${
                      isSelected
                        ? 'bg-black text-white border-black font-bold'
                        : 'bg-white text-zinc-700 border-zinc-300 hover:border-black hover:text-black'
                    }`}
                  >
                    {col}
                  </button>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* 6. SIZES */}
      {sizes.length > 0 && (
        <section className="border-b border-zinc-200 pb-5">
          <div
            onClick={() => toggleSection('size')}
            className="flex justify-between items-center cursor-pointer mb-3 select-none"
          >
            <h4 className="font-bold text-black uppercase tracking-widest text-xs">
              Size Matrix
            </h4>
            <span className="text-black font-bold">{collapsedSections['size'] ? '+' : '−'}</span>
          </div>

          {!collapsedSections['size'] && (
            <div className="flex flex-wrap gap-1.5">
              {sizes.map((sz) => {
                const isSelected = selectedSizes.includes(sz);
                return (
                  <button
                    key={sz}
                    onClick={() => onToggleSize(sz)}
                    className={`w-9 h-9 rounded-lg border text-[11px] font-mono font-bold flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-zinc-700 border-zinc-300 hover:border-black hover:text-black'
                    }`}
                  >
                    {sz}
                  </button>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* 7. FIT TYPE */}
      {fits.length > 0 && (
        <section className="pb-2">
          <div
            onClick={() => toggleSection('fit')}
            className="flex justify-between items-center cursor-pointer mb-3 select-none"
          >
            <h4 className="font-bold text-black uppercase tracking-widest text-xs">
              Fit Silhouette
            </h4>
            <span className="text-black font-bold">{collapsedSections['fit'] ? '+' : '−'}</span>
          </div>

          {!collapsedSections['fit'] && (
            <div className="flex flex-wrap gap-1.5">
              {fits.map((ft) => {
                const isSelected = selectedFit.toLowerCase() === ft.toLowerCase();
                return (
                  <button
                    key={ft}
                    onClick={() => onSelectFit(isSelected ? '' : ft)}
                    className={`px-3 py-1 rounded-lg border text-[11px] font-mono tracking-wider transition-all ${
                      isSelected
                        ? 'bg-black text-white border-black font-bold'
                        : 'bg-white text-zinc-700 border-zinc-300 hover:border-black hover:text-black'
                    }`}
                  >
                    {ft}
                  </button>
                );
              })}
            </div>
          )}
        </section>
      )}
    </aside>
  );
};
