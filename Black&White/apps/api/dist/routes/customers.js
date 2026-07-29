"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const zod_1 = require("zod");
const jsonDb_1 = require("../services/jsonDb");
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
