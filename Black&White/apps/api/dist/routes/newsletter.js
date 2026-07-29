"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const zod_1 = require("zod");
const adminAuth_1 = require("../middleware/adminAuth");
const jsonDb_1 = require("../services/jsonDb");
const supabaseService_1 = require("../services/supabaseService");
exports.router = (0, express_1.Router)();
const subscriptionSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    source: zod_1.z.string().optional(),
});
exports.router.post('/', async (req, res) => {
    const parseResult = subscriptionSchema.safeParse(req.body);
    if (!parseResult.success) {
        return res.status(400).json({ error: 'Valid email address is required.' });
    }
    const email = parseResult.data.email.toLowerCase();
    const subscriptions = (0, jsonDb_1.readCollection)('newsletter');
    if (subscriptions.some((subscription) => subscription.email === email)) {
        return res.status(409).json({ error: 'This email is already subscribed.' });
    }
    const subscription = {
        id: (0, jsonDb_1.generateId)('sub'),
        email,
        subscribed_at: (0, jsonDb_1.nowIso)(),
        status: 'active',
        source: parseResult.data.source || 'footer_newsletter',
    };
    subscriptions.unshift(subscription);
    (0, jsonDb_1.writeCollection)('newsletter', subscriptions);
    // Sync to Supabase Postgres database
    await (0, supabaseService_1.saveNewsletterSubscriberToSupabase)(email);
    res.status(201).json({ success: true, subscription });
});
exports.router.get('/', adminAuth_1.verifyAdminToken, (_req, res) => {
    res.json((0, jsonDb_1.readCollection)('newsletter'));
});
