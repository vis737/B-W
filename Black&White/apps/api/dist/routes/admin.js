"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const crypto_1 = __importDefault(require("crypto"));
const express_1 = require("express");
const config_1 = require("../config");
const rateLimiter_1 = require("../middleware/rateLimiter");
const adminAuth_1 = require("../middleware/adminAuth");
const jsonDb_1 = require("../services/jsonDb");
exports.router = (0, express_1.Router)();
function safeCompare(a, b) {
    const left = Buffer.from(a);
    const right = Buffer.from(b);
    return left.length === right.length && crypto_1.default.timingSafeEqual(left, right);
}
function audit(req, action, resource) {
    const logs = (0, jsonDb_1.readCollection)('audit_logs');
    logs.unshift({
        id: `aud-${Date.now()}`,
        user: req.admin?.username || 'system',
        role: 'Admin',
        action,
        resource,
        ip_address: req.ip,
        timestamp: (0, jsonDb_1.nowIso)(),
    });
    (0, jsonDb_1.writeCollection)('audit_logs', logs.slice(0, 500));
}
exports.router.post('/login', rateLimiter_1.authRateLimiter, (req, res) => {
    const username = String(req.body?.username || '').trim();
    const password = String(req.body?.password || '');
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }
    const usernameMatch = safeCompare(username, config_1.apiConfig.adminUsername);
    const passwordMatch = safeCompare(password, config_1.apiConfig.adminPassword);
    if (!usernameMatch || !passwordMatch) {
        return res.status(401).json({ error: 'Invalid administrative credentials.' });
    }
    const token = (0, adminAuth_1.createAdminToken)(username);
    (0, adminAuth_1.setAdminCookie)(res, token);
    res.json({ success: true, token, username });
});
exports.router.get('/session', adminAuth_1.verifyAdminToken, (req, res) => {
    res.json({ authenticated: true, username: req.admin.username });
});
exports.router.post('/logout', (_req, res) => {
    (0, adminAuth_1.clearAdminCookie)(res);
    res.json({ success: true });
});
exports.router.get('/customers', adminAuth_1.verifyAdminToken, (_req, res) => {
    const customers = (0, jsonDb_1.readCollection)('customers').map(({ password, passwordHash, password_hash, ...customer }) => customer);
    res.json(customers);
});
exports.router.get('/payments', adminAuth_1.verifyAdminToken, (_req, res) => {
    res.json((0, jsonDb_1.readCollection)('payments'));
});
exports.router.post('/payments/:id/status', adminAuth_1.verifyAdminToken, (req, res) => {
    const payments = (0, jsonDb_1.readCollection)('payments');
    const payment = payments.find((item) => item.id === req.params.id);
    if (!payment)
        return res.status(404).json({ error: 'Payment not found' });
    payment.status = req.body.status || payment.status;
    payment.verification_notes = req.body.verification_notes || req.body.notes || payment.verification_notes;
    payment.rejection_reason = req.body.rejection_reason || payment.rejection_reason;
    payment.admin_verified_by = req.admin.username;
    payment.admin_verified_at = (0, jsonDb_1.nowIso)();
    (0, jsonDb_1.writeCollection)('payments', payments);
    const orders = (0, jsonDb_1.readCollection)('orders');
    const order = orders.find((item) => item.id === payment.order_id);
    if (order) {
        order.payment_status = payment.status;
        order.status = payment.status === 'verified' ? 'processing' : order.status;
        order.updated_at = (0, jsonDb_1.nowIso)();
        (0, jsonDb_1.writeCollection)('orders', orders);
    }
    audit(req, `Payment ${payment.status}`, payment.id);
    res.json({ success: true, payment, order });
});
exports.router.get('/live-activity', adminAuth_1.verifyAdminToken, (_req, res) => {
    const orders = (0, jsonDb_1.readCollection)('orders');
    const today = new Date().toISOString().slice(0, 10);
    const todayOrders = orders.filter((order) => String(order.created_at || '').startsWith(today));
    const revenue = todayOrders.reduce((sum, order) => sum + Number(order.total || 0), 0);
    res.json({
        sessions: [
            { ip: '127.0.0.1', type: 'guest', activePage: '/shop', cartTotal: 0, durationSeconds: 42, lastActive: Date.now() },
        ],
        alerts: [],
        stats: {
            activeVisitors: 1,
            todayVisitors: 1,
            todayOrders: todayOrders.length,
            avgSessionMinutes: 6.5,
            abandonedCount: 0,
            newUsers: (0, jsonDb_1.readCollection)('customers').length,
            returningUsers: 0,
        },
        liveRevenue: revenue,
    });
});
exports.router.get('/security-stats', adminAuth_1.verifyAdminToken, (_req, res) => {
    res.json({
        stats: {
            securityScore: 96,
            failedAttempts: 0,
            blockedIps: 0,
            activeAdminSessions: 1,
            expiredTokens: 0,
            lastScanDate: new Date().toLocaleTimeString(),
            dbEncryption: 'Local JSON fallback / Supabase optional',
            sslStatus: process.env.NODE_ENV === 'production' ? 'Expected at reverse proxy' : 'Local development',
            wafStatus: 'Express rate limits active',
        },
        threatLogs: (0, jsonDb_1.readCollection)('audit_logs').slice(0, 20),
    });
});
exports.router.get('/audit-logs', adminAuth_1.verifyAdminToken, (_req, res) => {
    res.json((0, jsonDb_1.readCollection)('audit_logs'));
});
