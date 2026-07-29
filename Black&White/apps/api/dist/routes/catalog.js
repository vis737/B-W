"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const adminAuth_1 = require("../middleware/adminAuth");
const jsonDb_1 = require("../services/jsonDb");
exports.router = (0, express_1.Router)();
exports.router.get('/categories', (_req, res) => {
    res.json((0, jsonDb_1.listCategories)());
});
exports.router.get('/age-groups', (_req, res) => {
    res.json((0, jsonDb_1.listAgeGroups)());
});
exports.router.get('/coupons', (_req, res) => {
    res.json((0, jsonDb_1.readCollection)('coupons'));
});
exports.router.post('/coupons', adminAuth_1.verifyAdminToken, (req, res) => {
    const code = String(req.body.code || '').trim().toUpperCase();
    if (!code)
        return res.status(400).json({ error: 'Coupon code is required.' });
    const coupons = (0, jsonDb_1.readCollection)('coupons');
    const existingIndex = coupons.findIndex((coupon) => coupon.code === code);
    const coupon = {
        id: req.body.id || (0, jsonDb_1.generateId)('coupon'),
        code,
        type: req.body.type || 'percentage',
        value: Number(req.body.value || 0),
        min_order_amount: Number(req.body.min_order_amount || req.body.minimum_cart_value || 0),
        used_count: Number(req.body.used_count || 0),
        usage_limit: req.body.usage_limit === undefined ? null : Number(req.body.usage_limit),
        starts_at: req.body.starts_at || (0, jsonDb_1.nowIso)(),
        expires_at: req.body.expires_at || null,
        is_active: req.body.is_active ?? true,
        description: req.body.description || '',
    };
    if (existingIndex >= 0)
        coupons[existingIndex] = { ...coupons[existingIndex], ...coupon };
    else
        coupons.unshift(coupon);
    (0, jsonDb_1.writeCollection)('coupons', coupons);
    res.status(existingIndex >= 0 ? 200 : 201).json({ coupon });
});
exports.router.delete('/coupons/:code', adminAuth_1.verifyAdminToken, (req, res) => {
    const coupons = (0, jsonDb_1.readCollection)('coupons');
    const filtered = coupons.filter((coupon) => coupon.code !== req.params.code.toUpperCase());
    (0, jsonDb_1.writeCollection)('coupons', filtered);
    res.json({ success: true });
});
exports.router.get('/campaigns', (_req, res) => {
    res.json((0, jsonDb_1.readCollection)('campaigns'));
});
exports.router.post('/campaigns', adminAuth_1.verifyAdminToken, (req, res) => {
    const campaigns = (0, jsonDb_1.readCollection)('campaigns');
    const campaign = {
        id: req.body.id || (0, jsonDb_1.generateId)('camp'),
        title: req.body.title || 'Untitled Campaign',
        description: req.body.description || '',
        image_url: req.body.image_url || req.body.imageUrl || '',
        cta_text: req.body.cta_text || req.body.ctaText || 'Shop Now',
        link_url: req.body.link_url || req.body.linkUrl || '/shop',
        active: req.body.active ?? true,
    };
    const index = campaigns.findIndex((item) => item.id === campaign.id);
    if (index >= 0)
        campaigns[index] = { ...campaigns[index], ...campaign };
    else
        campaigns.unshift(campaign);
    (0, jsonDb_1.writeCollection)('campaigns', campaigns);
    res.status(index >= 0 ? 200 : 201).json({ campaign });
});
exports.router.get('/cms', (_req, res) => {
    res.json((0, jsonDb_1.readCollection)('cms'));
});
exports.router.post('/cms', adminAuth_1.verifyAdminToken, (req, res) => {
    const current = (0, jsonDb_1.readCollection)('cms');
    const cms = { ...current, ...req.body, updated_at: (0, jsonDb_1.nowIso)() };
    (0, jsonDb_1.writeCollection)('cms', cms);
    res.json({ cms });
});
