// packages/shared/src/types/order.ts
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
export type PaymentStatus = 'pending' | 'verified' | 'failed' | 'refunded';

export interface Order {
  id: string;
  customer_id: string;
  order_number: string;
  subtotal: number;
  shipping_cost: number;
  discount_amount: number;
  tax_amount: number;
  total: number;
  currency: string;
  status: OrderStatus;
  gift_wrapping: boolean;
  gift_message?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variant_id?: string;
  product_name: string;
  color?: string;
  size?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface PaymentTimelineStep {
  title: string;
  description: string;
  timestamp: string;
  status: 'completed' | 'current' | 'pending';
}

export interface Payment {
  id: string;
  order_id: string;
  method: string;
  status: PaymentStatus;
  amount: number;
  currency: string;
  bank_name?: string;
  account_name?: string;
  transaction_reference?: string;
  receipt_url?: string;
  transfer_date?: string;
  transfer_time?: string;
  verification_notes?: string;
  rejection_reason?: string;
  timeline?: PaymentTimelineStep[];
  admin_verified_by?: string;
  admin_verified_at?: string;
  created_at: string;
}

export interface BankTransferVerificationRequest {
  order_id: string;
  transaction_reference: string;
  transfer_date: string;
  transfer_time: string;
  amount: number;
  receipt_url: string;
  customer_notes?: string;
}

export interface ShippingAddress {
  id: string;
  customer_id: string;
  label: string;
  full_name: string;
  phone: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  province: string;
  postal_code: string;
  country: string;
  is_default: boolean;
}
