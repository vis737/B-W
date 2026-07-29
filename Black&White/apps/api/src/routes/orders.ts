import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { supabase } from '../config';
import { verifyJwt } from '../middleware/auth';
import { verifyAdminToken } from '../middleware/adminAuth';
import { generateId, nowIso, readCollection, writeCollection } from '../services/jsonDb';

export const router = Router();

const orderItemSchema = z.object({
  product_id: z.string(),
  variant_id: z.string().optional().nullable(),
  product_name: z.string(),
  color: z.string().optional().nullable(),
  size: z.string().optional().nullable(),
  quantity: z.coerce.number().int().positive(),
  unit_price: z.coerce.number().nonnegative(),
  total_price: z.coerce.number().nonnegative().optional(),
});

const orderSchema = z.object({
  items: z.array(orderItemSchema).min(1),
  shipping_address: z.record(z.any()).optional(),
  customer_info: z.record(z.any()).optional(),
  gift_wrapping: z.boolean().optional(),
  gift_message: z.string().optional().nullable(),
  coupon_code: z.string().optional().nullable(),
  payment_method: z.string().default('bank_transfer'),
  payment_status: z.string().default('pending'),
  shipping_cost: z.coerce.number().default(0),
  discount_amount: z.coerce.number().default(0),
  tax_amount: z.coerce.number().default(0),
  currency: z.string().default('USD'),
  notes: z.string().optional(),
});

const paymentSchema = z.object({
  receipt_url: z.string().min(1),
  amount: z.coerce.number().optional(),
  bank_name: z.string().optional(),
  account_name: z.string().optional(),
  transaction_reference: z.string().min(2),
  transfer_date: z.string().optional(),
  transfer_time: z.string().optional(),
  customer_notes: z.string().optional(),
});

function readOrders() {
  return readCollection<any[]>('orders');
}

function writeOrders(orders: any[]) {
  return writeCollection('orders', orders);
}

function readPayments() {
  return readCollection<any[]>('payments');
}

function writePayments(payments: any[]) {
  return writeCollection('payments', payments);
}

function calculateSubtotal(items: z.infer<typeof orderItemSchema>[]) {
  return items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
}

function orderNumber() {
  return `BW-ORD-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
}

async function insertSupabaseOrder(order: any, items: any[]) {
  if (!supabase) return;
  const { error } = await supabase.from('orders').insert({
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
    await supabase.from('order_items').insert(items.map((item) => ({ ...item, order_id: order.id })));
  }
}

router.post('/', verifyJwt, async (req: Request, res: Response) => {
  const parseResult = orderSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: 'Invalid order payload', details: parseResult.error.errors });
  }

  const user = (req as any).user;
  const payload = parseResult.data;
  const subtotal = calculateSubtotal(payload.items);
  const total = Math.max(0, subtotal + payload.shipping_cost + payload.tax_amount - payload.discount_amount);
  const timestamp = nowIso();

  const order = {
    id: generateId('ord'),
    customer_id: user.id,
    order_number: orderNumber(),
    customer_info: payload.customer_info ?? {
      name: user.name || user.full_name,
      email: user.email,
    },
    shipping_address: payload.shipping_address,
    items: payload.items.map((item) => ({
      id: generateId('oi'),
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

router.get('/my', verifyJwt, async (req: Request, res: Response) => {
  const user = (req as any).user;

  if (supabase) {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('customer_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) return res.json(data);
  }

  return res.json(readOrders().filter((order) => order.customer_id === user.id));
});

router.get('/', verifyAdminToken, (_req: Request, res: Response) => {
  return res.json(readOrders());
});

router.get('/:id', (req: Request, res: Response) => {
  const order = readOrders().find((item) => item.id === req.params.id || item.order_number === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  return res.json(order);
});

router.post('/:id/payment', verifyJwt, async (req: Request, res: Response) => {
  const parseResult = paymentSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: 'Invalid payment payload', details: parseResult.error.errors });
  }

  const user = (req as any).user;
  const orders = readOrders();
  const order = orders.find((item) => item.id === req.params.id || item.order_number === req.params.id);
  if (!order || order.customer_id !== user.id) {
    return res.status(404).json({ error: 'Order not found' });
  }

  const payload = parseResult.data;
  const payment = {
    id: generateId('pay'),
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
      { title: 'Receipt submitted', description: 'Payment proof received for finance review.', timestamp: nowIso(), status: 'current' },
    ],
    created_at: nowIso(),
  };

  const payments = readPayments();
  payments.unshift(payment);
  writePayments(payments);

  order.payment_status = 'pending';
  order.status = 'processing';
  order.updated_at = nowIso();
  writeOrders(orders);

  if (supabase) {
    await supabase.from('payments').insert(payment);
    await supabase.from('orders').update({ status: 'processing' }).eq('id', order.id);
  }

  return res.status(201).json({ payment, message: 'Payment receipt uploaded successfully. Awaiting verification.' });
});

router.post('/:id/status', verifyAdminToken, (req: Request, res: Response) => {
  const orders = readOrders();
  const order = orders.find((item) => item.id === req.params.id || item.order_number === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  if (req.body.status) order.status = req.body.status;
  if (req.body.payment_status) order.payment_status = req.body.payment_status;
  order.updated_at = nowIso();
  writeOrders(orders);

  return res.json({ success: true, order });
});

router.put('/:id', verifyAdminToken, (req: Request, res: Response) => {
  const orders = readOrders();
  const index = orders.findIndex((item) => item.id === req.params.id || item.order_number === req.params.id);
  if (index < 0) return res.status(404).json({ error: 'Order not found' });

  orders[index] = { ...orders[index], ...req.body, updated_at: nowIso() };
  writeOrders(orders);
  return res.json({ success: true, order: orders[index] });
});

router.delete('/:id', verifyAdminToken, (req: Request, res: Response) => {
  const orders = readOrders();
  const filtered = orders.filter((item) => item.id !== req.params.id && item.order_number !== req.params.id);
  if (filtered.length === orders.length) return res.status(404).json({ error: 'Order not found' });

  writeOrders(filtered);
  return res.json({ success: true });
});
