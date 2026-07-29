// packages/shared/src/types/customer.ts
export type MembershipTier = 'silver' | 'gold' | 'platinum' | 'diamond';
export type UserRole = 'customer' | 'admin' | 'super_admin';

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string;
  mobile_number?: string;
  whatsapp_number?: string;
  email: string;
  customer_id: string;
  registration_date: string;
  lifetime_spending: number;
  reward_points: number;
  membership_tier: MembershipTier;
  referral_code?: string;
  referred_by?: string;
  created_at: string;
  updated_at: string;
}

export interface Child {
  id: string;
  parent_id: string;
  name: string;
  birthday?: string;
  gender?: string;
  preferred_size?: string;
  created_at: string;
}
