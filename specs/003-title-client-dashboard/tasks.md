# Tasks: Client Dashboard

Feature dir: E:\workdev\specs\003-title-client-dashboard

Input: plan.md, data-model.md, contracts/openapi.yaml, research.md, quickstart.md

Follow TDD: write failing tests first (contract/integration/unit) then implement code to make them pass.

Format: [ID] [P?] Description — absolute file paths included

Phase A — Setup
[ ] T001 Setup backend dependencies and dev tools
	- Install runtime deps and devDeps for backend.
	- Files/locations: E:\workdev\backend\package.json (create if missing)
	- Commands (pwsh):
	  ```pwsh
	  cd E:\workdev\backend
	  npm install
	  npm install --save-dev supertest eslint
	  ```
	- Notes: supertest is required by contract tests per research.md

[ ] T002 [P] Add linting and repo-level conventions for new code
	- Files: E:\workdev\.eslintrc.cjs (edit if needed), E:\workdev\backend\.eslintrc.cjs (create)
	- Purpose: keep new backend code consistent with project style

Phase B — Tests First (TDD) — write failing tests BEFORE implementation
CRITICAL: these tests should fail initially

[P] T003 Contract test: POST /api/projects
	- File: E:\workdev\specs\003-title-client-dashboard\tests\contract\post_project.contract.test.ts
	- Behavior: expect 201 and Project shape when posting valid payload
	- Already added skeleton; ensure CONTRACT_BASE_URL usage and skipping when unset

[P] T004 Contract test: GET /api/projects (filters + pagination)
	- File: E:\workdev\specs\003-title-client-dashboard\tests\contract\get_projects.contract.test.ts
	- Behavior: hit /api/projects?q=&skills=&status= and validate 200 + { total, items }

[P] T005 Contract test: GET /api/projects/{projectId}
	- File: E:\workdev\specs\003-title-client-dashboard\tests\contract\get_project_by_id.contract.test.ts
	- Behavior: expect 200 + Project schema

[P] T006 Contract test: POST /api/projects/{projectId}/proposals
	- File: E:\workdev\specs\003-title-client-dashboard\tests\contract\post_proposal.contract.test.ts
	- Behavior: expect 201 + Proposal schema

[P] T007 Integration smoke test: happy-path create project -> submit proposal -> accept
	- File: E:\workdev\specs\003-title-client-dashboard\tests\integration\happy_path.integration.test.ts
	- Requires: dev server running (CONTRACT_BASE_URL) and DB sample-data fallback

Phase C — Core (models & services)
Note: model tasks are independent → mark [P]

[P] T008 Create Project model
	- File: E:\workdev\backend\src\models\project.js
	- Implement: shape exactly as data-model.md (id, owner_id, title, description, type, budget_min, budget_max, skills, status, created_at, updated_at)

[P] T009 Create Proposal model
	- File: E:\workdev\backend\src\models\proposal.js
	- Implement fields per data-model.md

[P] T010 Create Skill model (and optional project_skills)
	- Files: E:\workdev\backend\src\models\skill.js, E:\workdev\backend\src\models\projectSkills.js (optional)

Phase D — Endpoints (controllers) — implement AFTER relevant tests exist
Note: endpoints that live in same controller file must be implemented sequentially (no [P])

[ ] T011 Implement Projects controller (sequential)
	- File: E:\workdev\backend\src\controllers\projectsController.js
	- Endpoints to implement (in this file):
	  - POST /api/projects -> create project (201)
	  - GET /api/projects -> list projects (200 { total, items }) with q, skills, status, page
	  - GET /api/projects/:projectId -> project detail (200)
	- Tests covered: T003, T004, T005

[ ] T012 Implement Proposals controller
	- File: E:\workdev\backend\src\controllers\proposalsController.js
	- Endpoint: POST /api/projects/:projectId/proposals -> create proposal (201)
	- Tests covered: T006

Phase E — Integration & infra

[ ] T013 Create DB migrations
	- Files (create under E:\workdev\backend\migrations):
	  - E:\workdev\backend\migrations\0001_create_skills.sql
	  - E:\workdev\backend\migrations\0002_create_projects.sql
	  - E:\workdev\backend\migrations\0003_create_proposals.sql
	  - E:\workdev\backend\migrations\0004_create_project_skills.sql (optional)
	  - E:\workdev\backend\migrations\0005_triggers_search_vector.sql
	- Acceptance: create indices (GIN on search_vector), FK constraints, updated_at trigger

