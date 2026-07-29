# Black & White E-commerce Project

## Monorepo Structure

- `/apps/web` - React 19 Frontend (Vite, TypeScript, Tailwind)
- `/apps/api` - Node.js Express Backend (TypeScript)
- `/packages/shared` - Shared TypeScript types, interfaces, utility functions
- `/supabase` - Database migrations, SQL functions, and RLS policies

## Getting Started

1.  Navigate into each directory to install dependencies (`npm install`).
2.  Set up your `.env` files for Supabase keys.
3.  Run migrations inside the `/supabase` folder using Supabase CLI.
