import { SupabaseClient, createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseKey &&
    supabaseUrl.trim() &&
    supabaseKey.trim() &&
    !supabaseUrl.includes('YOUR_SUPABASE') &&
    !supabaseKey.includes('YOUR_SUPABASE')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseKey!, {
      auth: {
        persistSession: false,
      },
    })
  : null;

export const apiConfig = {
  port: Number(process.env.PORT) || 4000,
  jwtSecret: process.env.JWT_SECRET || 'black-white-local-dev-secret-change-me',
  adminUsername: process.env.ADMIN_USERNAME || 'admin',
  adminPassword: process.env.ADMIN_PASSWORD || 'admin123',
  allowedOrigin: process.env.APP_URL || true,
  dataDir: process.env.DATA_DIR,
};

if (!supabase) {
  console.log('Supabase env vars not configured. API is using local JSON persistence.');
}
