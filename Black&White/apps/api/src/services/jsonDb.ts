import fs from 'fs';
import path from 'path';
import { apiConfig } from '../config';
import {
  DbAgeGroup,
  DbCategory,
  DbProduct,
  defaultAgeGroups,
  defaultCampaigns,
  defaultCategories,
  defaultCms,
  defaultCoupons,
  defaultCustomers,
  defaultNewsletter,
  defaultOrders,
  defaultProducts,
} from '../data/defaults';

type CollectionName =
  | 'products'
  | 'categories'
  | 'age_groups'
  | 'coupons'
  | 'campaigns'
  | 'cms'
  | 'customers'
  | 'orders'
  | 'newsletter'
  | 'payments'
  | 'audit_logs';

const defaults: Record<CollectionName, unknown> = {
  products: defaultProducts,
  categories: defaultCategories,
  age_groups: defaultAgeGroups,
  coupons: defaultCoupons,
  campaigns: defaultCampaigns,
  cms: defaultCms,
  customers: defaultCustomers,
  orders: defaultOrders,
  newsletter: defaultNewsletter,
  payments: [],
  audit_logs: [],
};

const dataDir = path.resolve(apiConfig.dataDir || path.join(process.cwd(), '.data'));

function ensureDataDir() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

function collectionPath(collection: CollectionName) {
  ensureDataDir();
  return path.join(dataDir, `${collection}.json`);
}

export function readCollection<T>(collection: CollectionName): T {
  const filePath = collectionPath(collection);
  const fallback = defaults[collection] as T;

  try {
    if (!fs.existsSync(filePath)) {
      writeCollection(collection, fallback);
      return fallback;
    }

    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw || JSON.stringify(fallback)) as T;
  } catch (error) {
    console.error(`Failed to read ${collection} JSON database:`, error);
    return fallback;
  }
}

export function writeCollection<T>(collection: CollectionName, data: T): T {
  const filePath = collectionPath(collection);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  return data;
}

export function listProducts() {
  return readCollection<DbProduct[]>('products');
}

export function writeProducts(products: DbProduct[]) {
  return writeCollection('products', products);
}

export function listCategories() {
  return readCollection<DbCategory[]>('categories');
}

export function listAgeGroups() {
  return readCollection<DbAgeGroup[]>('age_groups');
}

export function nowIso() {
  return new Date().toISOString();
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function generateId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
