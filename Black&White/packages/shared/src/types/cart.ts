// packages/shared/src/types/cart.ts

export interface CartItem {
  id: string;
  product_id: string;
  variant_id?: string;
  product_name: string;
  product_slug: string;
  image_url: string;
  color?: string;
  size?: string;
  quantity: number;
  unit_price: number;
  discount_price?: number;
  total_price: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  discount_amount: number;
  shipping_cost: number;
  tax_amount: number;
  total: number;
  currency: string;
  coupon_code?: string;
  gift_wrapping: boolean;
  gift_message?: string;
  reward_points_used: number;
  reward_points_discount: number;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed' | 'free_shipping';
  value: number;
  min_order_amount?: number;
  max_discount?: number;
  usage_limit?: number;
  used_count: number;
  applicable_categories?: string[];
  applicable_products?: string[];
  starts_at: string;
  expires_at: string;
  is_active: boolean;
  created_at: string;
}

export interface GiftCard {
  id: string;
  code: string;
  initial_balance: number;
  current_balance: number;
  currency: string;
  purchaser_id?: string;
  recipient_email?: string;
  recipient_name?: string;
  message?: string;
  is_active: boolean;
  expires_at?: string;
  created_at: string;
}
