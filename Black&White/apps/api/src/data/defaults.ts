export type DbProduct = {
  id: string;
  name: string;
  slug: string;
  sku: string;
  short_description?: string;
  description?: string;
  base_price: number;
  discount_price?: number;
  currency: string;
  gender: 'kids' | 'men' | 'unisex';
  categories: DbCategory[];
  age_groups: DbAgeGroup[];
  images: DbProductImage[];
  variants: DbProductVariant[];
  brand: string;
  fit_guide?: string;
  fabric_info?: string;
  wash_care?: string;
  return_policy?: string;
  is_active: boolean;
  is_featured: boolean;
  is_new_arrival: boolean;
  is_trending: boolean;
  is_limited_edition: boolean;
  fit_type?: string;
  material?: string;
  average_rating?: number;
  review_count?: number;
  created_at: string;
  updated_at: string;
};

export type DbCategory = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  is_active: boolean;
  is_featured?: boolean;
  sort_order: number;
};

export type DbAgeGroup = {
  id: string;
  name: string;
  slug: string;
  min_months: number;
  max_months: number;
  sort_order: number;
  is_active: boolean;
};

export type DbProductImage = {
  id: string;
  product_id: string;
  url: string;
  alt_text?: string;
  sort_order: number;
  is_primary: boolean;
};

export type DbProductVariant = {
  id: string;
  product_id: string;
  sku?: string;
  color?: string;
  color_hex?: string;
  size?: string;
  stock_quantity: number;
  price_adjustment: number;
  is_active: boolean;
};

const categorySeed = [
  ['Shirts', 'shirts', 'Tailored luxury shirts crafted from Sea Island cotton.'],
  ['T-Shirts', 't-shirts', 'Essential silk-cotton hybrid t-shirts.'],
  ['Blazers', 'blazers', 'Structured wool-silk and unstructured linen blazers.'],
  ['Coats', 'coats', 'Double-breasted trench coats and overcoats.'],
  ['Jeans', 'jeans', 'Japanese selvedge and Italian stretch denim.'],
  ['Ethnic Wear', 'ethnic-wear', 'Heritage formal and festive attire.'],
  ['Suits', 'suits', 'Two-piece and three-piece Italian wool suits.'],
  ['Shoes', 'shoes', 'Handcrafted Italian footwear.'],
  ['Perfumes', 'perfumes', 'Signature haute parfumerie collection.'],
  ['Bags', 'bags', 'Leather duffels, backpacks, and folios.'],
];

export const defaultCategories: DbCategory[] = categorySeed.map(([name, slug, description], index) => ({
  id: `cat-${index + 1}`,
  name,
  slug,
  description,
  image_url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop',
  is_active: true,
  is_featured: index < 6,
  sort_order: index + 1,
}));

export const defaultAgeGroups: DbAgeGroup[] = [
  { id: 'ag-teen', name: 'Teen (13-17)', slug: 'teen', min_months: 156, max_months: 204, sort_order: 1, is_active: true },
  { id: 'ag-young-adult', name: 'Young Adult (18-25)', slug: 'young-adult', min_months: 216, max_months: 300, sort_order: 2, is_active: true },
  { id: 'ag-adult', name: 'Adult (26-40)', slug: 'adult', min_months: 312, max_months: 480, sort_order: 3, is_active: true },
  { id: 'ag-mature', name: 'Mature (41-60)', slug: 'mature', min_months: 492, max_months: 720, sort_order: 4, is_active: true },
  { id: 'ag-senior', name: 'Senior (60+)', slug: 'senior', min_months: 732, max_months: 9999, sort_order: 5, is_active: true },
];

const images = {
  shirt: 'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?q=80&w=1000&auto=format&fit=crop',
  coat: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1000&auto=format&fit=crop',
  shoe: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1000&auto=format&fit=crop',
  blazer: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop',
  tee: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000&auto=format&fit=crop',
  jeans: 'https://images.unsplash.com/photo-1542272604-780c36856842?q=80&w=1000&auto=format&fit=crop',
  perfume: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=1000&auto=format&fit=crop',
  ethnic: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1000&auto=format&fit=crop',
};

