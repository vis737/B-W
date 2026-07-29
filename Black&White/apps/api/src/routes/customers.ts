import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { generateId, nowIso, readCollection, writeCollection } from '../services/jsonDb';

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
