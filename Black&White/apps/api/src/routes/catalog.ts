import { Router, Request, Response } from 'express';
import { verifyAdminToken } from '../middleware/adminAuth';
import { generateId, listAgeGroups, listCategories, nowIso, readCollection, writeCollection } from '../services/jsonDb';

export const router = Router();

router.get('/categories', (_req: Request, res: Response) => {
  res.json(listCategories());
});

router.get('/age-groups', (_req: Request, res: Response) => {
  res.json(listAgeGroups());
});

router.get('/coupons', (_req: Request, res: Response) => {
  res.json(readCollection<any[]>('coupons'));
});

router.post('/coupons', verifyAdminToken, (req: Request, res: Response) => {
  const code = String(req.body.code || '').trim().toUpperCase();
  if (!code) return res.status(400).json({ error: 'Coupon code is required.' });

  const coupons = readCollection<any[]>('coupons');
  const existingIndex = coupons.findIndex((coupon) => coupon.code === code);
  const coupon = {
    id: req.body.id || generateId('coupon'),
    code,
    type: req.body.type || 'percentage',
    value: Number(req.body.value || 0),
    min_order_amount: Number(req.body.min_order_amount || req.body.minimum_cart_value || 0),
    used_count: Number(req.body.used_count || 0),
    usage_limit: req.body.usage_limit === undefined ? null : Number(req.body.usage_limit),
    starts_at: req.body.starts_at || nowIso(),
    expires_at: req.body.expires_at || null,
    is_active: req.body.is_active ?? true,
    description: req.body.description || '',
  };

  if (existingIndex >= 0) coupons[existingIndex] = { ...coupons[existingIndex], ...coupon };
  else coupons.unshift(coupon);

  writeCollection('coupons', coupons);
  res.status(existingIndex >= 0 ? 200 : 201).json({ coupon });
});

router.delete('/coupons/:code', verifyAdminToken, (req: Request, res: Response) => {
  const coupons = readCollection<any[]>('coupons');
  const filtered = coupons.filter((coupon) => coupon.code !== req.params.code.toUpperCase());
  writeCollection('coupons', filtered);
  res.json({ success: true });
});

router.get('/campaigns', (_req: Request, res: Response) => {
  res.json(readCollection<any[]>('campaigns'));
});

router.post('/campaigns', verifyAdminToken, (req: Request, res: Response) => {
  const campaigns = readCollection<any[]>('campaigns');
  const campaign = {
    id: req.body.id || generateId('camp'),
    title: req.body.title || 'Untitled Campaign',
    description: req.body.description || '',
    image_url: req.body.image_url || req.body.imageUrl || '',
    cta_text: req.body.cta_text || req.body.ctaText || 'Shop Now',
    link_url: req.body.link_url || req.body.linkUrl || '/shop',
    active: req.body.active ?? true,
  };

  const index = campaigns.findIndex((item) => item.id === campaign.id);
  if (index >= 0) campaigns[index] = { ...campaigns[index], ...campaign };
  else campaigns.unshift(campaign);

  writeCollection('campaigns', campaigns);
  res.status(index >= 0 ? 200 : 201).json({ campaign });
});

router.get('/cms', (_req: Request, res: Response) => {
  res.json(readCollection<Record<string, unknown>>('cms'));
});

router.post('/cms', verifyAdminToken, (req: Request, res: Response) => {
  const current = readCollection<Record<string, unknown>>('cms');
  const cms = { ...current, ...req.body, updated_at: nowIso() };
  writeCollection('cms', cms);
  res.json({ cms });
});
