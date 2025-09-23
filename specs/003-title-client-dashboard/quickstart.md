# Quickstart — Client Dashboard

Local dev

1. Ensure you have Node 18+ and pnpm installed.
2. Install repository dependencies from the repo root:

```pwsh
pnpm install
```

3. Run frontend tests (Vitest). The frontend Vitest config will start a local backend dev-server automatically for integration tests via `specs/test-helpers/devServerSetup.js`:

```pwsh
cd frontend
pnpm vitest --run
```

4. To run only integration tests for this feature:

```pwsh
pnpm vitest --run "specs/003-title-client-dashboard/tests/integration/**/*.test.ts"
```

Notes
- The backend will run in a sample-data fallback mode if `DATABASE_URL` is not set. To run DB-backed tests, set `DATABASE_URL` and run migrations under `backend/migrations`.