[ ] T014 Wire DB connection and sample-data fallback
	- File: E:\workdev\backend\src\db.js
	- Implement Pool (pg) connection; if no DB, return sample-data used by controllers

[ ] T015 Add rate-limiter middleware for dev-server
	- File: E:\workdev\backend\src\middleware\rateLimit.js
	- Use in server: E:\workdev\backend\src\server.js

[ ] T016 Start dev-server and ensure contract tests fail then pass
	- File: E:\workdev\backend\src\server.js
	- Command (pwsh):
	  ```pwsh
	  cd E:\workdev\backend
	  NODE_ENV=development node src/server.js
	  # or using nodemon
	  npx nodemon --watch src --exec "node src/server.js"
	  ```

Phase F — Frontend skeleton & tests

[P] T017 Frontend: Post Project Wizard unit tests (validation first)
	- Test file: E:\workdev\frontend\src\pages\projects\__tests__\PostProjectWizard.test.tsx
	- Component file: E:\workdev\frontend\src\pages\projects\PostProjectWizard.tsx
	- Write tests for required fields, budget constraints, skills selection

[P] T018 Frontend: Proposal Review component tests
	- Test file: E:\workdev\frontend\src\pages\projects\__tests__\ProposalReview.test.tsx
	- Component file: E:\workdev\frontend\src\pages\projects\ProposalReview.tsx

Phase G — Integration tests and CI

[ ] T019 Add integration test harness to start/stop dev-server in Vitest globalSetup
	- File: E:\workdev\specs\test-helpers\devServerSetup.js or reuse existing helper
	- Ensure CONTRACT_BASE_URL is exported to tests

[ ] T020 Integration test: end-to-end happy-path (implements T007)
	- File: E:\workdev\specs\003-title-client-dashboard\tests\integration\happy_path.integration.test.ts
	- Steps: create project -> ensure appears in GET /api/projects -> submit proposal -> client accepts -> assert status changes

[ ] T021 Update CI: add job to run this feature's contract + integration tests
	- File: E:\workdev\.github\workflows\ci.yml
	- Notes: start/stop dev-server in job, set CONTRACT_BASE_URL, inject secrets if needed

Phase H — Polish

[P] T022 Unit tests for backend validation and services
	- Files: E:\workdev\backend\tests\unit\* (create as needed)

[P] T023 Accessibility and ESLint fixes for frontend/backed new files
	- Files: E:\workdev\frontend\src\pages\projects\*, E:\workdev\backend\src\*

[P] T024 Docs: update specs/003-title-client-dashboard/README.md with run & test instructions
	- File: E:\workdev\specs\003-title-client-dashboard\quickstart.md (update) and README.md

Dependency notes (short)
- T001,T002 must run before any backend code is added. T003-T007 (tests) must exist and fail before T011/T012 implementations (TDD). Models (T008-T010) should be created before controllers (T011-T012). Migrations (T013) and DB wiring (T014) must be completed before integration tests (T019-T020).

Parallel execution guidance
- Independent model creation tasks (T008, T009, T010) can run in parallel.
- Contract tests (T003-T006) can be written in parallel (different files) but must run together as a group.
- Frontend tests (T017, T018) are parallelizable.

Parallel example (run these concurrently):
  - Create Project model (T008)
  - Create Proposal model (T009)
  - Add contract test: POST /api/projects (T003)
  - Add contract test: GET /api/projects (T004)

Agent task commands (examples)
- Install backend deps (run from repository root):
  ```pwsh
  cd E:\workdev\backend
  npm install
  npm install --save-dev supertest eslint
  ```
- Run contract tests for this feature (ensure dev-server running):
  ```pwsh
  $env:CONTRACT_BASE_URL = 'http://localhost:3000'
  npx vitest run "specs/003-title-client-dashboard/tests/contract/**/*.test.ts"
  ```
- Run integration tests (with dev-server lifecycle helper):
  ```pwsh
  npx vitest run "specs/003-title-client-dashboard/tests/integration/**/*.test.ts" --run
  ```

Validation checklist (before marking Done)
- [ ] All contract files under E:\workdev\specs\003-title-client-dashboard\contracts have corresponding tests (T003-T006)
- [ ] All entities in data-model.md have model tasks (T008-T010)
- [ ] Tests written and failing before controller implementation
- [ ] Integration happy-path test passes against local dev-server

If you want, I can now:
 - Create the four contract test skeletons (T003-T006) and add them under tests/contract (they'll be skipped when CONTRACT_BASE_URL is unset). OR
 - Start implementing the minimal backend controllers that return sample data so the existing POST contract test passes locally.

