// apps/web/src/data/mockData.ts
import { Product, Review, SupportTicket, BlogArticle, BannerConfig, SystemLog, AuditLog, StaffAccount } from '@black-white/shared';
import { CATEGORIES_LIST, AGE_GROUPS } from '@black-white/shared';

export const MOCK_CATEGORIES = CATEGORIES_LIST.map((cat, idx) => ({
  id: `cat-${idx + 1}`,
  name: cat.name,
  slug: cat.slug,
  description: cat.description,
  image_url: `https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop`,
  is_active: true,
  is_featured: idx < 8,
  sort_order: idx + 1,
}));

export const MOCK_AGE_GROUPS = AGE_GROUPS.map((ag, idx) => ({
  id: `ag-${idx + 1}`,
  name: ag.name,
  slug: ag.slug,
  min_months: ag.min_months,
  max_months: ag.max_months,
  sort_order: ag.sort_order,
  is_active: true,
  image_url: [
    'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=1000&auto=format&fit=crop', // 0-6m
    'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=1000&auto=format&fit=crop', // 6-12m
    'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?q=80&w=1000&auto=format&fit=crop', // 1-2y
    'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?q=80&w=1000&auto=format&fit=crop', // 3-5y
    'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?q=80&w=1000&auto=format&fit=crop', // 6-8y
    'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?q=80&w=1000&auto=format&fit=crop', // 9-12y
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1000&auto=format&fit=crop', // teen
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop', // young adult
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000&auto=format&fit=crop', // adult
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1000&auto=format&fit=crop', // mature
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000&auto=format&fit=crop', // senior
  ][idx] || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000&auto=format&fit=crop',
}));

const GENERATED_CATEGORY_PRODUCTS: Product[] = MOCK_CATEGORIES.flatMap((cat, cIdx) => {
  return [1, 2].map((itemNum) => {
    const pId = `gen-${cat.slug}-${itemNum}`;
    const assignedAgeGroups = [
      MOCK_AGE_GROUPS[cIdx % MOCK_AGE_GROUPS.length],
      MOCK_AGE_GROUPS[(cIdx + itemNum * 3) % MOCK_AGE_GROUPS.length],
      MOCK_AGE_GROUPS[(cIdx + itemNum * 5) % MOCK_AGE_GROUPS.length],
    ];

    const imagePool = [
      'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1542272604-780c36856842?q=80&w=1000&auto=format&fit=crop'
    ];

    const imgUrl = imagePool[(cIdx * 2 + itemNum) % imagePool.length];
    const basePrice = 180 + (cIdx * 20) + (itemNum * 35);

    return {
      id: pId,
      name: itemNum === 1 ? `Haute Reserve ${cat.name}` : `Signature Atelier ${cat.name}`,
      slug: `${cat.slug}-${itemNum}`,
      sku: `BW-${cat.slug.toUpperCase().slice(0, 4)}-${itemNum}01`,
      short_description: `Tailored luxury ${cat.name.toLowerCase()} crafted with exceptional attention to detail.`,
      description: `Crafted from premium materials, this ${cat.name.toLowerCase()} delivers uncompromising style, comfort, and timeless elegance for discerning patrons.`,
      base_price: basePrice,
      discount_price: itemNum === 2 ? Math.round(basePrice * 0.85) : undefined,
      currency: 'USD',
      gender: 'men' as const,
      categories: [cat],
      age_groups: assignedAgeGroups,
      images: [
        { id: `img-${pId}-1`, product_id: pId, url: imgUrl, alt_text: cat.name, sort_order: 1, is_primary: true }
      ],
      variants: [
        { id: `v-${pId}-s`, product_id: pId, sku: `BW-${cat.slug.toUpperCase().slice(0, 4)}-S`, color: 'Midnight Black', color_hex: '#0a0a0a', size: 'S', stock_quantity: 15, price_adjustment: 0, is_active: true },
        { id: `v-${pId}-m`, product_id: pId, sku: `BW-${cat.slug.toUpperCase().slice(0, 4)}-M`, color: 'Midnight Black', color_hex: '#0a0a0a', size: 'M', stock_quantity: 10, price_adjustment: 0, is_active: true },
        { id: `v-${pId}-l`, product_id: pId, sku: `BW-${cat.slug.toUpperCase().slice(0, 4)}-L`, color: 'Midnight Black', color_hex: '#0a0a0a', size: 'L', stock_quantity: 8, price_adjustment: 0, is_active: true },
        { id: `v-${pId}-xl`, product_id: pId, sku: `BW-${cat.slug.toUpperCase().slice(0, 4)}-XL`, color: 'Chalk White', color_hex: '#f5f5f5', size: 'XL', stock_quantity: 12, price_adjustment: 0, is_active: true },
        { id: `v-${pId}-uk9`, product_id: pId, sku: `BW-${cat.slug.toUpperCase().slice(0, 4)}-UK9`, color: 'Obsidian', color_hex: '#121212', size: 'UK 9', stock_quantity: 6, price_adjustment: 0, is_active: true },
        { id: `v-${pId}-32`, product_id: pId, sku: `BW-${cat.slug.toUpperCase().slice(0, 4)}-32`, color: 'Indigo', color_hex: '#111625', size: '32', stock_quantity: 9, price_adjustment: 0, is_active: true },
      ],
      brand: 'Black & White Haute Couture',
      fit_guide: 'Tailored fit. Fits true to size.',
      fabric_info: 'Luxury fiber blend.',
      wash_care: 'Dry clean recommended.',
      return_policy: 'Complimentary 30-day returns.',
      fit_type: itemNum === 1 ? 'Slim' : 'Regular',
      material: 'Haute Fiber',
      is_active: true,
      is_featured: cIdx < 8,
      is_new_arrival: itemNum === 1,
      is_trending: itemNum === 2,
      is_limited_edition: itemNum === 1 && cIdx % 2 === 0,
      average_rating: 4.8,
      review_count: 15 + cIdx,
      created_at: '2026-03-01T00:00:00Z',
      updated_at: '2026-07-24T00:00:00Z'
    };
  });
});

