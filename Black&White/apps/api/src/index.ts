import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { apiConfig, isSupabaseConfigured } from './config';
import { router as productsRouter } from './routes/products';
import { router as ordersRouter } from './routes/orders';
import { router as catalogRouter } from './routes/catalog';
import { router as adminRouter } from './routes/admin';
import { router as newsletterRouter } from './routes/newsletter';
import { router as customersRouter } from './routes/customers';
import { configureSecurityHeaders, sanitizeInputs } from './middleware/security';

dotenv.config();

const app = express();
const PORT = apiConfig.port;

app.set('trust proxy', true);
app.use(cors({ origin: apiConfig.allowedOrigin as any, credentials: true }));
app.use(helmet());
app.use(configureSecurityHeaders);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(sanitizeInputs);

const limiter = rateLimit({
  windowMs: 60_000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

app.get('/', (_req, res) => res.json({ message: 'Black & White API v1' }));
app.get('/health', (_req, res) => res.status(200).json({ status: 'ok' }));
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'Black & White API',
    persistence: isSupabaseConfigured ? 'supabase' : 'local-json',
    timestamp: new Date().toISOString(),
  });
});

app.use('/products', productsRouter);
app.use('/orders', ordersRouter);
app.use('/api/catalog/products', productsRouter);
app.use('/api/catalog', catalogRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/admin', adminRouter);
app.use('/api/newsletter', newsletterRouter);
app.use('/api', customersRouter);

app.use((_req: Request, res: Response) => res.status(404).json({ error: 'Not found' }));

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(err.status ?? 500).json({ error: err.message ?? 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Black & White API listening on http://localhost:${PORT}`);
});

export default app;
