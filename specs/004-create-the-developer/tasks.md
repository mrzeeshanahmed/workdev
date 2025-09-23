# Tasks: Developer Dashboard (feature: developer-dashboard)

Feature directory: `E:\workdev\specs\004-create-the-developer`

Summary: Implement Developer Dashboard backend APIs, data models, and contract tests. Follow TDD: create failing contract tests, implement minimal models/services/endpoints to satisfy them, then add integration tests and polish.

Execution rules used:
- Tests before implementation (TDD)
- Each contract file → one contract test task marked [P]
- Each entity in data-model → model creation task marked [P]
- Endpoints implemented sequentially when sharing files/resources
- Setup tasks run before everything else

Parallelization key: [P] means this task can run in parallel with other [P] tasks when they touch different files.

T001 — Setup: Install project dependencies and test runner
- Path: repository root
- Action: Ensure Node 18+ installed, run `npm install`. Confirm `vitest` and `supertest` present. If missing, add to `backend/package.json` or repo `package.json`:
  - devDependencies: vitest, supertest
- Dependency notes: Must complete before running tests.
- Command example (PowerShell):
```powershell
npm install
```

T002 — Setup: Add test helper and supertest setup
- Path: `backend/tests` (create if missing)
- Action: Add `tests/helpers/server.js` that exports a `createTestServer()` helper returning an Express app (or point to existing `backend/src/app.js`). Add test setup to import and close server between tests.
- Dependency notes: Required before running contract tests that hit endpoints.
- Parallelizable: no (affects test runner config)

T003 [P] — Contract Test: Developer Dashboard contract
- Path: `specs/004-create-the-developer/tests/contracts/developers.dashboard.test.js`
- Action: Flesh out test to call GET `/developers/:id/dashboard` using `supertest` and assert response shape per `contracts/developers.dashboard.contract.md`.
- Failure expected initially (red). Implement server and route to satisfy.
- Dependency: T002 (test helper)

T004 [P] — Contract Test: Saved Searches contract
- Path: `specs/004-create-the-developer/tests/contracts/saved-searches.test.js`
- Action: Expand tests to POST/GET/DELETE endpoints for saved searches using `supertest`, asserting payload and 201/204 status codes.
- Dependency: T002

T005 [P] — Contract Test: Proposals contract
- Path: `specs/004-create-the-developer/tests/contracts/proposals.test.js`
- Action: Expand tests to POST `/projects/:projectId/proposals` and GET `/developers/:developerId/proposals` asserting shapes.
- Dependency: T002

T006 [P] — Model: Create `Developer` model
- Path: `backend/src/models/developer.js` (or `src/models/developer.ts`)
- Action: Implement DB model/schema for `Developer` entity (fields from `data-model.md`). Add migration or schema file if using Prisma/TypeORM/knex.
- Test: Add unit tests for model validation.
- Dependency: T001

T007 [P] — Model: Create `Project` model
- Path: `backend/src/models/project.js`
- Action: Implement `Project` schema and indexes (full-text). Add sample seed data for contract tests.
- Dependency: T001

T008 [P] — Model: Create `Proposal` model
- Path: `backend/src/models/proposal.js`
- Action: Implement `Proposal` schema and simple status enum handling.
- Dependency: T001

T009 [P] — Model: Create `SavedSearch` model
- Path: `backend/src/models/savedSearch.js`
- Action: Implement `SavedSearch` schema and criteria normalization logic (lowercase skills/tags). Add unique constraint for normalized criteria per developer.
- Dependency: T001

T010 — Service: SavedSearch service + notification skeleton
- Path: `backend/src/services/savedSearchService.js`
- Action: Implement create/list/delete functions used by endpoints. Add placeholder notification job worker or queue interface (no external infra required in MVP).
- Dependency: T009

T011 — Service: Proposals service
- Path: `backend/src/services/proposalsService.js`
- Action: Implement submitProposal and listProposals functions. Enforce status enum and permissions checks.
- Dependency: T008, T007

T012 — Endpoint: GET /developers/:id/dashboard
- Path: `backend/src/api/developers.js` (route file)
- Action: Implement route that composes developer profile, analytics, recent proposals, and saved searches per `contracts/developers.dashboard.contract.md`.
- Dependency: T006, T008, T009, T010, T011

T013 — Endpoint: POST/GET/DELETE /developers/:developerId/saved-searches
- Path: `backend/src/api/savedSearches.js`
- Action: Implement routes wired to `savedSearchService`. Return correct status codes and error handling per contract.
- Dependency: T009, T010

T014 — Endpoint: POST /projects/:projectId/proposals and GET developer proposals
- Path: `backend/src/api/proposals.js`
- Action: Implement routes for proposal submission and listing, using `proposalsService`. Validate payload and handle errors (403, 404, 400).
- Dependency: T011, T007, T006

T015 [P] — Integration: DB & server startup tests (in-memory or test DB)
- Path: `backend/tests/integration/db.test.js`
- Action: Add integration tests that start server with a test DB (sqlite in-memory or test PG) and run important flows: submit proposal → list proposals; create saved search → run match (skeleton).
- Dependency: T006-T014

T016 — Polish: Unit tests for services and model validations
- Path: `backend/tests/unit/*`
- Action: Add unit tests for services (savedSearchService, proposalsService) covering edge cases (duplicate searches, invalid payloads).
- Dependency: T006-T011

T017 — Polish: Docs and quickstart validation
- Path: `specs/004-create-the-developer/quickstart.md`
- Action: Ensure quickstart steps run; update with exact commands and add examples of test output.
- Dependency: T001-T015

T018 — Polish: Observability and error handling
- Path: `backend/src/middleware/errorHandler.js` and logging setup
- Action: Add structured logging and centralized error middleware for consistent responses and traceability.
- Dependency: Core endpoints (T012-T014)

T019 — Finalize: Update spec progress and close plan
- Path: `specs/004-create-the-developer/plan.md`
- Action: Update Progress Tracking, mark Phases 2-4 as ready/complete when tasks are done, produce a short summary of changes.
- Dependency: All prior tasks


Parallel execution examples
- Parallel group A (can run together): T003, T004, T005 (contract tests expansions) — these operate on `specs/.../tests` only.
- Parallel group B: T006, T007, T008, T009 (model creation) — independent model files.
- Parallel group C: T010, T011 (services) can run after their dependent models complete.

Agent commands examples
- Run a single contract test (PowerShell):
```powershell
npx vitest run specs/004-create-the-developer/tests/contracts/developers.dashboard.test.js
```

- Run all contract tests:
```powershell
npx vitest run specs/004-create-the-developer/tests/contracts
```

Notes
- Tests are the source of truth: implement code only after the corresponding test is failing.
- Use `supertest` for API assertions; mock external services (email) for unit tests.

---

Generated on: 2025-09-21
