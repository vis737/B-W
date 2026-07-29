import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { generateId, nowIso, readCollection, writeCollection } from '../services/jsonDb';
import { syncClerkUserToSupabase } from '../services/supabaseService';

export const router = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const registerSchema = z.object({
  name: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email(),
  password: z.string().optional(),
  pass: z.string().optional(),
  phone: z.string().optional(),
});

const syncUserSchema = z.object({
  clerk_id: z.string().min(1),
  email: z.string().email(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  avatar_url: z.string().optional(),
  membership_tier: z.string().optional(),
  customer_id: z.string().optional(),
});

router.post('/auth/sync-user', async (req: Request, res: Response) => {
  const parseResult = syncUserSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: 'Invalid user sync payload', details: parseResult.error.errors });
  }

  const user = parseResult.data;
  const syncedUser = await syncClerkUserToSupabase(user);

  // Also sync to local JSON collection for fallback
  const customers = readCollection<any[]>('customers');
  const existingIndex = customers.findIndex(
    (c) => c.email?.toLowerCase() === user.email.toLowerCase() || c.clerk_id === user.clerk_id
  );

  const localUserData = {
    id: existingIndex >= 0 ? customers[existingIndex].id : generateId('cust'),
    clerk_id: user.clerk_id,
    email: user.email,
    name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email.split('@')[0],
    avatar_url: user.avatar_url,
    membership_tier: user.membership_tier || 'silver',
    customer_id: user.customer_id || `BW-CUST-${user.clerk_id.slice(-6).toUpperCase()}`,
    updated_at: nowIso(),
  };

  if (existingIndex >= 0) {
    customers[existingIndex] = { ...customers[existingIndex], ...localUserData };
  } else {
    customers.unshift({ ...localUserData, created_at: nowIso() });
  }
  writeCollection('customers', customers);

  res.json({ success: true, user: syncedUser || localUserData, persistence: syncedUser ? 'supabase' : 'local-json' });
});

router.post('/login-customer', (req: Request, res: Response) => {
  const parseResult = loginSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const { email, password } = parseResult.data;
  const customer = readCollection<any[]>('customers').find((item) => item.email.toLowerCase() === email.toLowerCase());
  if (!customer || customer.password !== password) {
    return res.status(401).json({ error: 'Invalid customer credentials.' });
  }

  const { password: _password, ...safeCustomer } = customer;
  res.json({ success: true, token: customer.id, customer: safeCustomer });
});

router.post('/register-customer', (req: Request, res: Response) => {
  const parseResult = registerSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: 'Invalid registration payload', details: parseResult.error.errors });
  }

  const data = parseResult.data;
  const customers = readCollection<any[]>('customers');
  const email = data.email.toLowerCase();

  if (customers.some((customer) => customer.email.toLowerCase() === email)) {
    return res.status(409).json({ error: 'Customer account already exists.' });
  }

  const name = data.name || `${data.firstName || ''} ${data.lastName || ''}`.trim() || email.split('@')[0];
  const customer = {
    id: generateId('cust'),
    email,
    name,
    password: data.password || data.pass || 'customer123',
    phone: data.phone,
    customer_id: `BW-CUST-${Math.floor(10000 + Math.random() * 90000)}`,
    membership_tier: 'silver',
    created_at: nowIso(),
  };

  customers.unshift(customer);
  writeCollection('customers', customers);

  const { password: _password, ...safeCustomer } = customer;
  res.status(201).json({ success: true, token: customer.id, customer: safeCustomer });
});

