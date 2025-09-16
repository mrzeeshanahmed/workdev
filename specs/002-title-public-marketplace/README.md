# Public Marketplace — Quickstart

This document explains how to run the backend dev server, run migrations, and run unit/e2e tests for the public marketplace feature.

Prereqs
- Node 18+
- PostgreSQL (optional for sample-data mode)

Run backend dev server (sample-data fallback)

1. Install dependencies

```powershell
cd backend
npm install
npm run dev:server
```

2. Run migrations (if you have a Postgres test DB)

Create a `.env` with DATABASE_URL and then run the included PowerShell helper:

```powershell
cd backend
.\scripts\run-migrations.ps1 -ConnectionString $env:DATABASE_URL
```

Tests

- Unit tests (backend): `npm test` in the `backend/` folder (uses Vitest)
- E2E smoke test: start the backend dev server and then run the e2e test file under `specs/002-title-public-marketplace/tests/e2e/`

Notes
- The backend will fallback to sample data if `DATABASE_URL` is not set. This allows frontend dev and tests to run without a real DB.
- Admin UI in `frontend/src/pages/admin/FeaturedProjectsAdmin.tsx` is a minimal scaffold — implement server-side update actions before using in production.
