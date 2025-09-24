# Migration checklist: deprecate `backend/dev-server.js`

This checklist tracks all known places in the repository that reference `dev-server.js` (either `backend/dev-server.js` or other packages' dev servers) and lists the recommended migration steps for each.

Timeline recommendation
- Deprecation announcement: immediate (docs updated).
- Migration window: 2 sprints (~4 weeks).
- Removal PR: after migration window and when CI/teams confirm readiness.

Scope
- Replace direct usage of `backend/dev-server.js` with `backend/src/server.js` started in "in-memory fallback" mode when `DATABASE_URL` is not set.
- Update CI jobs, npm scripts, README docs, and the functions dev-server references where appropriate.

Files referencing dev-server

1. `backend/package.json`
   - Script found: `dev:server": "node dev-server.js"`
   - Migration steps:
     - Replace `dev:server` with a script that starts `src/server.js` in dev mode, e.g.: `dev:server": "node ./src/server.js"` or add a `backend:dev` script that starts `src/server.js` and keeps `dev:server` as an alias for the migration window.
     - Optionally add `dev:seed` or `dev:compat` scripts to seed deterministic fixtures when `DATABASE_URL` is absent.
     - Notify developers to use `pnpm --prefix backend run dev:api` or the new `dev:server` alias.

2. `.github/workflows/functions-integration.yml`
   - Step found: `run: node functions/dev-server.js &`
   - Migration steps:
     - Update the workflow to start `functions/dev-server.js` replacement (if functions dev server remains), or if functions dev server is to stay, leave as-is. For backend-specific removal, ensure any workflows that started `backend/dev-server.js` instead start `backend/src/server.js` (or `pnpm --prefix backend run dev:api`).
     - Ensure the workflow waits for the server to be healthy before running tests (e.g., a small curl loop).

3. `functions/package.json` and `functions/README.md`
   - `functions/package.json` has `dev": "ts-node dev-server.js"` and README instructs `node functions/dev-server.js`.
   - These are for the functions dev server (different file). If you intend only to deprecate `backend/dev-server.js`, leave functions docs alone. If you want to consolidate there as well, apply similar migration steps for functions.

4. `.github/copilot-instructions.md`
   - Mentions `backend/dev-server.js` as a fixture server and contains example `node backend/dev-server.js` usage.
   - Migration steps:
     - Update the doc to reference `backend/src/server.js` and the new scripts.
     - Keep a note about running `src/server.js` with in-memory fallback when `DATABASE_URL` is unset.

5. `functions/README.md`
   - Mentions starting `functions/dev-server.js`.
   - If you plan to change functions dev server, update this; otherwise leave unchanged.

6. `functions/dev-server.js`, `backend/dev-server.js` files themselves
   - `backend/dev-server.js` remains in repository during migration window, but mark as deprecated and avoid further changes.
   - Consider adding a one-line deprecation notice at the top of the file pointing to `src/server.js`.

7. Any CI scripts or other scripts referencing `dev-server.js`
   - Search for `dev-server.js` across repo (done). Update any scripts/workflows to use `src/server.js` where appropriate.

Suggested implementation plan

Phase 1 — Announcement & docs (today)
- Update `backend/README.md` (done) and `.github/copilot-instructions.md` to mark `dev-server.js` deprecated and document the migration path.
- Add `backend:dev` script to `backend/package.json` that starts `src/server.js` (without removing `dev:server` yet).
- Add `backend/dev-compat.js` shim (optional) to seed sample data when starting `src/server.js` without a DB.

Phase 2 — CI & scripts update (during migration window)
- Update CI workflows that start `backend/dev-server.js` to start `src/server.js` (or use the new `backend:dev` script).
- For frontend teams that rely on deterministic fixtures, add `--fixture` support to `dev-compat.js` or a `dev:seed` script.
- Communicate changes and provide examples for local dev (e.g., how to start with in-memory seed).

Phase 3 — Removal PR (after migration window)
- Remove `backend/dev-server.js` and references.
- Clean up docs and scripts to remove fallback helpers if not needed.
- Run CI and ensure all jobs pass.

Per-file action items (one-liners)
- `backend/package.json`: replace/alias `dev:server` -> `node ./src/server.js` and add `dev:seed`.
- `.github/workflows/functions-integration.yml`: confirm only functions dev server invocation remains; update backend-related workflows if they start `backend/dev-server.js`.
- `.github/copilot-instructions.md`: update instructions referencing `node backend/dev-server.js`.
- `backend/README.md`: (done) mark deprecated, provide migration guidance.
- `backend/dev-server.js`: add a deprecation header comment and keep file until removal.
- `functions/package.json` and `functions/README.md`: only update if you plan to deprecate functions dev server too.

If you want, I can:
- Create the `backend:dev` and `backend:dev:seed` package.json scripts and add a small `backend/dev-compat.js` shim that starts `src/server.js` with seeded sample data.
- Patch `.github/copilot-instructions.md` and any CI workflows to reference the new scripts.
- Open a PR bundling the above changes and include migration notes in the PR description.

*** End of checklist
