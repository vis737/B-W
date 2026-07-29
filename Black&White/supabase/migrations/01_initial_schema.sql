-- Initial Schema for Supabase with Enterprise RLS Hardening

CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id UUID REFERENCES categories(id),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS age_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    min_months INT NOT NULL,
    max_months INT NOT NULL,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    sku TEXT NOT NULL UNIQUE,
    short_description TEXT,
    description TEXT,
    base_price NUMERIC(10, 2) NOT NULL,
    discount_price NUMERIC(10, 2),
    currency TEXT DEFAULT 'USD',
    gender TEXT CHECK (gender IN ('kids', 'men', 'unisex')),
    brand TEXT,
    fit_guide TEXT,
    fabric_info TEXT,
    wash_care TEXT,
    return_policy TEXT,
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    is_new_arrival BOOLEAN DEFAULT false,
    is_trending BOOLEAN DEFAULT false,
    is_limited_edition BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    alt_text TEXT,
    sort_order INT DEFAULT 0,
    is_primary BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    sku TEXT,
    color TEXT,
    color_hex TEXT,
    size TEXT,
    stock_quantity INT DEFAULT 0,
    price_adjustment NUMERIC(10, 2) DEFAULT 0,
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS product_age_groups (
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    age_group_id UUID REFERENCES age_groups(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, age_group_id)
);

-- Enterprise Bank Receipts & Verification Table
CREATE TABLE IF NOT EXISTS bank_transfer_receipts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT NOT NULL,
    customer_id UUID,
    customer_name TEXT NOT NULL,
    bank_name TEXT NOT NULL,
    transaction_reference TEXT NOT NULL UNIQUE,
    amount NUMERIC(10, 2) NOT NULL,
    receipt_url TEXT NOT NULL,
    transfer_date DATE NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'failed', 'refunded')),
    admin_notes TEXT,
    verified_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit Logging Table
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    user_email TEXT,
    role TEXT NOT NULL,
    action TEXT NOT NULL,
    resource TEXT NOT NULL,
    ip_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_transfer_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Public Read Access for active products & categories
CREATE POLICY "Public Read Active Products" ON products
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public Read Categories" ON categories
    FOR SELECT USING (is_active = true);

-- RLS Policies: Customer Insert for bank receipts
CREATE POLICY "Customer Insert Bank Receipts" ON bank_transfer_receipts
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin All Access Bank Receipts" ON bank_transfer_receipts
    FOR ALL USING (auth.jwt() ->> 'role' IN ('admin', 'super_admin'));