function productImage(productId: string, key: keyof typeof images, alt: string): DbProductImage[] {
  return [{ id: `img-${productId}`, product_id: productId, url: images[key], alt_text: alt, sort_order: 1, is_primary: true }];
}

function variants(productId: string, sku: string, sizes: string[]): DbProductVariant[] {
  return sizes.map((size, index) => ({
    id: `var-${productId}-${index + 1}`,
    product_id: productId,
    sku: `${sku}-${size.replace(/\s+/g, '')}`,
    color: index % 2 === 0 ? 'Midnight Black' : 'Chalk White',
    color_hex: index % 2 === 0 ? '#0a0a0a' : '#f5f5f5',
    size,
    stock_quantity: 6 + index * 4,
    price_adjustment: 0,
    is_active: true,
  }));
}

const adultAges = [defaultAgeGroups[1], defaultAgeGroups[2], defaultAgeGroups[3]];

export const defaultProducts: DbProduct[] = [
  {
    id: 'p-101',
    name: 'Sea Island Cotton Tuxedo Shirt',
    slug: 'sea-island-cotton-tuxedo-shirt',
    sku: 'BW-SHIRT-001',
    short_description: 'Precision-tailored pleated tuxedo shirt in 100% Sea Island cotton.',
    description: 'Masterfully crafted with hand-stitched bib pleating, French cuffs, and mother-of-pearl buttons.',
    base_price: 450,
    discount_price: 390,
    currency: 'USD',
    gender: 'men',
    categories: [defaultCategories[0]],
    age_groups: adultAges,
    images: productImage('p-101', 'shirt', 'Sea Island cotton tuxedo shirt'),
    variants: variants('p-101', 'BW-SHIRT-001', ['S', 'M', 'L', 'XL']),
    brand: 'Black & White Private Reserve',
    fit_guide: 'Tailored slim fit. Take your true size.',
    fabric_info: '100% certified West Indian Sea Island cotton.',
    wash_care: 'Dry clean only or delicate hand wash cold.',
    return_policy: 'Complimentary 30-day returns.',
    fit_type: 'Slim',
    material: 'Sea Island Cotton',
    is_active: true,
    is_featured: true,
    is_new_arrival: true,
    is_trending: true,
    is_limited_edition: true,
    average_rating: 4.9,
    review_count: 28,
    created_at: '2026-01-15T00:00:00Z',
    updated_at: '2026-07-24T00:00:00Z',
  },
  {
    id: 'p-102',
    name: 'Double-Breasted Wool-Cashmere Overcoat',
    slug: 'double-breasted-wool-cashmere-overcoat',
    sku: 'BW-COAT-002',
    short_description: 'Architectural silhouette coat in heavy wool and grade-A cashmere blend.',
    description: 'Sculpted shoulders, wide peak lapels, and horn buttons define this signature outerwear garment.',
    base_price: 1850,
    discount_price: 1650,
    currency: 'USD',
    gender: 'men',
    categories: [defaultCategories[3]],
    age_groups: adultAges,
    images: productImage('p-102', 'coat', 'Wool cashmere overcoat'),
    variants: variants('p-102', 'BW-COAT-002', ['M', 'L', 'XL']),
    brand: 'Black & White Atelier',
    fit_guide: 'Structured regular fit.',
    fabric_info: '80% virgin wool, 20% cashmere.',
    wash_care: 'Specialist dry clean only.',
    return_policy: 'Complimentary 30-day returns.',
    fit_type: 'Regular',
    material: 'Wool & Cashmere',
    is_active: true,
    is_featured: true,
    is_new_arrival: false,
    is_trending: true,
    is_limited_edition: true,
    average_rating: 5,
    review_count: 14,
    created_at: '2026-02-10T00:00:00Z',
    updated_at: '2026-07-18T00:00:00Z',
  },
  {
    id: 'p-103',
    name: 'Minimalist Leather Low-Top Sneakers',
    slug: 'minimalist-leather-low-top-sneakers',
    sku: 'BW-SHOE-003',
    short_description: 'Full-grain Italian calfskin sneakers with hand-stitched Margom rubber soles.',
    description: 'Designed for effortless elegance with waxed cotton laces and ultra-soft leather lining.',
    base_price: 380,
    currency: 'USD',
    gender: 'men',
    categories: [defaultCategories[7]],
    age_groups: [defaultAgeGroups[0], ...adultAges],
    images: productImage('p-103', 'shoe', 'Minimalist leather sneakers'),
    variants: variants('p-103', 'BW-SHOE-003', ['UK 8', 'UK 9', 'UK 10']),
    brand: 'B&W Footwear Milan',
    fit_guide: 'Runs true to size.',
    fabric_info: '100% Italian nappa calfskin.',
    wash_care: 'Wipe clean with soft leather conditioner.',
    return_policy: '30-day return policy.',
    fit_type: 'Regular',
    material: 'Full-grain Leather',
    is_active: true,
    is_featured: true,
    is_new_arrival: true,
    is_trending: false,
    is_limited_edition: false,
    average_rating: 4.8,
    review_count: 42,
    created_at: '2026-03-01T00:00:00Z',
    updated_at: '2026-07-21T00:00:00Z',
  },
  {
    id: 'p-104',
    name: 'Heirloom Velvet Tuxedo Blazer',
    slug: 'heirloom-velvet-tuxedo-blazer',
    sku: 'BW-BLAZ-004',
    short_description: 'Deep black cotton velvet evening blazer with silk satin shawl lapels.',
    description: 'An understated masterpiece for grand celebrations, cut with precision shoulders and silk jet pockets.',
    base_price: 1200,
    discount_price: 980,
    currency: 'USD',
    gender: 'men',
    categories: [defaultCategories[2], defaultCategories[6]],
    age_groups: adultAges,
    images: productImage('p-104', 'blazer', 'Velvet tuxedo blazer'),
    variants: variants('p-104', 'BW-BLAZ-004', ['38R', '40R', '42R']),
    brand: 'Black & White Haute Couture',
    fit_guide: 'Italian slim fit.',
    fabric_info: 'Cotton velvet with silk lapels.',
    wash_care: 'Dry clean only.',
    return_policy: 'Complimentary 30-day returns.',
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
    updated_at: '2026-07-22T00:00:00Z',
  },
  {
    id: 'p-105',
    name: 'Silk-Linen Oversized Graphic Tee',
    slug: 'silk-linen-oversized-graphic-tee',
    sku: 'BW-TEE-005',
    short_description: 'Avant-garde oversized t-shirt in breathable silk-linen blend.',
    description: 'Dropped shoulders, raw edges, and tonal monogram embroidery at the nape.',
    base_price: 220,
    currency: 'USD',
    gender: 'men',
    categories: [defaultCategories[1]],
    age_groups: [defaultAgeGroups[0], ...adultAges],
    images: productImage('p-105', 'tee', 'Silk linen graphic tee'),
    variants: variants('p-105', 'BW-TEE-005', ['S', 'M', 'L']),
    brand: 'B&W Studio',
    fit_guide: 'Intentionally oversized.',
    fabric_info: '60% mulberry silk, 40% organic linen.',
    wash_care: 'Hand wash cold.',
    return_policy: 'Complimentary 30-day returns.',
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
    updated_at: '2026-07-23T00:00:00Z',
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
    categories: [defaultCategories[4]],
    age_groups: [defaultAgeGroups[0], ...adultAges],
    images: productImage('p-106', 'jeans', 'Japanese selvedge jeans'),
    variants: variants('p-106', 'BW-JEAN-006', ['30', '32', '34', '36']),
    brand: 'B&W Denim Lab',
    fit_guide: 'Tapered fit.',
    fabric_info: '100% cotton 14oz selvedge.',
    wash_care: 'Soak inside out in cold water.',
    return_policy: 'Complimentary 30-day returns.',
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
    updated_at: '2026-07-24T00:00:00Z',
  },
  {
    id: 'p-107',
    name: 'Haute Parfumerie Noir & Blanc 100ml',
    slug: 'noir-and-blanc-perfume-100ml',
    sku: 'BW-PERF-007',
    short_description: 'Intense extrait de parfum with black oud, smoked vetiver, and bergamot.',
    description: 'Hand-blown black crystal bottle with gold leaf stopper accents, formulated in Grasse.',
    base_price: 390,
    currency: 'USD',
    gender: 'unisex',
    categories: [defaultCategories[8]],
    age_groups: adultAges,
    images: productImage('p-107', 'perfume', 'Noir and Blanc perfume'),
    variants: variants('p-107', 'BW-PERF-007', ['100ml']),
    brand: 'Black & White Fragrances Grasse',
    fit_guide: 'Extrait de parfum formulation.',
    fabric_info: 'Natural essences and rare oud oil.',
    wash_care: 'Keep away from direct heat and light.',
    return_policy: 'Unopened fragrance returns accepted within 14 days.',
    material: 'Glass & Essence',
    is_active: true,
    is_featured: true,
    is_new_arrival: true,
    is_trending: true,
    is_limited_edition: true,
    average_rating: 5,
    review_count: 89,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-07-24T00:00:00Z',
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
    categories: [defaultCategories[5]],
    age_groups: adultAges,
    images: productImage('p-108', 'ethnic', 'Silk jacquard sherwani'),
    variants: variants('p-108', 'BW-ETH-008', ['M', 'L']),
    brand: 'Black & White Heritage Atelier',
    fit_guide: 'Tailored fit with regal drape.',
    fabric_info: '100% pure Varanasi silk.',
    wash_care: 'Specialist dry clean.',
    return_policy: 'Complimentary 30-day returns.',
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
    updated_at: '2026-07-24T00:00:00Z',
  },
];

