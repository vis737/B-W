-- Migration: 02_clerk_users_sync.sql
-- Table to synchronize Clerk authenticated users into Supabase database

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clerk_id TEXT NOT NULL,
    email TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'customer',
    membership_tier TEXT DEFAULT 'silver' CHECK (membership_tier IN ('silver', 'gold', 'platinum', 'diamond')),
    customer_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT users_clerk_id_key UNIQUE (clerk_id),
    CONSTRAINT users_email_key UNIQUE (email),
    CONSTRAINT users_customer_id_key UNIQUE (customer_id)
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Allow public/anon select for user lookup
DROP POLICY IF EXISTS "Public Read Users" ON users;
CREATE POLICY "Public Read Users" ON users
    FOR SELECT USING (true);

-- Allow backend service / authenticated users to insert or update their user record
DROP POLICY IF EXISTS "Service Role All Access Users" ON users;
CREATE POLICY "Service Role All Access Users" ON users
    FOR ALL USING (true) WITH CHECK (true);
