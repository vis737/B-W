-- Migration 03: full_database_tables.sql
-- Complete tables for Orders, Order Items, Coupons, Campaigns, CMS, and Newsletter Subscribers

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id TEXT,
    order_number TEXT NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0,
    shipping_cost NUMERIC(10, 2) NOT NULL DEFAULT 0,
    discount_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    tax_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    total NUMERIC(10, 2) NOT NULL DEFAULT 0,
    currency TEXT DEFAULT 'USD',
    status TEXT DEFAULT 'pending',
    payment_method TEXT DEFAULT 'bank_transfer',
    payment_status TEXT DEFAULT 'pending',
    shipping_address JSONB,
    customer_info JSONB,
    gift_wrapping BOOLEAN DEFAULT false,
    gift_message TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT orders_order_number_key UNIQUE (order_number)
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL,
    variant_id TEXT,
    product_name TEXT NOT NULL,
    color TEXT,
    size TEXT,
    quantity INT NOT NULL DEFAULT 1,
    unit_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
    total_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Coupons Table
CREATE TABLE IF NOT EXISTS coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL,
    discount_type TEXT DEFAULT 'percentage',
    discount_value NUMERIC(10, 2) NOT NULL DEFAULT 0,
    min_order_amount NUMERIC(10, 2) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    valid_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT coupons_code_key UNIQUE (code)
);

-- Campaigns Table
CREATE TABLE IF NOT EXISTS campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    target_segment TEXT,
    subject TEXT,
    content TEXT,
    status TEXT DEFAULT 'draft',
    scheduled_at TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CMS Content Table
CREATE TABLE IF NOT EXISTS cms_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT,
    type TEXT DEFAULT 'page',
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT cms_content_key_key UNIQUE (key)
);

-- Newsletter Subscribers Table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    status TEXT DEFAULT 'subscribed',
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT newsletter_subscribers_email_key UNIQUE (email)
);

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Public & Service Policies
DROP POLICY IF EXISTS "Allow All Orders" ON orders;
CREATE POLICY "Allow All Orders" ON orders FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow All Order Items" ON order_items;
CREATE POLICY "Allow All Order Items" ON order_items FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow Read Coupons" ON coupons;
CREATE POLICY "Allow Read Coupons" ON coupons FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Allow All Coupons Admin" ON coupons;
CREATE POLICY "Allow All Coupons Admin" ON coupons FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow All CMS" ON cms_content;
CREATE POLICY "Allow All CMS" ON cms_content FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow Insert Newsletter" ON newsletter_subscribers;
CREATE POLICY "Allow Insert Newsletter" ON newsletter_subscribers FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow All Newsletter Admin" ON newsletter_subscribers;
CREATE POLICY "Allow All Newsletter Admin" ON newsletter_subscribers FOR ALL USING (true) WITH CHECK (true);
