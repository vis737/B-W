"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const zod_1 = require("zod");
const jsonDb_1 = require("../services/jsonDb");
const supabaseService_1 = require("../services/supabaseService");
exports.router = (0, express_1.Router)();
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(1),
});
const registerSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    firstName: zod_1.z.string().optional(),
    lastName: zod_1.z.string().optional(),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().optional(),
    pass: zod_1.z.string().optional(),
    phone: zod_1.z.string().optional(),
});
const syncUserSchema = zod_1.z.object({
    clerk_id: zod_1.z.string().min(1),
    email: zod_1.z.string().email(),
    first_name: zod_1.z.string().optional(),
    last_name: zod_1.z.string().optional(),
    avatar_url: zod_1.z.string().optional(),
    membership_tier: zod_1.z.string().optional(),
    customer_id: zod_1.z.string().optional(),
});
exports.router.post('/auth/sync-user', async (req, res) => {
    const parseResult = syncUserSchema.safeParse(req.body);
    if (!parseResult.success) {
        return res.status(400).json({ error: 'Invalid user sync payload', details: parseResult.error.errors });
    }
    const user = parseResult.data;
    const syncedUser = await (0, supabaseService_1.syncClerkUserToSupabase)(user);
    // Also sync to local JSON collection for fallback
    const customers = (0, jsonDb_1.readCollection)('customers');
    const existingIndex = customers.findIndex((c) => c.email?.toLowerCase() === user.email.toLowerCase() || c.clerk_id === user.clerk_id);
    const localUserData = {
        id: existingIndex >= 0 ? customers[existingIndex].id : (0, jsonDb_1.generateId)('cust'),
        clerk_id: user.clerk_id,
        email: user.email,
        name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email.split('@')[0],
        avatar_url: user.avatar_url,
        membership_tier: user.membership_tier || 'silver',
        customer_id: user.customer_id || `BW-CUST-${user.clerk_id.slice(-6).toUpperCase()}`,
        updated_at: (0, jsonDb_1.nowIso)(),
    };
    if (existingIndex >= 0) {
        customers[existingIndex] = { ...customers[existingIndex], ...localUserData };
    }
    else {
        customers.unshift({ ...localUserData, created_at: (0, jsonDb_1.nowIso)() });
    }
    (0, jsonDb_1.writeCollection)('customers', customers);
    res.json({ success: true, user: syncedUser || localUserData, persistence: syncedUser ? 'supabase' : 'local-json' });
});
exports.router.post('/login-customer', (req, res) => {
    const parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }
    const { email, password } = parseResult.data;
    const customer = (0, jsonDb_1.readCollection)('customers').find((item) => item.email.toLowerCase() === email.toLowerCase());
    if (!customer || customer.password !== password) {
        return res.status(401).json({ error: 'Invalid customer credentials.' });
    }
    const { password: _password, ...safeCustomer } = customer;
    res.json({ success: true, token: customer.id, customer: safeCustomer });
});
exports.router.post('/register-customer', (req, res) => {
    const parseResult = registerSchema.safeParse(req.body);
    if (!parseResult.success) {
        return res.status(400).json({ error: 'Invalid registration payload', details: parseResult.error.errors });
    }
    const data = parseResult.data;
    const customers = (0, jsonDb_1.readCollection)('customers');
    const email = data.email.toLowerCase();
    if (customers.some((customer) => customer.email.toLowerCase() === email)) {
        return res.status(409).json({ error: 'Customer account already exists.' });
    }
    const name = data.name || `${data.firstName || ''} ${data.lastName || ''}`.trim() || email.split('@')[0];
    const customer = {
        id: (0, jsonDb_1.generateId)('cust'),
        email,
        name,
        password: data.password || data.pass || 'customer123',
        phone: data.phone,
        customer_id: `BW-CUST-${Math.floor(10000 + Math.random() * 90000)}`,
        membership_tier: 'silver',
        created_at: (0, jsonDb_1.nowIso)(),
    };
    customers.unshift(customer);
    (0, jsonDb_1.writeCollection)('customers', customers);
    const { password: _password, ...safeCustomer } = customer;
    res.status(201).json({ success: true, token: customer.id, customer: safeCustomer });
});
