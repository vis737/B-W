"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeInputs = exports.configureSecurityHeaders = void 0;
const configureSecurityHeaders = (req, res, next) => {
    // Content Security Policy
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://images.unsplash.com https://*.supabase.co; connect-src 'self' https://*.supabase.co;");
    // Strict Transport Security
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    // Prevent MIME Sniffing & Framing
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
};
exports.configureSecurityHeaders = configureSecurityHeaders;
const sanitizeInputs = (req, _res, next) => {
    if (req.body && typeof req.body === 'object') {
        for (const key of Object.keys(req.body)) {
            if (typeof req.body[key] === 'string') {
                req.body[key] = req.body[key].replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '').trim();
            }
        }
    }
    next();
};
exports.sanitizeInputs = sanitizeInputs;
