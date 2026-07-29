import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { verifyAdminToken } from '../middleware/adminAuth';
import { generateId, nowIso, readCollection, writeCollection } from '../services/jsonDb';

export const router = Router();

const subscriptionSchema = z.object({
  email: z.string().email(),
  source: z.string().optional(),
});

router.post('/', (req: Request, res: Response) => {
  const parseResult = subscriptionSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: 'Valid email address is required.' });
  }

  const email = parseResult.data.email.toLowerCase();
  const subscriptions = readCollection<any[]>('newsletter');
  if (subscriptions.some((subscription) => subscription.email === email)) {
    return res.status(409).json({ error: 'This email is already subscribed.' });
  }

  const subscription = {
    id: generateId('sub'),
    email,
    subscribed_at: nowIso(),
    status: 'active',
    source: parseResult.data.source || 'footer_newsletter',
  };

  subscriptions.unshift(subscription);
  writeCollection('newsletter', subscriptions);
  res.status(201).json({ success: true, subscription });
});

router.get('/', verifyAdminToken, (_req: Request, res: Response) => {
  res.json(readCollection<any[]>('newsletter'));
});