export const defaultCoupons = [
  { id: 'coup-1', code: 'LUXURY15', type: 'percentage', value: 15, min_order_amount: 300, used_count: 42, usage_limit: 100, starts_at: '2026-01-01', expires_at: '2026-12-31', is_active: true, description: '15% off atelier pieces.' },
  { id: 'coup-2', code: 'VIPWELCOME', type: 'fixed', value: 50, min_order_amount: 250, used_count: 18, usage_limit: 250, starts_at: '2026-01-01', expires_at: '2026-12-31', is_active: true, description: 'VIP welcome voucher.' },
];

export const defaultCampaigns = [
  { id: 'camp-1', title: 'The Autumn / Winter 26 Haute Runway', description: 'Uncompromising luxury cut from Sea Island cotton, raw silk, and virgin cashmere.', image_url: images.blazer, cta_text: 'Explore Haute Couture', link_url: '/shop?category=suits', active: true },
  { id: 'camp-2', title: 'Limited Edition Midnight Velvet', description: 'Strictly limited handcrafted blazers.', image_url: images.shirt, cta_text: 'Reserve Now', link_url: '/shop?badge=limited', active: true },
];

export const defaultCms = {
  hero: defaultCampaigns[0],
  bank_details: {
    bank_name: 'JPMorgan Chase Bank',
    account_name: 'Black & White Haute Couture LLC',
    account_number: '9876543210',
    branch: 'Fifth Avenue NYC',
    swift_code: 'CHASUS33XXX',
  },
};

