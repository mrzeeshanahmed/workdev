# Client Dashboard — Feature README

This folder contains the feature specification, tests and quickstart for the Client Dashboard feature (post project, proposals, review).

Run & test

- Install dependencies (repo root):

```pwsh
pnpm install
```

- Run all frontend tests (unit + integration):

```pwsh
cd frontend
pnpm vitest --run
```

- Run only integration tests for this feature:

```pwsh
pnpm vitest --run "specs/003-title-client-dashboard/tests/integration/**/*.test.ts"
```

Notes

- The frontend Vitest setup uses a test helper `specs/test-helpers/devServerSetup.js` to start the backend dev server during integration tests. When `DATABASE_URL` is not set, the backend falls back to sample data.
- CI: a GitHub Actions workflow `/.github/workflows/ci.yml` runs the frontend lint and tests on `ubuntu-latest`.

Contact

If you need the DB-backed integration setup or help running migrations, ask and I will add migration files and instructions.