export const MOCK_PRODUCTS: Product[] = [
  ...GENERATED_CATEGORY_PRODUCTS,
  {
    id: 'p-101',
    name: 'Sea Island Cotton Tuxedo Shirt',
    slug: 'sea-island-cotton-tuxedo-shirt',
    sku: 'BW-SHIRT-001',

    short_description: 'Precision-tailored pleated tuxedo shirt in 100% Sea Island cotton.',
    description: 'Masterfully crafted in Milan, this iconic black tux shirt features hand-stitched bib pleating, French cuffs, and mother-of-pearl buttons. Unrivalled softness and drape for formal galas and red-carpet occasions.',
    base_price: 450,
    discount_price: 390,
    currency: 'USD',
    gender: 'men',
    categories: [MOCK_CATEGORIES[0], MOCK_CATEGORIES[5]], // Shirts, Formal Shirts
    age_groups: [MOCK_AGE_GROUPS[7], MOCK_AGE_GROUPS[8], MOCK_AGE_GROUPS[9]],
    images: [
      { id: 'img-1', product_id: 'p-101', url: 'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?q=80&w=1000&auto=format&fit=crop', alt_text: 'Front view', sort_order: 1, is_primary: true },
      { id: 'img-2', product_id: 'p-101', url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=1000&auto=format&fit=crop', alt_text: 'Fabric detail', sort_order: 2, is_primary: false },
      { id: 'img-3', product_id: 'p-101', url: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=1000&auto=format&fit=crop', alt_text: 'Cuff detail', sort_order: 3, is_primary: false }
    ],
    variants: [
      { id: 'v-101-s', product_id: 'p-101', sku: 'BW-SHIRT-001-BLK-S', color: 'Midnight Black', color_hex: '#0a0a0a', size: 'S', stock_quantity: 12, price_adjustment: 0, is_active: true },
      { id: 'v-101-m', product_id: 'p-101', sku: 'BW-SHIRT-001-BLK-M', color: 'Midnight Black', color_hex: '#0a0a0a', size: 'M', stock_quantity: 4, price_adjustment: 0, is_active: true },
      { id: 'v-101-l', product_id: 'p-101', sku: 'BW-SHIRT-001-BLK-L', color: 'Midnight Black', color_hex: '#0a0a0a', size: 'L', stock_quantity: 18, price_adjustment: 0, is_active: true },
      { id: 'v-101-xl', product_id: 'p-101', sku: 'BW-SHIRT-001-BLK-XL', color: 'Midnight Black', color_hex: '#0a0a0a', size: 'XL', stock_quantity: 2, price_adjustment: 0, is_active: true },
      { id: 'v-101-wht-m', product_id: 'p-101', sku: 'BW-SHIRT-001-WHT-M', color: 'Pure Ivory', color_hex: '#f8f9fa', size: 'M', stock_quantity: 10, price_adjustment: 0, is_active: true }
    ],
    brand: 'Black & White Private Reserve',
    fit_guide: 'Tailored Slim Fit. Take your true size.',
    fabric_info: '100% Certified West Indian Sea Island Cotton.',
    wash_care: 'Dry clean only or delicate hand wash cold.',
    return_policy: 'Complimentary 30-day returns with white-glove pickup.',
    fit_type: 'Slim',
    material: 'Sea Island Cotton',
    care_guide: 'Store on cedar hanger included.',
    is_active: true,
    is_featured: true,
    is_new_arrival: true,
    is_trending: true,
    is_limited_edition: true,
    average_rating: 4.9,
    review_count: 28,
    created_at: '2026-01-15T00:00:00Z',
    updated_at: '2026-07-20T00:00:00Z'
  },
  {
    id: 'p-102',
    name: 'Double-Breasted Wool-Cashmere Overcoat',
    slug: 'double-breasted-wool-cashmere-overcoat',
    sku: 'BW-COAT-002',
    short_description: 'Architectural silhouette coat in heavy wool and grade-A cashmere blend.',
    description: 'Sculpted shoulders, wide peak lapels, and horn buttons define this signature outerwear garment. Fully silk-lined with internal welt pockets for essential cardholders and smartphones.',
    base_price: 1850,
    discount_price: 1650,
    currency: 'USD',
    gender: 'men',
    categories: [MOCK_CATEGORIES[10]], // Coats
    age_groups: [MOCK_AGE_GROUPS[7], MOCK_AGE_GROUPS[8], MOCK_AGE_GROUPS[9], MOCK_AGE_GROUPS[10]],
    images: [
      { id: 'img-4', product_id: 'p-102', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1000&auto=format&fit=crop', alt_text: 'Coat front view', sort_order: 1, is_primary: true },
      { id: 'img-5', product_id: 'p-102', url: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1000&auto=format&fit=crop', alt_text: 'Back profile', sort_order: 2, is_primary: false }
    ],
    variants: [
      { id: 'v-102-m', product_id: 'p-102', sku: 'BW-COAT-002-M', color: 'Obsidian', color_hex: '#121212', size: 'M', stock_quantity: 5, price_adjustment: 0, is_active: true },
      { id: 'v-102-l', product_id: 'p-102', sku: 'BW-COAT-002-L', color: 'Obsidian', color_hex: '#121212', size: 'L', stock_quantity: 8, price_adjustment: 0, is_active: true }
    ],
    brand: 'Black & White Atelier',
    fit_guide: 'Structured Regular Fit.',
    fabric_info: '80% Virgin Wool, 20% Cashmere. Lining: 100% Cupro Silk.',
    wash_care: 'Specialist dry clean only.',
    return_policy: 'Complimentary 30-day returns.',
    fit_type: 'Regular',
    material: 'Wool & Cashmere',
    care_guide: 'Use luxury garment bag provided.',
    is_active: true,
    is_featured: true,
    is_new_arrival: false,
    is_trending: true,
    is_limited_edition: true,
    average_rating: 5.0,
    review_count: 14,
    created_at: '2026-02-10T00:00:00Z',
    updated_at: '2026-07-18T00:00:00Z'
  },
  {
    id: 'p-103',
    name: 'Minimalist Leather Low-Top Sneakers',
    slug: 'minimalist-leather-low-top-sneakers',
    sku: 'BW-SHOE-003',
    short_description: 'Full-grain Italian calfskin sneakers with hand-stitched Margom rubber soles.',
    description: 'Designed for effortless elegance, featuring waxed cotton laces, ultra-soft leather lining, and padded heel collars for all-day luxury wear.',
    base_price: 380,
    currency: 'USD',
    gender: 'men',
    categories: [MOCK_CATEGORIES[22], MOCK_CATEGORIES[23]], // Shoes, Sneakers
    age_groups: [MOCK_AGE_GROUPS[6], MOCK_AGE_GROUPS[7], MOCK_AGE_GROUPS[8], MOCK_AGE_GROUPS[9]],
    images: [
      { id: 'img-6', product_id: 'p-103', url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1000&auto=format&fit=crop', alt_text: 'Sneaker pair', sort_order: 1, is_primary: true },
      { id: 'img-7', product_id: 'p-103', url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1000&auto=format&fit=crop', alt_text: 'Sole detail', sort_order: 2, is_primary: false }
    ],
    variants: [
      { id: 'v-103-8', product_id: 'p-103', sku: 'BW-SHOE-003-8', color: 'Monochrome White', color_hex: '#ffffff', size: 'UK 8', stock_quantity: 15, price_adjustment: 0, is_active: true },
      { id: 'v-103-9', product_id: 'p-103', sku: 'BW-SHOE-003-9', color: 'Monochrome White', color_hex: '#ffffff', size: 'UK 9', stock_quantity: 20, price_adjustment: 0, is_active: true },
      { id: 'v-103-10', product_id: 'p-103', sku: 'BW-SHOE-003-10', color: 'Monochrome White', color_hex: '#ffffff', size: 'UK 10', stock_quantity: 3, price_adjustment: 0, is_active: true }
    ],
    brand: 'B&W Footwear Milan',
    fit_guide: 'Runs true to size. If between sizes, size down.',
    fabric_info: '100% Italian Nappa Calfskin.',
    wash_care: 'Wipe clean with soft leather conditioner.',
    return_policy: '30-day return policy.',
    fit_type: 'Regular',
    material: 'Full-grain Leather',
    care_guide: 'Includes travel dust bags and shoe trees.',
    is_active: true,
    is_featured: true,
    is_new_arrival: true,
    is_trending: false,
    is_limited_edition: false,
    average_rating: 4.8,
    review_count: 42,
    created_at: '2026-03-01T00:00:00Z',
    updated_at: '2026-07-21T00:00:00Z'
  },
  {
    id: 'p-104',
    name: 'Heirloom Velvet Tuxedo Blazer',
    slug: 'heirloom-velvet-tuxedo-blazer',
    sku: 'BW-BLAZ-004',
    short_description: 'Deep black cotton velvet evening blazer with silk satin shawl lapels.',
    description: 'An understated masterpiece for grand celebrations. Cut with precision shoulders, silk jet pockets, and single-button closure.',
    base_price: 1200,
    discount_price: 980,
    currency: 'USD',
    gender: 'men',
    categories: [MOCK_CATEGORIES[9], MOCK_CATEGORIES[20]], // Blazers, Suits
    age_groups: [MOCK_AGE_GROUPS[7], MOCK_AGE_GROUPS[8], MOCK_AGE_GROUPS[9]],
    images: [
      { id: 'img-8', product_id: 'p-104', url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop', alt_text: 'Blazer front', sort_order: 1, is_primary: true }
    ],
    variants: [
      { id: 'v-104-38r', product_id: 'p-104', sku: 'BW-BLAZ-004-38', color: 'Midnight Velvet', color_hex: '#050505', size: 'M', stock_quantity: 6, price_adjustment: 0, is_active: true },
      { id: 'v-104-40r', product_id: 'p-104', sku: 'BW-BLAZ-004-40', color: 'Midnight Velvet', color_hex: '#050505', size: 'L', stock_quantity: 8, price_adjustment: 0, is_active: true }
    ],
    brand: 'Black & White Haute Couture',
    fit_guide: 'Italian Slim Fit.',
    fabric_info: 'Cotton Velvet with 100% Silk Lapels.',
    wash_care: 'Dry clean only.',
    fit_type: 'Slim',
    material: 'Cotton Velvet',
    is_active: true,
    is_featured: true,
    is_new_arrival: false,
    is_trending: true,
    is_limited_edition: true,
    average_rating: 4.95,
    review_count: 19,
    created_at: '2026-04-12T00:00:00Z',
    updated_at: '2026-07-22T00:00:00Z'
  },
  {
    id: 'p-105',
    name: 'Silk-Linen Oversized Graphic Tee',
    slug: 'silk-linen-oversized-graphic-tee',
    sku: 'BW-TEE-005',
    short_description: 'Avant-garde oversized t-shirt in breathable silk-linen blend.',
    description: 'Designed with dropped shoulders, raw edges, and tonal monogram embroidery at the nape.',
    base_price: 220,
    currency: 'USD',
    gender: 'men',
    categories: [MOCK_CATEGORIES[1], MOCK_CATEGORIES[3]], // T-Shirts, Oversized T-Shirts
    age_groups: [MOCK_AGE_GROUPS[6], MOCK_AGE_GROUPS[7], MOCK_AGE_GROUPS[8]],
    images: [
      { id: 'img-9', product_id: 'p-105', url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000&auto=format&fit=crop', alt_text: 'Graphic Tee', sort_order: 1, is_primary: true }
    ],
    variants: [
      { id: 'v-105-s', product_id: 'p-105', sku: 'BW-TEE-005-S', color: 'Chalk White', color_hex: '#f5f5f5', size: 'S', stock_quantity: 15, price_adjustment: 0, is_active: true },
      { id: 'v-105-m', product_id: 'p-105', sku: 'BW-TEE-005-M', color: 'Chalk White', color_hex: '#f5f5f5', size: 'M', stock_quantity: 25, price_adjustment: 0, is_active: true },
      { id: 'v-105-l', product_id: 'p-105', sku: 'BW-TEE-005-L', color: 'Chalk White', color_hex: '#f5f5f5', size: 'L', stock_quantity: 18, price_adjustment: 0, is_active: true }
    ],
    brand: 'B&W Studio',
    fit_guide: 'Intentionally oversized.',
    fabric_info: '60% Mulberry Silk, 40% Organic Linen.',
    wash_care: 'Hand wash cold.',
    fit_type: 'Oversized',
    material: 'Silk-Linen Blend',
    is_active: true,
    is_featured: false,
    is_new_arrival: true,
    is_trending: true,
    is_limited_edition: false,
    average_rating: 4.7,
    review_count: 31,
    created_at: '2026-05-01T00:00:00Z',
    updated_at: '2026-07-23T00:00:00Z'
  },
  {
    id: 'p-106',
    name: 'Japanese Selvedge Tapered Jeans',
    slug: 'japanese-selvedge-tapered-jeans',
    sku: 'BW-JEAN-006',
    short_description: '14oz Kurabo Mills shuttle-loom selvedge denim in raw indigo black.',
    description: 'Custom silver hardware, hidden rivet pockets, and embossed black leather back patch.',
    base_price: 340,
    currency: 'USD',
    gender: 'men',
    categories: [MOCK_CATEGORIES[11]], // Jeans
    age_groups: [MOCK_AGE_GROUPS[6], MOCK_AGE_GROUPS[7], MOCK_AGE_GROUPS[8], MOCK_AGE_GROUPS[9]],
    images: [
      { id: 'img-10', product_id: 'p-106', url: 'https://images.unsplash.com/photo-1542272604-780c36856842?q=80&w=1000&auto=format&fit=crop', alt_text: 'Jeans detail', sort_order: 1, is_primary: true }
    ],
    variants: [
      { id: 'v-106-30', product_id: 'p-106', sku: 'BW-JEAN-006-30', color: 'Raw Indigo Black', color_hex: '#111625', size: '30', stock_quantity: 10, price_adjustment: 0, is_active: true },
      { id: 'v-106-32', product_id: 'p-106', sku: 'BW-JEAN-006-32', color: 'Raw Indigo Black', color_hex: '#111625', size: '32', stock_quantity: 14, price_adjustment: 0, is_active: true },
      { id: 'v-106-34', product_id: 'p-106', sku: 'BW-JEAN-006-34', color: 'Raw Indigo Black', color_hex: '#111625', size: '34', stock_quantity: 8, price_adjustment: 0, is_active: true }
    ],
    brand: 'B&W Denim Lab',
    fit_guide: 'Tapered fit.',
    fabric_info: '100% Cotton 14oz Selvedge.',
    wash_care: 'Soak inside out in cold water.',
    fit_type: 'Regular',
    material: 'Selvedge Denim',
    is_active: true,
    is_featured: true,
    is_new_arrival: false,
    is_trending: true,
    is_limited_edition: false,
    average_rating: 4.85,
    review_count: 53,
    created_at: '2026-03-20T00:00:00Z',
    updated_at: '2026-07-24T00:00:00Z'
  },
  {
    id: 'p-107',
    name: 'Haute Parfumerie "Noir & Blanc" 100ml',
    slug: 'noir-and-blanc-perfume-100ml',
    sku: 'BW-PERF-007',
    short_description: 'Intense extrait de parfum featuring notes of black oud, smoked vetiver, and bergamot.',
    description: 'Hand-blown black crystal bottle with 24k gold leaf stopper accents. Formulated in Grasse, France.',
    base_price: 390,
    currency: 'USD',
    gender: 'unisex',
    categories: [MOCK_CATEGORIES[33]], // Perfumes
    age_groups: [MOCK_AGE_GROUPS[7], MOCK_AGE_GROUPS[8], MOCK_AGE_GROUPS[9], MOCK_AGE_GROUPS[10]],
    images: [
      { id: 'img-11', product_id: 'p-107', url: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=1000&auto=format&fit=crop', alt_text: 'Perfume bottle', sort_order: 1, is_primary: true }
    ],
    variants: [
      { id: 'v-107-100ml', product_id: 'p-107', sku: 'BW-PERF-007-100', color: 'Clear Oud', color_hex: '#000000', size: '100ml', stock_quantity: 30, price_adjustment: 0, is_active: true }
    ],
    brand: 'Black & White Fragrances Grasse',
    fit_guide: 'Extrait de Parfum formulation (30% concentration).',
    fabric_info: 'Natural essences & Rare Oud oil.',
    wash_care: 'Keep away from direct heat & light.',
    material: 'Glass & Essence',
    is_active: true,
    is_featured: true,
    is_new_arrival: true,
    is_trending: true,
    is_limited_edition: true,
    average_rating: 5.0,
    review_count: 89,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-07-24T00:00:00Z'
  },
  {
    id: 'p-108',
    name: 'Bespoke Silk Jacquard Sherwani Set',
    slug: 'bespoke-silk-jacquard-sherwani-set',
    sku: 'BW-ETH-008',
    short_description: 'Royal sherwani with zardosi embroidery and matching churidar pants.',
    description: 'Hand-loomed raw silk woven with subtle geometric motifs and mother-of-pearl buttons.',
    base_price: 1600,
    discount_price: 1450,
    currency: 'USD',
    gender: 'men',
    categories: [MOCK_CATEGORIES[17], MOCK_CATEGORIES[19]], // Ethnic Wear, Sherwani
    age_groups: [MOCK_AGE_GROUPS[7], MOCK_AGE_GROUPS[8], MOCK_AGE_GROUPS[9]],
    images: [
      { id: 'img-12', product_id: 'p-108', url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1000&auto=format&fit=crop', alt_text: 'Sherwani set', sort_order: 1, is_primary: true }
    ],
    variants: [
      { id: 'v-108-40', product_id: 'p-108', sku: 'BW-ETH-008-40', color: 'Royal Ivory & Black', color_hex: '#fcfbf7', size: 'L', stock_quantity: 4, price_adjustment: 0, is_active: true }
    ],
    brand: 'Black & White Heritage Atelier',
    fit_guide: 'Tailored fit with regal drape.',
    fabric_info: '100% Pure Varanasi Silk.',
    wash_care: 'Specialist dry clean.',
    fit_type: 'Slim',
    material: 'Raw Silk',
    is_active: true,
    is_featured: true,
    is_new_arrival: true,
    is_trending: false,
    is_limited_edition: true,
    average_rating: 4.9,
    review_count: 9,
    created_at: '2026-04-01T00:00:00Z',
    updated_at: '2026-07-24T00:00:00Z'
  }
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    product_id: 'p-101',
    customer_id: 'cust-1',
    customer_name: 'Lord Arthur Pendelton',
    customer_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    rating: 5,
    title: 'Flawless Craftsmanship & Unrivalled Comfort',
    body: 'Wore this to a charity gala in Mayfair. The weave of the Sea Island cotton is astonishingly crisp yet silky to the touch.',
    images: ['https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?q=80&w=400&auto=format&fit=crop'],
    is_verified_purchase: true,
    is_approved: true,
    helpful_count: 18,
    created_at: '2026-06-12T14:30:00Z'
  },
  {
    id: 'rev-2',
    product_id: 'p-102',
    customer_id: 'cust-2',
    customer_name: 'Julian Vance',
    customer_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    rating: 5,
    title: 'The Ultimate Statement Coat',
    body: 'The shoulder drape and weight of the cashmere blend is perfection. Truly worth every penny.',
    is_verified_purchase: true,
    is_approved: true,
    helpful_count: 9,
    created_at: '2026-07-02T10:15:00Z'
  }
];

export const MOCK_CUSTOMER = {
  id: 'cust-1',
  role: 'customer' as const,
  full_name: 'Alexander Sterling',
  email: 'alexander.sterling@luxury.com',
  mobile_number: '+1 (555) 234-8890',
  whatsapp_number: '+1 (555) 234-8890',
  customer_id: 'BW-CUST-88392',
  registration_date: '2025-11-04',
  lifetime_spending: 4250,
  reward_points: 425,
  membership_tier: 'platinum' as const,
  referral_code: 'STERLING-VIP',
  created_at: '2025-11-04T00:00:00Z',
  updated_at: '2026-07-24T00:00:00Z'
};

export const MOCK_ADDRESSES = [
  {
    id: 'addr-1',
    customer_id: 'cust-1',
    label: 'Penthouse Residence',
    full_name: 'Alexander Sterling',
    phone: '+1 (555) 234-8890',
    address_line_1: '740 Park Avenue, Apt 14B',
    address_line_2: 'Upper East Side',
    city: 'New York',
    province: 'NY',
    postal_code: '10021',
    country: 'United States',
    is_default: true
  },
  {
    id: 'addr-2',
    customer_id: 'cust-1',
    label: 'Hamptons Villa',
    full_name: 'Alexander Sterling',
    phone: '+1 (555) 234-8890',
    address_line_1: '12 Meadow Lane',
    city: 'Southampton',
    province: 'NY',
    postal_code: '11968',
    country: 'United States',
    is_default: false
  }
];

export const MOCK_SAVED_CARDS = [
  { id: 'card-1', card_type: 'Visa Infinite', last4: '8892', exp_month: '11', exp_year: '28', card_holder: 'ALEXANDER STERLING', is_default: true },
  { id: 'card-2', card_type: 'Amex Centurion', last4: '1004', exp_month: '05', exp_year: '30', card_holder: 'ALEXANDER STERLING', is_default: false }
];

export const MOCK_ORDERS = [
  {
    id: 'ord-901',
    customer_id: 'cust-1',
    order_number: 'BW-ORD-2026-901',
    subtotal: 1850,
    shipping_cost: 0,
    discount_amount: 185,
    tax_amount: 149.85,
    total: 1814.85,
    currency: 'USD',
    status: 'delivered' as const,
    gift_wrapping: true,
    gift_message: 'Happy Birthday Alexander! Enjoy the finest overcoat.',
    notes: 'Please hand deliver to concierge desk.',
    created_at: '2026-07-10T11:20:00Z',
    updated_at: '2026-07-14T16:00:00Z',
    items: [
      {
        id: 'oi-1',
        order_id: 'ord-901',
        product_id: 'p-102',
        product_name: 'Double-Breasted Wool-Cashmere Overcoat',
        color: 'Obsidian',
        size: 'L',
        quantity: 1,
        unit_price: 1850,
        total_price: 1850
      }
    ],
    timeline: [
      { status: 'Order Placed', time: '2026-07-10 11:20 AM', description: 'Order confirmed and payment verified.' },
      { status: 'Packed', time: '2026-07-11 09:15 AM', description: 'Packaged in signature black luxury presentation box.' },
      { status: 'Shipped', time: '2026-07-12 14:00 PM', description: 'Dispatched via DHL Express Air (Tracking #998273412).' },
      { status: 'Out for Delivery', time: '2026-07-14 08:30 AM', description: 'Courier out for white-glove delivery.' },
      { status: 'Delivered', time: '2026-07-14 15:45 PM', description: 'Received and signed by concierge.' }
    ]
  },
  {
    id: 'ord-902',
    customer_id: 'cust-1',
    order_number: 'BW-ORD-2026-902',
    subtotal: 450,
    shipping_cost: 0,
    discount_amount: 45,
    tax_amount: 36.45,
    total: 441.45,
    currency: 'USD',
    status: 'shipped' as const,
    gift_wrapping: false,
    created_at: '2026-07-22T09:10:00Z',
    updated_at: '2026-07-23T14:20:00Z',
    items: [
      {
        id: 'oi-2',
        order_id: 'ord-902',
        product_id: 'p-101',
        product_name: 'Sea Island Cotton Tuxedo Shirt',
        color: 'Midnight Black',
        size: 'M',
        quantity: 1,
        unit_price: 450,
        total_price: 450
      }
    ],
    timeline: [
      { status: 'Order Placed', time: '2026-07-22 09:10 AM', description: 'Payment verified.' },
      { status: 'Packed', time: '2026-07-22 17:00 PM', description: 'Packaged at Fifth Avenue Atelier.' },
      { status: 'Shipped', time: '2026-07-23 14:20 PM', description: 'In transit via FedEx Priority.' }
    ]
  }
];

export const MOCK_BANK_RECEIPTS = [
  {
    id: 'rec-101',
    order_id: 'ord-903',
    order_number: 'BW-ORD-2026-903',
    customer_name: 'Marcus Sterling',
    customer_email: 'marcus@sterling.com',
    amount: 1450,
    currency: 'USD',
    bank_name: 'JPMorgan Chase',
    transaction_reference: 'TRX-99382104',
    receipt_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=600&auto=format&fit=crop',
    transfer_date: '2026-07-23',
    status: 'pending' as const,
    created_at: '2026-07-23T18:00:00Z'
  }
];

export const MOCK_COUPONS = [
  {
    id: 'coup-1',
    code: 'LUXURY15',
    type: 'percentage' as const,
    value: 15,
    min_order_amount: 300,
    used_count: 42,
    usage_limit: 100,
    starts_at: '2026-01-01',
    expires_at: '2026-12-31',
    is_active: true,
    created_at: '2026-01-01T00:00:00Z'
  },
  {
    id: 'coup-2',
    code: 'VIPWELCOME',
    type: 'fixed' as const,
    value: 100,
    min_order_amount: 500,
    used_count: 18,
    starts_at: '2026-01-01',
    expires_at: '2026-12-31',
    is_active: true,
    created_at: '2026-01-01T00:00:00Z'
  }
];

export const MOCK_TICKETS: SupportTicket[] = [
  {
    id: 'tkt-1',
    ticket_number: 'BW-TKT-1049',
    customer_id: 'cust-1',
    customer_name: 'Alexander Sterling',
    customer_email: 'alexander.sterling@luxury.com',
    subject: 'Request for Bespoke Sizing Advice',
    category: 'product',
    priority: 'high',
    status: 'open',
    created_at: '2026-07-23T16:20:00Z',
    updated_at: '2026-07-23T16:20:00Z',
    messages: [
      {
        id: 'm-1',
        sender: 'customer',
        sender_name: 'Alexander Sterling',
        message: 'Hello, I am interested in ordering the Heirloom Velvet Tuxedo Blazer for an upcoming gala. Could a master tailor confirm chest measurements for 40R?',
        created_at: '2026-07-23T16:20:00Z'
      }
    ]
  }
];

export const MOCK_BANNERS: BannerConfig[] = [
  {
    id: 'b-1',
    title: 'The Autumn / Winter ’26 Haute Runway',
    subtitle: 'Uncompromising luxury cut from Sea Island cotton, raw silk, and virgin cashmere.',
    image_url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=2000&auto=format&fit=crop',
    link_url: '/shop?category=suits',
    button_text: 'Explore Haute Couture',
    type: 'hero',
    is_active: true,
    sort_order: 1
  },
  {
    id: 'b-2',
    title: 'Limited Edition Midnight Velvet',
    subtitle: 'Strictly limited to 50 handcrafted blazers worldwide.',
    image_url: 'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?q=80&w=2000&auto=format&fit=crop',
    link_url: '/shop?badge=limited',
    button_text: 'Reserve Now',
    type: 'promo',
    is_active: true,
    sort_order: 2
  }
];

export const MOCK_BLOG_ARTICLES: BlogArticle[] = [
  {
    id: 'blog-1',
    title: 'The Anatomy of Sea Island Cotton: Why It Remains Royalty',
    slug: 'anatomy-of-sea-island-cotton',
    excerpt: 'Trace the lineage of the world’s rarest long-staple cotton fibers spun exclusively for royal houses.',
    content: 'Sea Island cotton represents less than 0.0004% of global cotton production. Harvested by hand in the West Indies...',
    cover_image: 'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?q=80&w=1200&auto=format&fit=crop',
    author: 'Jean-Luc Moreau',
    category: 'Craftsmanship',
    tags: ['Craftsmanship', 'Fabrics', 'Sea Island Cotton'],
    published_at: '2026-07-15',
    read_time: '5 min read',
    is_published: true
  },
  {
    id: 'blog-2',
    title: 'Black Tie Protocol: Decoding Formal Evening Dressing',
    slug: 'black-tie-protocol-guide',
    excerpt: 'From peak lapels to cummerbunds versus waistcoats, master the golden rules of black-tie galas.',
    content: 'When an invitation reads Black Tie, standard tailoring will not suffice. The velvet tuxedo blazer coupled with silk lapels...',
    cover_image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop',
    author: 'Sir David Harrington',
    category: 'Style Guide',
    tags: ['Style Guide', 'Formalwear', 'Tuxedo'],
    published_at: '2026-07-01',
    read_time: '7 min read',
    is_published: true
  }
];

export const MOCK_SYSTEM_LOGS: SystemLog[] = [
  { id: 'log-1', level: 'info', message: 'Stripe webhook received for Order #BW-ORD-2026-902', source: 'payment-gateway', timestamp: '2026-07-24T14:30:12Z' },
  { id: 'log-2', level: 'info', message: 'Bank transfer receipt uploaded for Order #BW-ORD-2026-903', source: 'media-storage', timestamp: '2026-07-23T18:00:05Z' }
];

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  { id: 'aud-1', user: 'admin@blackwhite.com', role: 'Super Admin', action: 'Approved Bank Payment', resource: 'Order #BW-ORD-2026-901', ip_address: '192.168.1.45', timestamp: '2026-07-24T10:15:00Z' }
];

export const MOCK_STAFF: StaffAccount[] = [
  { id: 'stf-1', name: 'Eleanor Vance', email: 'eleanor@blackwhite.com', role: 'super_admin', status: 'active', last_login: '2026-07-24T14:10:00Z' },
  { id: 'stf-2', name: 'Sebastian Cole', email: 'sebastian@blackwhite.com', role: 'inventory_manager', status: 'active', last_login: '2026-07-24T11:00:00Z' }
];