export const defaultCustomers = [
  {
    id: 'cust-1',
    email: 'alexander.sterling@luxury.com',
    name: 'Alexander Sterling',
    password: 'customer123',
    customer_id: 'BW-CUST-88392',
    membership_tier: 'platinum',
    created_at: '2025-11-04T00:00:00Z',
  },
];

export const defaultOrders = [
  {
    id: 'ord-901',
    customer_id: 'cust-1',
    order_number: 'BW-ORD-2026-901',
    customer_info: { name: 'Alexander Sterling', email: 'alexander.sterling@luxury.com', phone: '+1 (555) 234-8890' },
    items: [{ id: 'oi-1', product_id: 'p-102', product_name: 'Double-Breasted Wool-Cashmere Overcoat', color: 'Obsidian', size: 'L', quantity: 1, unit_price: 1850, total_price: 1850 }],
    subtotal: 1850,
    shipping_cost: 0,
    discount_amount: 185,
    tax_amount: 149.85,
    total: 1814.85,
    currency: 'USD',
    status: 'delivered',
    payment_status: 'verified',
    payment_method: 'bank_transfer',
    gift_wrapping: true,
    gift_message: 'Happy Birthday Alexander!',
    created_at: '2026-07-10T11:20:00Z',
    updated_at: '2026-07-14T16:00:00Z',
  },
];

export const defaultNewsletter: unknown[] = [];
