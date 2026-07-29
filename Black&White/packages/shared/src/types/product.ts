// packages/shared/src/types/product.ts
export type Gender = 'kids' | 'men' | 'unisex';

export interface AgeGroup {
  id: string;
  name: string;
  slug: string;
  min_months: number;
  max_months: number;
  sort_order: number;
  is_active: boolean;
}

export interface Category {
  id: string;
  parent_id?: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  is_active: boolean;
  sort_order: number;
  children?: Category[];
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt_text?: string;
  sort_order: number;
  is_primary: boolean;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  sku?: string;
  color?: string;
  color_hex?: string;
  size?: string;
  stock_quantity: number;
  price_adjustment: number;
  is_active: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  short_description?: string;
  description?: string;
  base_price: number;
  discount_price?: number;
  currency: string;
  gender: Gender;
  categories: Category[];
  age_groups: AgeGroup[];
  images: ProductImage[];
  variants: ProductVariant[];
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
  is_preorder?: boolean;
  is_backorder?: boolean;
  fit_type?: string;
  material?: string;
  care_guide?: string;
  average_rating?: number;
  review_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  product_id: string;
  customer_id: string;
  customer_name: string;
  customer_avatar?: string;
  rating: number;
  title?: string;
  body: string;
  images?: string[];
  is_verified_purchase: boolean;
  is_approved: boolean;
  helpful_count: number;
  created_at: string;
}

export interface ProductQA {
  id: string;
  product_id: string;
  question: string;
  answer?: string;
  asked_by: string;
  answered_by?: string;
  created_at: string;
  answered_at?: string;
}

export interface ProductFilters {
  age_group?: string; // Highest Priority Filter
  category?: string;
  collection?: string;
  brand?: string;
  size?: string;
  color?: string;
  material?: string;
  fabric?: string;
  occasion?: string;
  season?: string;
  style?: string;
  fit?: string;
  min_price?: number;
  max_price?: number;
  gender?: Gender;
  rating?: number;
  discount?: number;
  is_available?: boolean;
  is_new_arrival?: boolean;
  is_trending?: boolean;
  is_limited_edition?: boolean;
  is_preorder?: boolean;
  on_sale?: boolean;
  search?: string;
  sort_by?: 'newest' | 'popularity' | 'price_asc' | 'price_desc' | 'rating' | 'best_selling';
  page?: number;
  per_page?: number;
}

export interface AISearchResult {
  products: Product[];
  suggested_categories: Category[];
  suggested_age_groups: AgeGroup[];
  popular_searches: string[];
  matched_tags: string[];
}

export interface ProductBundle {
  id: string;
  title: string;
  description: string;
  discount_percentage: number;
  main_product_id: string;
  bundled_products: Product[];
}

export interface GiftOptions {
  is_gift_wrapped: boolean;
  gift_message?: string;
  recipient_name?: string;
  luxury_box_selected?: boolean;
}

export interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  author: string;
  category: string;
  tags: string[];
  published_at: string;
  read_time: string;
  is_published: boolean;
}

export interface SupportTicket {
  id: string;
  ticket_number: string;
  customer_id: string;
  customer_name: string;
  customer_email: string;
  subject: string;
  category: 'order' | 'refund' | 'product' | 'account' | 'general';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  created_at: string;
  updated_at: string;
  messages: {
    id: string;
    sender: 'customer' | 'admin';
    sender_name: string;
    message: string;
    created_at: string;
  }[];
}

export interface BannerConfig {
  id: string;
  title: string;
  subtitle?: string;
  image_url: string;
  link_url?: string;
  button_text?: string;
  type: 'hero' | 'promo' | 'flash_sale' | 'featured_collection';
  is_active: boolean;
  sort_order: number;
}

export interface SystemLog {
  id: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  source: string;
  timestamp: string;
}

export interface AuditLog {
  id: string;
  user: string;
  role: string;
  action: string;
  resource: string;
  ip_address: string;
  timestamp: string;
}

export interface StaffAccount {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'inventory_manager' | 'support_agent';
  status: 'active' | 'inactive';
  last_login: string;
}

