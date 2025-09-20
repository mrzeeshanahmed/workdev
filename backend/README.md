# Backend - Unit Test Notes

This small README explains how to run the quick backend runtime checks and why Vitest may not pick up the `backend/tests` folder by default.

Quick check

Run the runtime check script which exercises the controller functions in fallback (DB-disabled) mode:

```powershell
pnpm run backend:check
```

What it does

- Verifies `createProposal` validation behavior (throws when payload missing).
- Verifies fallback returns from `createProposal`, `acceptProposal`, `createProject`, `listProjects`, and `getProjectDetail`.

Notes on test runner discovery

- The repository's main test runner configuration (Vitest) currently uses include/exclude patterns that don't automatically discover `backend/tests/**/*.test.js` files. If you'd like these backend unit tests to run as part of the normal `pnpm vitest` run, choose one of the following:
  - Move the backend tests into a directory matched by Vitest's include globs (e.g., `specs/**/tests/...`).
  - Update the Vitest config (or package.json test script) to include `backend/tests/**/*.test.js`.

Recommended next steps

- If you want full vitest integration, I can update the Vitest config to include backend tests and re-run the suite. That may reveal additional failures that need addressing.
- Otherwise, keep using `pnpm run backend:check` as a lightweight check for controller behavior.
