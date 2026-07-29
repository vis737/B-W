"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiConfig = exports.supabase = exports.isSupabaseConfigured = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
exports.isSupabaseConfigured = Boolean(supabaseUrl &&
    supabaseKey &&
    supabaseUrl.trim() &&
    supabaseKey.trim() &&
    !supabaseUrl.includes('YOUR_SUPABASE') &&
    !supabaseKey.includes('YOUR_SUPABASE'));
exports.supabase = exports.isSupabaseConfigured
    ? (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey, {
        auth: {
            persistSession: false,
        },
    })
    : null;
exports.apiConfig = {
    port: Number(process.env.PORT) || 4000,
    jwtSecret: process.env.JWT_SECRET || 'black-white-local-dev-secret-change-me',
    adminUsername: process.env.ADMIN_USERNAME || 'admin',
    adminPassword: process.env.ADMIN_PASSWORD || 'admin123',
    allowedOrigin: process.env.APP_URL || true,
    dataDir: process.env.DATA_DIR,
};
if (!exports.supabase) {
    console.log('Supabase env vars not configured. API is using local JSON persistence.');
}
