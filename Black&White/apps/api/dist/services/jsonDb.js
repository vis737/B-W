"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readCollection = readCollection;
exports.writeCollection = writeCollection;
exports.listProducts = listProducts;
exports.writeProducts = writeProducts;
exports.listCategories = listCategories;
exports.listAgeGroups = listAgeGroups;
exports.nowIso = nowIso;
exports.slugify = slugify;
exports.generateId = generateId;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const config_1 = require("../config");
const defaults_1 = require("../data/defaults");
const defaults = {
    products: defaults_1.defaultProducts,
    categories: defaults_1.defaultCategories,
    age_groups: defaults_1.defaultAgeGroups,
    coupons: defaults_1.defaultCoupons,
    campaigns: defaults_1.defaultCampaigns,
    cms: defaults_1.defaultCms,
    customers: defaults_1.defaultCustomers,
    orders: defaults_1.defaultOrders,
    newsletter: defaults_1.defaultNewsletter,
    payments: [],
    audit_logs: [],
};
const dataDir = path_1.default.resolve(config_1.apiConfig.dataDir || path_1.default.join(process.cwd(), '.data'));
function ensureDataDir() {
    if (!fs_1.default.existsSync(dataDir)) {
        fs_1.default.mkdirSync(dataDir, { recursive: true });
    }
}
function collectionPath(collection) {
    ensureDataDir();
    return path_1.default.join(dataDir, `${collection}.json`);
}
function readCollection(collection) {
    const filePath = collectionPath(collection);
    const fallback = defaults[collection];
    try {
        if (!fs_1.default.existsSync(filePath)) {
            writeCollection(collection, fallback);
            return fallback;
        }
        const raw = fs_1.default.readFileSync(filePath, 'utf8');
        return JSON.parse(raw || JSON.stringify(fallback));
    }
    catch (error) {
        console.error(`Failed to read ${collection} JSON database:`, error);
        return fallback;
    }
}
function writeCollection(collection, data) {
    const filePath = collectionPath(collection);
    fs_1.default.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return data;
}
function listProducts() {
    return readCollection('products');
}
function writeProducts(products) {
    return writeCollection('products', products);
}
function listCategories() {
    return readCollection('categories');
}
function listAgeGroups() {
    return readCollection('age_groups');
}
function nowIso() {
    return new Date().toISOString();
}
function slugify(value) {
    return value
        .toLowerCase()
        .replace(/&/g, 'and')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}
function generateId(prefix) {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
