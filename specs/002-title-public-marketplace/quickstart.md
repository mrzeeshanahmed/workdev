# Quickstart: Public marketplace and developer directory

This quickstart shows how to run contract tests and start the local dev server for the marketplace feature.

Prereqs:
- Node.js & npm installed
- Postgres database configured (see repo README)

Run contract tests (from repo root):

```pwsh
cd frontend
npx vitest -c vitest.config.ts
```

Start the functions dev server (if applicable):

```pwsh
# From repo root
node ./specs/test-helpers/devServer.js  # starts functions dev server on a test port
```

Developers should implement contract tests in `specs/002-title-public-marketplace/contracts` and ensure they fail before implementation.
