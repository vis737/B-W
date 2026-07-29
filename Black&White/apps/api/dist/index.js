"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv_1 = __importDefault(require("dotenv"));
const config_1 = require("./config");
const products_1 = require("./routes/products");
const orders_1 = require("./routes/orders");
const catalog_1 = require("./routes/catalog");
const admin_1 = require("./routes/admin");
const newsletter_1 = require("./routes/newsletter");
const customers_1 = require("./routes/customers");
const security_1 = require("./middleware/security");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = config_1.apiConfig.port;
app.set('trust proxy', true);
app.use((0, cors_1.default)({ origin: config_1.apiConfig.allowedOrigin, credentials: true }));
app.use((0, helmet_1.default)());
app.use(security_1.configureSecurityHeaders);
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ limit: '10mb', extended: true }));
app.use(security_1.sanitizeInputs);
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 60_000,
    max: 120,
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);
app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});
app.get('/', (_req, res) => res.json({ message: 'Black & White API v1' }));
app.get('/health', (_req, res) => res.status(200).json({ status: 'ok' }));
app.get('/api/health', (_req, res) => {
    res.json({
        status: 'ok',
        service: 'Black & White API',
        persistence: config_1.isSupabaseConfigured ? 'supabase' : 'local-json',
        timestamp: new Date().toISOString(),
    });
});
app.use('/products', products_1.router);
app.use('/orders', orders_1.router);
app.use('/api/catalog/products', products_1.router);
app.use('/api/catalog', catalog_1.router);
app.use('/api/orders', orders_1.router);
app.use('/api/admin', admin_1.router);
app.use('/api/newsletter', newsletter_1.router);
app.use('/api', customers_1.router);
app.use((_req, res) => res.status(404).json({ error: 'Not found' }));
app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(err.status ?? 500).json({ error: err.message ?? 'Internal Server Error' });
});
app.listen(PORT, () => {
    console.log(`Black & White API listening on http://localhost:${PORT}`);
});
exports.default = app;
