import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config';
import { readCollection } from '../services/jsonDb';

export const verifyJwt = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    const customers = readCollection<any[]>('customers');
    (req as any).user = customers[0] ?? { id: 'guest', email: 'guest@blackwhite.local' };
    return next();
  }

  if (!supabase) {
    const customers = readCollection<any[]>('customers');
    const matchedCustomer = customers.find((customer) => customer.id === token || customer.email === token);
    if (!matchedCustomer) return res.status(401).json({ error: 'Invalid token' });
    (req as any).user = matchedCustomer;
    return next();
  }

  const { data, error } = await supabase.auth.getUser(token);
  if (error) return res.status(401).json({ error: 'Invalid token' });

  (req as any).user = data.user;
  next();
};
