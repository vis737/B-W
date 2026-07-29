"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const zod_1 = require("zod");
const config_1 = require("../config");
const auth_1 = require("../middleware/auth");
const adminAuth_1 = require("../middleware/adminAuth");
const jsonDb_1 = require("../services/jsonDb");
exports.router = (0, express_1.Router)();
const orderItemSchema = zod_1.z.object({
    product_id: zod_1.z.string(),
    variant_id: zod_1.z.string().optional().nullable(),
    product_name: zod_1.z.string(),
    color: zod_1.z.string().optional().nullable(),
    size: zod_1.z.string().optional().nullable(),
    quantity: zod_1.z.coerce.number().int().positive(),
    unit_price: zod_1.z.coerce.number().nonnegative(),
    total_price: zod_1.z.coerce.number().nonnegative().optional(),
});
const orderSchema = zod_1.z.object({
    items: zod_1.z.array(orderItemSchema).min(1),
    shipping_address: zod_1.z.record(zod_1.z.any()).optional(),
    customer_info: zod_1.z.record(zod_1.z.any()).optional(),
    gift_wrapping: zod_1.z.boolean().optional(),
    gift_message: zod_1.z.string().optional().nullable(),
    coupon_code: zod_1.z.string().optional().nullable(),
    payment_method: zod_1.z.string().default('bank_transfer'),
    payment_status: zod_1.z.string().default('pending'),
    shipping_cost: zod_1.z.coerce.number().default(0),
    discount_amount: zod_1.z.coerce.number().default(0),
    tax_amount: zod_1.z.coerce.number().default(0),
    currency: zod_1.z.string().default('USD'),
    notes: zod_1.z.string().optional(),
});
const paymentSchema = zod_1.z.object({
    receipt_url: zod_1.z.string().min(1),
    amount: zod_1.z.coerce.number().optional(),
    bank_name: zod_1.z.string().optional(),
    account_name: zod_1.z.string().optional(),
    transaction_reference: zod_1.z.string().min(2),
    transfer_date: zod_1.z.string().optional(),
    transfer_time: zod_1.z.string().optional(),
    customer_notes: zod_1.z.string().optional(),
});
function readOrders() {
    return (0, jsonDb_1.readCollection)('orders');
}
function writeOrders(orders) {
    return (0, jsonDb_1.writeCollection)('orders', orders);
}
function readPayments() {
    return (0, jsonDb_1.readCollection)('payments');
}
function writePayments(payments) {
    return (0, jsonDb_1.writeCollection)('payments', payments);
}
function calculateSubtotal(items) {
    return items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
}
function orderNumber() {
    return `BW-ORD-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
}
async function insertSupabaseOrder(order, items) {
    if (!config_1.supabase)
        return;
    const { error } = await config_1.supabase.from('orders').insert({
        id: order.id,
        customer_id: order.customer_id,
        order_number: order.order_number,
        subtotal: order.subtotal,
        shipping_cost: order.shipping_cost,
        discount_amount: order.discount_amount,
        tax_amount: order.tax_amount,
        total: order.total,
        currency: order.currency,
        status: order.status,
        gift_wrapping: order.gift_wrapping,
        gift_message: order.gift_message,
        notes: order.notes,
    });
    if (!error && items.length > 0) {
        await config_1.supabase.from('order_items').insert(items.map((item) => ({ ...item, order_id: order.id })));
    }
}
exports.router.post('/', auth_1.verifyJwt, async (req, res) => {
    const parseResult = orderSchema.safeParse(req.body);
    if (!parseResult.success) {
        return res.status(400).json({ error: 'Invalid order payload', details: parseResult.error.errors });
    }
    const user = req.user;
    const payload = parseResult.data;
    const subtotal = calculateSubtotal(payload.items);
    const total = Math.max(0, subtotal + payload.shipping_cost + payload.tax_amount - payload.discount_amount);
    const timestamp = (0, jsonDb_1.nowIso)();
    const order = {
        id: (0, jsonDb_1.generateId)('ord'),
        customer_id: user.id,
        order_number: orderNumber(),
        customer_info: payload.customer_info ?? {
            name: user.name || user.full_name,
            email: user.email,
        },
        shipping_address: payload.shipping_address,
        items: payload.items.map((item) => ({
            id: (0, jsonDb_1.generateId)('oi'),
            ...item,
            total_price: item.total_price ?? item.unit_price * item.quantity,
        })),
        subtotal,
        shipping_cost: payload.shipping_cost,
        discount_amount: payload.discount_amount,
        tax_amount: payload.tax_amount,
        total,
        currency: payload.currency,
        status: payload.payment_method === 'bank_transfer' ? 'pending' : 'processing',
        payment_method: payload.payment_method,
        payment_status: payload.payment_status,
        coupon_code: payload.coupon_code,
        gift_wrapping: payload.gift_wrapping ?? false,
        gift_message: payload.gift_message,
        notes: payload.notes,
        created_at: timestamp,
        updated_at: timestamp,
    };
    const orders = readOrders();
    orders.unshift(order);
    writeOrders(orders);
    await insertSupabaseOrder(order, order.items);
    return res.status(201).json({ order });
});
exports.router.get('/my', auth_1.verifyJwt, async (req, res) => {
    const user = req.user;
    if (config_1.supabase) {
        const { data, error } = await config_1.supabase
            .from('orders')
            .select('*, order_items(*)')
            .eq('customer_id', user.id)
            .order('created_at', { ascending: false });
        if (!error && data)
            return res.json(data);
    }
    return res.json(readOrders().filter((order) => order.customer_id === user.id));
});
exports.router.get('/', adminAuth_1.verifyAdminToken, (_req, res) => {
    return res.json(readOrders());
});
exports.router.get('/:id', (req, res) => {
    const order = readOrders().find((item) => item.id === req.params.id || item.order_number === req.params.id);
    if (!order)
        return res.status(404).json({ error: 'Order not found' });
    return res.json(order);
});
exports.router.post('/:id/payment', auth_1.verifyJwt, async (req, res) => {
    const parseResult = paymentSchema.safeParse(req.body);
    if (!parseResult.success) {
        return res.status(400).json({ error: 'Invalid payment payload', details: parseResult.error.errors });
    }
    const user = req.user;
    const orders = readOrders();
    const order = orders.find((item) => item.id === req.params.id || item.order_number === req.params.id);
    if (!order || order.customer_id !== user.id) {
        return res.status(404).json({ error: 'Order not found' });
    }
    const payload = parseResult.data;
    const payment = {
        id: (0, jsonDb_1.generateId)('pay'),
        order_id: order.id,
        method: 'bank_transfer',
        status: 'pending',
        amount: payload.amount ?? order.total,
        currency: order.currency,
        bank_name: payload.bank_name,
        account_name: payload.account_name,
        transaction_reference: payload.transaction_reference,
        receipt_url: payload.receipt_url,
        transfer_date: payload.transfer_date,
        transfer_time: payload.transfer_time,
        customer_notes: payload.customer_notes,
        timeline: [
            { title: 'Receipt submitted', description: 'Payment proof received for finance review.', timestamp: (0, jsonDb_1.nowIso)(), status: 'current' },
        ],
        created_at: (0, jsonDb_1.nowIso)(),
    };
    const payments = readPayments();
    payments.unshift(payment);
    writePayments(payments);
    order.payment_status = 'pending';
    order.status = 'processing';
    order.updated_at = (0, jsonDb_1.nowIso)();
    writeOrders(orders);
    if (config_1.supabase) {
        await config_1.supabase.from('payments').insert(payment);
        await config_1.supabase.from('orders').update({ status: 'processing' }).eq('id', order.id);
    }
    return res.status(201).json({ payment, message: 'Payment receipt uploaded successfully. Awaiting verification.' });
});
exports.router.post('/:id/status', adminAuth_1.verifyAdminToken, (req, res) => {
    const orders = readOrders();
    const order = orders.find((item) => item.id === req.params.id || item.order_number === req.params.id);
    if (!order)
        return res.status(404).json({ error: 'Order not found' });
    if (req.body.status)
        order.status = req.body.status;
    if (req.body.payment_status)
        order.payment_status = req.body.payment_status;
    order.updated_at = (0, jsonDb_1.nowIso)();
    writeOrders(orders);
    return res.json({ success: true, order });
});
exports.router.put('/:id', adminAuth_1.verifyAdminToken, (req, res) => {
    const orders = readOrders();
    const index = orders.findIndex((item) => item.id === req.params.id || item.order_number === req.params.id);
    if (index < 0)
        return res.status(404).json({ error: 'Order not found' });
    orders[index] = { ...orders[index], ...req.body, updated_at: (0, jsonDb_1.nowIso)() };
    writeOrders(orders);
    return res.json({ success: true, order: orders[index] });
});
exports.router.delete('/:id', adminAuth_1.verifyAdminToken, (req, res) => {
    const orders = readOrders();
    const filtered = orders.filter((item) => item.id !== req.params.id && item.order_number !== req.params.id);
    if (filtered.length === orders.length)
        return res.status(404).json({ error: 'Order not found' });
    writeOrders(filtered);
    return res.json({ success: true });
});
