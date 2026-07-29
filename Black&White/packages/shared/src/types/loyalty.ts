// packages/shared/src/types/loyalty.ts
import type { MembershipTier } from './customer';

export interface LoyaltyRule {
  id: string;
  currency: string;
  spend_amount: number;
  points_earned: number;
  tier_multipliers: Record<MembershipTier, number>;
  is_active: boolean;
  created_at: string;
}

export interface LoyaltyPointTransaction {
  id: string;
  customer_id: string;
  points: number;
  type: 'earned' | 'redeemed' | 'expired' | 'adjusted';
  source: string;
  order_id?: string;
  description: string;
  created_at: string;
}

export interface MembershipTierConfig {
  tier: MembershipTier;
  min_lifetime_spending: number;
  discount_percentage: number;
  reward_multiplier: number;
  benefits: string[];
  card_color: string;
  card_gradient: string;
  icon: string;
}

export interface PremiumSubscription {
  id: string;
  customer_id: string;
  plan: 'monthly' | 'yearly';
  price: number;
  currency: string;
  is_active: boolean;
  started_at: string;
  expires_at: string;
  auto_renew: boolean;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  points_required: number;
  image_url?: string;
  stock?: number;
  is_active: boolean;
  category: 'discount' | 'product' | 'shipping' | 'voucher' | 'gift';
  value?: number;
  created_at: string;
}

export interface Referral {
  id: string;
  referrer_id: string;
  referred_id: string;
  referrer_points_earned: number;
  referred_points_earned: number;
  order_id?: string;
  status: 'pending' | 'completed' | 'expired';
  created_at: string;
}
