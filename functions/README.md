# Functions dev server

This folder contains a small Node-based dev server that proxies requests to handler modules under `functions/handlers` so Edge Function behavior can be exercised locally without the Supabase Edge runtime.

Quickstart:

1. Install dependencies:

   npm --prefix functions install

2. Set environment variables (example):

   $env:VITE_SUPABASE_URL='https://your-project.supabase.co'
   $env:VITE_SUPABASE_ANON_KEY='anon-key'
   $env:SUPABASE_SERVICE_ROLE_KEY='service-role-key'

3. Start the dev server:

   node functions/dev-server.js

4. Run integration tests (from repo root):

   $env:RUN_FUNCTIONS_LOCAL='1'; $env:FUNCTIONS_PORT='54322'; npm --prefix frontend test

Notes:
- Handlers live under `functions/handlers` and export async function(req) that return either `{ status, body }` or a raw object.
- This is a convenience shim for local dev and CI; production should use Supabase Edge Functions.
