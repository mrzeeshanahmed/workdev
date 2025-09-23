# Shared Project Workspace - Tests & Quickstart

This folder contains tests and quickstart instructions for the Shared Project Workspace feature.

Run unit tests (backend):

```pwsh
cd e:\workdev
npx vitest run backend/src/__tests__/milestones.service.test.js
```

Run in-memory integration/e2e tests (requires dev app running):

1. Start the backend app:

```pwsh
node backend/start-app.cjs
```

2. Run the e2e/spec tests:

```pwsh
npx vitest run specs/005-title-shared-project/tests/e2e/milestones.e2e.test.ts
npx vitest run specs/005-title-shared-project/tests/unit/milestone.state.test.ts
```

Notes:
- The in-memory seeded workspace id used in tests is `00000000-0000-0000-0000-000000000000`.
- These tests are fast and use the in-memory stores defined in `backend/src/stores/inMemoryStore.js`.
- For DB-backed runs, set `DATABASE_URL` and run migrations (not covered here).