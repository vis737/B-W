import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { apiConfig } from '../config';

const tokenTtlMs = 2 * 60 * 60 * 1000;

function base64Url(value: string) {
  return Buffer.from(value).toString('base64url');
}

function sign(payload: string) {
  return crypto.createHmac('sha256', apiConfig.jwtSecret).update(payload).digest('base64url');
}

function parseCookies(header?: string) {
  return Object.fromEntries(
    (header || '')
      .split(';')
      .map((part) => part.trim().split('='))
      .filter(([key, value]) => key && value)
  );
}

export function createAdminToken(username: string) {
  const payload = JSON.stringify({
    username,
    role: 'admin',
    exp: Date.now() + tokenTtlMs,
  });
  const encodedPayload = base64Url(payload);
  return `${encodedPayload}.${sign(encodedPayload)}`;
}

export function verifyAdminTokenValue(token?: string) {
  if (!token || !token.includes('.')) return null;
  const [encodedPayload, signature] = token.split('.');
  if (!signature || signature !== sign(encodedPayload)) return null;

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'));
    if (payload.role !== 'admin' || Number(payload.exp) < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export const verifyAdminToken = (req: Request, res: Response, next: NextFunction) => {
  const bearer = req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.slice('Bearer '.length)
    : undefined;
  const cookieToken = parseCookies(req.headers.cookie).admin_session;
  const admin = verifyAdminTokenValue(bearer || cookieToken);

  if (!admin) {
    return res.status(401).json({ error: 'Administrative session expired or invalid.' });
  }

  (req as any).admin = admin;
  next();
};

export function setAdminCookie(res: Response, token: string) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  res.setHeader('Set-Cookie', `admin_session=${token}; HttpOnly; SameSite=Lax; Max-Age=7200; Path=/${secure}`);
}

export function clearAdminCookie(res: Response) {
  res.setHeader('Set-Cookie', 'admin_session=; HttpOnly; SameSite=Lax; Max-Age=0; Path=/');
}
