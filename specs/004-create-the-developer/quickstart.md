# Quickstart: Developer Dashboard contracts and tests

This quickstart shows how to run the contract tests for the Developer Dashboard feature.

Prerequisites
- Node.js 18+ (or the project's required Node version)
- npm or pnpm configured as the repo uses
- The project root is `e:\workdev`

Install deps (if not already):
```powershell
npm install
```

Run backend unit tests (fast):
```powershell
cd e:\workdev\backend
npx vitest run tests/unit --silent
```

Run contract tests (developer dashboard, saved-searches, proposals):
```powershell
cd e:\workdev\backend
npx vitest run tests/contracts --silent
```

Run integration tests (in-memory flows):
```powershell
cd e:\workdev\backend
npx vitest run tests/integration --silent
```

Run all backend tests (unit + contracts + integration):
```powershell
cd e:\workdev\backend
npm test --silent -- -i
```

Example successful output (abbreviated):

```
Test Files  13 passed | 1 skipped (14)
	Tests  23 passed (23)
```

Notes
- If your Vitest config doesn't discover tests under `specs/`, place runnable contract tests under `backend/tests/contracts` (this repo uses that pattern).
- The in-memory server is used for fast feedback; migrating to a sqlite in-memory DB is an optional next step for higher-fidelity integration tests.

What the tests do
- The test stubs will start failing (red). Implement server endpoints or mocks to satisfy the contracts (green).

Where to add implementations
- Implement minimal endpoints in `backend/` to satisfy the contract tests.
- Use `specs/004-create-the-developer/contracts/*.md` as the source of truth for request/response shapes.

Notes
- Keep tests small and focused. Start with one endpoint and make it pass before adding more.
