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

Server roles: `dev-server.js` vs `src/server.js`
----------------------------------------------

There are two servers present in the backend folder and they serve different purposes during development and testing:

- `backend/dev-server.js` (fixture/mock server)
  - Purpose: quick local mock for frontend development and simple integration tests. It serves deterministic JSON fixtures and lightweight handlers so the frontend can develop against predictable responses without a running Postgres instance.
  - Use when: you want a fast, ephemeral mock API for UI work, component development, or when spinning up the full DB-backed API is inconvenient.
  - Limitations: not feature-complete; it uses hard-coded fixtures and does not run migrations or interact with the real database.

- `backend/src/server.js` (real Express API)
  - Purpose: the real backend API used for integration tests, local development with a database, and production. It loads the controllers, services, and (optionally) connects to Postgres using `DATABASE_URL`.
  - Use when: you want realistic behavior (DB-backed flows), to run the full test-suite that exercises database logic, or when validating migrations and transactions.

When to use which
-------------------
- For rapid frontend iteration (fast feedback, no DB), prefer `dev-server.js`.
- For backend development, integration testing, or anything touching SQL and migrations, use `src/server.js`.

Deprecation guidance
---------------------
If you find the fixture server duplicates too much behavior from the real API, consider deprecating `dev-server.js` in favor of a lightweight configuration of the real API (for example: start `src/server.js` with an in-memory or test DB). That change should be made in a separate PR to:

1. Update developer docs and scripts to prefer `src/server.js` for local work.
2. Remove `dev-server.js` after teams have migrated and any automation (scripts/tests) have been updated.

If you'd like, I can prepare that deprecation PR: it will update docs, add a migration path (scripts and small compatibility shim), and remove `dev-server.js` once CI and local workflows are updated.

Marketplace pagination & filtering contract
-----------------------------------------

This section documents the query parameters and response shape used by the marketplace endpoints (notably the `GET /api/projects` list implemented by `projectsController.listProjects`). Keep the frontend and backend aligned by following these rules.

Query parameters
- page (optional): zero-based page index. Defaults to `0`.
- page_size (optional): number of items per page. Defaults to `20`.
- q (optional): full-text substring search applied to `title` and `description` (uses ILIKE on DB-backed mode). Example value: `landing`.
- status (optional): project status filter (e.g., `open`, `closed`). When provided only matching projects will be returned.

Behavior
- Results are ordered by `created_at DESC` (newest first).
- Pagination uses `LIMIT page_size OFFSET page * page_size` to keep behavior deterministic across frontends.
- The backend returns an object with `items`, `total_count`, and `next_cursor` (string or `null`). `next_cursor` contains the next page index as a string when more results exist.

Response shape (successful list)

```json
{
  "items": [
    {
      "id": "<uuid>",
      "owner_id": "<uuid-or-user>",
      "title": "Landing page revamp",
      "description": "...",
      "project_type": "fixed",
      "budget_min": 500,
      "budget_max": 1000,
      "status": "open",
      "created_at": "2025-01-01T00:00:00.000Z",
      "skills": ["react","javascript"]
    }
  ],
  "total_count": 123,
  "next_cursor": "1"
}
```

Example requests
- Get the first page (default page_size 20):

  GET /api/projects

- Get the second page with custom page size and a search term:

  GET /api/projects?page=1&page_size=10&q=landing

- Filter by status:

  GET /api/projects?status=open

Notes for implementers
- Keep `page` zero-based on both client and server to avoid off-by-one.
- `total_count` is calculated using `SELECT COUNT(*)` with the same WHERE clause used for the list query; this may be expensive for large tables — consider adding a caching strategy if necessary.
- `skills` is returned as an array of skill names aggregated from `project_skills` joined to `skills` (Postgres `array_agg(s.name)`).

If you want, I can add an OpenAPI snippet or example curl commands for these endpoints.
