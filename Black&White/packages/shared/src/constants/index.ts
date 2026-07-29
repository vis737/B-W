// packages/shared/src/constants/index.ts

export const BRAND_NAME = 'Black & White';
export const BRAND_TAGLINE = 'Bespoke Haute Couture & Fine Menswear strictly for Gentlemen.';
export const DEFAULT_CURRENCY = 'USD';
export const SUPPORTED_CURRENCIES = ['USD', 'EUR', 'GBP', 'LKR', 'AUD', 'CAD', 'AED', 'INR'] as const;
export const DEFAULT_COUNTRY = 'US';
export const POINTS_PER_SPEND = 1;        // 1 point per $10 spent
export const POINTS_SPEND_AMOUNT = 10;   // $10 = 1 point

export const GENTLEMEN_SUBSCRIPTION_PLANS = {
  atelier_essential: {
    id: 'plan_essential',
    name: "The Essential Gentleman Box",
    price_monthly: 149,
    price_annual: 1490,
    deliveries: "Quarterly Bespoke Box (4 per year)",
    items_included: "2 Tailored Shirts, 1 Silk Tie & Pocket Square, Accessories",
    benefits: [
      "Custom tailored sizing profile",
      "Complimentary worldwide express courier",
      "Member-only 10% catalog discount",
      "Priority customer concierge support",
    ]
  },
  haute_couture_vip: {
    id: 'plan_vip',
    name: "The Haute Couture Gentleman Box",
    price_monthly: 299,
    price_annual: 2990,
    deliveries: "Bi-Monthly Luxury Box (6 per year)",
    items_included: "1 Italian Wool Suit/Blazer, 2 Sea Island Cotton Shirts, Leather Goods",
    benefits: [
      "Bespoke home tailor fitting sessions",
      "Free complimentary lifetime alterations",
      "Member-only 20% catalog discount",
      "Private previews to limited edition drops",
      "VIP Concierge & Personal Stylist",
    ]
  },
  black_label_patron: {
    id: 'plan_black_label',
    name: "The Black Label Patron Circle",
    price_monthly: 599,
    price_annual: 5990,
    deliveries: "Monthly Bespoke Wardrobe (12 per year)",
    items_included: "Complete Tailored Wardrobe (Suits, Outerwear, Footwear, Parfums)",
    benefits: [
      "Unlimited custom master tailor fittings",
      "Direct phone access to Lead Atelier Director",
      "Private invitations to Milan & Paris runway shows",
      "Complimentary concierge travel wardrobe preparation",
      "30% Member discount on all atelier pieces",
    ]
  }
} as const;

export const MEMBERSHIP_TIERS = {
  silver: {
    tier: 'silver',
    min_lifetime_spending: 0,
    discount_percentage: 5,
    reward_multiplier: 1,
    card_color: '#C0C0C0',
    card_gradient: 'from-gray-300 to-gray-500',
    benefits: ['5% discount on all orders', '1x reward points', 'Birthday reward voucher', 'Free standard shipping over $150'],
  },
  gold: {
    tier: 'gold',
    min_lifetime_spending: 1000,
    discount_percentage: 10,
    reward_multiplier: 1.5,
    card_color: '#FFD700',
    card_gradient: 'from-yellow-400 to-yellow-600',
    benefits: ['10% discount on all orders', '1.5x reward points', 'Exclusive birthday gift', 'Free express shipping', 'Early access to sales'],
  },
  platinum: {
    tier: 'platinum',
    min_lifetime_spending: 3000,
    discount_percentage: 15,
    reward_multiplier: 2,
    card_color: '#E5E4E2',
    card_gradient: 'from-slate-300 to-slate-500',
    benefits: ['15% discount on all orders', '2x reward points', 'Premium birthday gift', 'Free priority shipping', 'Early access to launches', 'Bespoke gift packaging'],
  },
  diamond: {
    tier: 'diamond',
    min_lifetime_spending: 7500,
    discount_percentage: 20,
    reward_multiplier: 3,
    card_color: '#B9F2FF',
    card_gradient: 'from-cyan-300 to-blue-500',
    benefits: ['20% discount on all orders', '3x reward points', 'Exclusive birthday experience', 'Free priority shipping', 'VIP early access', 'Signature luxury box', 'Dedicated concierge support', 'Private collection invites'],
  },
} as const;

export const BANK_DETAILS = {
  bank_name: 'JPMorgan Chase Bank',
  account_name: 'Black & White Haute Couture LLC',
  account_number: '9876543210',
  branch: 'Fifth Avenue NYC',
  swift_code: 'CHASUS33XXX',
};

