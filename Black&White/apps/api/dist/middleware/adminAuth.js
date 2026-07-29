"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAdminToken = void 0;
exports.createAdminToken = createAdminToken;
exports.verifyAdminTokenValue = verifyAdminTokenValue;
exports.setAdminCookie = setAdminCookie;
exports.clearAdminCookie = clearAdminCookie;
const crypto_1 = __importDefault(require("crypto"));
const config_1 = require("../config");
const tokenTtlMs = 2 * 60 * 60 * 1000;
function base64Url(value) {
    return Buffer.from(value).toString('base64url');
}
function sign(payload) {
    return crypto_1.default.createHmac('sha256', config_1.apiConfig.jwtSecret).update(payload).digest('base64url');
}
function parseCookies(header) {
    return Object.fromEntries((header || '')
        .split(';')
        .map((part) => part.trim().split('='))
        .filter(([key, value]) => key && value));
}
function createAdminToken(username) {
    const payload = JSON.stringify({
        username,
        role: 'admin',
        exp: Date.now() + tokenTtlMs,
    });
    const encodedPayload = base64Url(payload);
    return `${encodedPayload}.${sign(encodedPayload)}`;
}
function verifyAdminTokenValue(token) {
    if (!token || !token.includes('.'))
        return null;
    const [encodedPayload, signature] = token.split('.');
    if (!signature || signature !== sign(encodedPayload))
        return null;
    try {
        const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'));
        if (payload.role !== 'admin' || Number(payload.exp) < Date.now())
            return null;
        return payload;
    }
    catch {
        return null;
    }
}
const verifyAdminToken = (req, res, next) => {
    const bearer = req.headers.authorization?.startsWith('Bearer ')
        ? req.headers.authorization.slice('Bearer '.length)
        : undefined;
    const cookieToken = parseCookies(req.headers.cookie).admin_session;
    const admin = verifyAdminTokenValue(bearer || cookieToken);
    if (!admin) {
        return res.status(401).json({ error: 'Administrative session expired or invalid.' });
    }
    req.admin = admin;
    next();
};
exports.verifyAdminToken = verifyAdminToken;
function setAdminCookie(res, token) {
    const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
    res.setHeader('Set-Cookie', `admin_session=${token}; HttpOnly; SameSite=Lax; Max-Age=7200; Path=/${secure}`);
}
function clearAdminCookie(res) {
    res.setHeader('Set-Cookie', 'admin_session=; HttpOnly; SameSite=Lax; Max-Age=0; Path=/');
}
