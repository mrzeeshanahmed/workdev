````markdown
# Quickstart: Local development (frontend + Supabase)

Prereqs: Node 18+, pnpm or npm, a Supabase project and API keys (or local Supabase setup).

1. Clone repo and switch to feature branch:

```powershell
git checkout 001-title-core-platform
```

2. Install frontend dependencies (from repo root or `frontend/` if created):

```powershell
cd frontend
pnpm install
pnpm run dev
```

3. Configure environment variables (example `.env.local`):

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=public-anon-key
```

4. Run the frontend and sign in via Supabase Auth (email or OAuth). Seed sample data using `supabase` CLI or SQL scripts located in `specs/001-title-core-platform/sql/` (if present).

5. Run tests:

```powershell
pnpm test
```

````