export const CATEGORIES_LIST = [
  { name: 'Shirts', slug: 'shirts', description: 'Tailored luxury shirts crafted from Sea Island cotton.' },
  { name: 'T-Shirts', slug: 't-shirts', description: 'Essential silk-cotton hybrid t-shirts.' },
  { name: 'Polo Shirts', slug: 'polo-shirts', description: 'Refined pique and mercerized cotton polos.' },
  { name: 'Oversized T-Shirts', slug: 'oversized-t-shirts', description: 'Contemporary relaxed silhouettes.' },
  { name: 'Casual Shirts', slug: 'casual-shirts', description: 'Linen and washed denim casual staples.' },
  { name: 'Formal Shirts', slug: 'formal-shirts', description: 'Crisp tuxedo and double-cuff dress shirts.' },
  { name: 'Hoodies', slug: 'hoodies', description: 'Ultra-soft cashmere and heavy french terry hoodies.' },
  { name: 'Sweatshirts', slug: 'sweatshirts', description: 'Minimalist crewneck sweatshirts.' },
  { name: 'Jackets', slug: 'jackets', description: 'Suede, leather, and bomber jackets.' },
  { name: 'Blazers', slug: 'blazers', description: 'Structured wool-silk and unstructured linen blazers.' },
  { name: 'Coats', slug: 'coats', description: 'Double-breasted trench coats and overcoats.' },
  { name: 'Jeans', slug: 'jeans', description: 'Japanese selvedge and Italian stretch denim.' },
  { name: 'Trousers', slug: 'trousers', description: 'Pleated wool and tailored dress trousers.' },
  { name: 'Cargo Pants', slug: 'cargo-pants', description: 'Luxury utility cargo pants.' },
  { name: 'Chinos', slug: 'chinos', description: 'Garment-dyed stretch cotton chinos.' },
  { name: 'Shorts', slug: 'shorts', description: 'Tailored shorts and resort linen shorts.' },
  { name: 'Joggers', slug: 'joggers', description: 'Tapered cashmere-blend luxury loungewear.' },
  { name: 'Ethnic Wear', slug: 'ethnic-wear', description: 'Heritage formal and festive attire.' },
  { name: 'Kurta', slug: 'kurta', description: 'Handcrafted silk and cotton kurtas.' },
  { name: 'Sherwani', slug: 'sherwani', description: 'Embroidered regal sherwanis.' },
  { name: 'Suits', slug: 'suits', description: 'Two-piece and three-piece Italian wool suits.' },
  { name: 'Waistcoats', slug: 'waistcoats', description: 'Silk jacquard and velvet waistcoats.' },
  { name: 'Shoes', slug: 'shoes', description: 'Handcrafted Italian footwear.' },
  { name: 'Sneakers', slug: 'sneakers', description: 'Minimalist leather and suede trainers.' },
  { name: 'Loafers', slug: 'loafers', description: 'Penny loafers and belgian loafers.' },
  { name: 'Sandals', slug: 'sandals', description: 'Leather slides and crossover sandals.' },
  { name: 'Boots', slug: 'boots', description: 'Chelsea boots and lace-up leather boots.' },
  { name: 'Caps', slug: 'caps', description: 'Cashmere and embroidered baseball caps.' },
  { name: 'Watches', slug: 'watches', description: 'Curated luxury timepieces.' },
  { name: 'Belts', slug: 'belts', description: 'Full-grain calfskin and reversible leather belts.' },
  { name: 'Wallets', slug: 'wallets', description: 'Bifold wallets and cardholders.' },
  { name: 'Sunglasses', slug: 'sunglasses', description: 'Handmade acetate eyewear.' },
  { name: 'Bags', slug: 'bags', description: 'Leather duffels, backpacks, and folios.' },
  { name: 'Perfumes', slug: 'perfumes', description: 'Signature haute parfumerie collection.' },
  { name: 'Gift Cards', slug: 'gift-cards', description: 'The ultimate gift of choice.' },
] as const;

export const AGE_GROUPS = [
  { name: '0–6 Months', slug: '0-6m', min_months: 0, max_months: 6, sort_order: 1 },
  { name: '6–12 Months', slug: '6-12m', min_months: 6, max_months: 12, sort_order: 2 },
  { name: '1–2 Years', slug: '1-2y', min_months: 12, max_months: 24, sort_order: 3 },
  { name: '3–5 Years', slug: '3-5y', min_months: 36, max_months: 60, sort_order: 4 },
  { name: '6–8 Years', slug: '6-8y', min_months: 72, max_months: 96, sort_order: 5 },
  { name: '9–12 Years', slug: '9-12y', min_months: 108, max_months: 144, sort_order: 6 },
  { name: 'Teen (13–17)', slug: 'teen', min_months: 156, max_months: 204, sort_order: 7 },
  { name: 'Young Adult (18–25)', slug: 'young-adult', min_months: 216, max_months: 300, sort_order: 8 },
  { name: 'Adult (26–40)', slug: 'adult', min_months: 312, max_months: 480, sort_order: 9 },
  { name: 'Mature (41–60)', slug: 'mature', min_months: 492, max_months: 720, sort_order: 10 },
  { name: 'Senior (60+)', slug: 'senior', min_months: 732, max_months: 9999, sort_order: 11 },
] as const;

export const CLOTHING_SIZES = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '5XL'] as const;
export const FOOTWEAR_SIZES = ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11', 'UK 12', 'UK 13'] as const;
export const WAIST_SIZES = ['28', '30', '32', '34', '36', '38', '40', '42'] as const;
export const FIT_TYPES = ['Regular', 'Slim', 'Relaxed', 'Oversized'] as const;

