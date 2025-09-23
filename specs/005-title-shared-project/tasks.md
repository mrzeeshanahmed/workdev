````markdown
# Tasks: Shared project workspace - WorkDev

**Input**: Design documents from `E:\workdev\specs\005-title-shared-project\`  
**Prerequisites**: `plan.md` (required), `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

## Execution Flow
Follow TDD: write failing contract & integration tests, then implement models/services/endpoints, then frontend, then polish.

Format: `[ID] [P?] Description` — include exact file paths for edits and tests.

---

## Phase 3.1: Setup
- T001 Initialize feature branch and local workspace (already done by feature script)
  - Path/notes: branch `005-title-shared-project` (already checked out)

- T002 [P] Ensure repository dev dependencies are installed and linting configured
  - Action: Run `npm ci` (or repo standard install). Verify `vitest` available and ESLint configuration present.
  - Files: repo root (package.json, vitest.config.ts)

- T003 [P] Add a `backend/src/lib/workspace` folder and `frontend/src/lib/workspace` component folder placeholders
  - Files to create:
    - `backend/src/lib/workspace/README.md` (module purpose)
    - `frontend/src/lib/workspace/README.md`

---

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE IMPLEMENTATION
CRITICAL: These tests MUST fail before implementation.

- T004 [P] Create contract test for `POST /api/workspaces/{workspaceId}/milestones`
  - Test file: `E:\workdev\specs\005-title-shared-project\contracts\tests\milestones.contract.test.ts`
  - Action: Implement test that sends a POST shape matching `contracts/milestones.contract.yml` and asserts 201 + response shape. (Test should fail currently.)
  - Notes: Use Vitest and the repo's test setup.

- T005 [P] Create integration test for primary quickstart scenario (create workspace, create milestone, submit, approve)
  - Test file: `E:\workdev\specs\005-title-shared-project\tests\integration\milestones.integration.test.ts`
  - Action: Write test steps from `quickstart.md` as an integration test that will initially fail (no implementation yet).

- T006 [P] Create unit tests for Milestone state machine transitions
  - Test file: `E:\workdev\specs\005-title-shared-project\tests\unit\milestone.state.test.ts`
  - Action: Define expected allowed transitions from `data-model.md` and assert invalid transitions are rejected (test must fail initially).

---

## Phase 3.3: Core Implementation (after tests are failing)
Implement in order: models -> migrations -> services -> endpoints -> frontend wiring.

- T007 [P] Add DB migrations for workspace and milestones
  - Files:
    - `backend/migrations/xxxx_create_workspaces.sql`
    - `backend/migrations/xxxx_create_milestones.sql`
  - Action: Create SQL schema matching `data-model.md` (UUID PKs, state enum, version integer) and add to repo migrations folder. Ensure they run with existing migration tooling.

- T008 [P] Implement Milestone model and ORM mapping
  - Files:
    - `backend/src/models/milestone.ts` (or .js depending on repo conventions)
  - Action: Model fields per `data-model.md` (milestoneId, projectWorkspaceId, title, description, dueDate, amount, state, attachments, createdBy, createdAt, updatedAt, version)

- T009 [P] Implement ProjectWorkspace and File models
  - Files:
    - `backend/src/models/projectWorkspace.ts`
    - `backend/src/models/file.ts`

- T010 [P] Implement Milestone service with state transition methods and audit logging
  - Files:
    - `backend/src/services/milestoneService.ts`
  - Actions: Methods: createDraft, submitMilestone, approveMilestone, requestRevision, archiveMilestone. Each method records history entries (actor, action, timestamp) and increments `version` on updates.

- T011 [P] Implement API routes/handlers for Milestones
  - Files:
    - `backend/src/api/workspaces/[workspaceId]/milestones/routes.ts` (or add to existing router)
  - Endpoints required (based on contracts and spec):
    - POST `/api/workspaces/:workspaceId/milestones` — create milestone (201)
    - GET `/api/workspaces/:workspaceId/milestones` — list
    - GET `/api/workspaces/:workspaceId/milestones/:milestoneId` — retrieve
    - POST `/api/workspaces/:workspaceId/milestones/:milestoneId/submit` — submit
    - POST `/api/workspaces/:workspaceId/milestones/:milestoneId/approve` — approve
    - POST `/api/workspaces/:workspaceId/milestones/:milestoneId/request-revision` — request revision
  - Notes: Start with POST create to satisfy contract test T004.

---

## Phase 3.4: Integration

- T012 Connect services to DB and run migrations locally
  - Files: runtime config e.g., `backend/.env.example` updates or migration scripts
  - Action: Run migrations and ensure models persist and queries return expected shapes.

- T013 Implement file upload flow and storage integration
  - Files:
    - `backend/src/services/fileService.ts`
    - `backend/src/api/files/routes.ts`
  - Action: Accept multipart uploads; store metadata in `file` table and physical files in configured storage. Enforce 50MB per-file limit.

- T014 Implement notification hooks (in-app + email fallback)
  - Files:
    - `backend/src/services/notificationService.ts`
    - `frontend/src/lib/notifications/*` (in-app UI placeholder)
  - Action: Emit events on milestone submission/approval/revision. Implement simple email sending using existing infra or stub email for now.

- T015 Implement Messages tab backend endpoints and frontend component
  - Files:
    - `backend/src/api/workspaces/[workspaceId]/messages/*`
    - `frontend/src/pages/workspace/components/Messages.tsx`
  - Action: Threaded messages with attachments and read/unread markers.

---

## Phase 3.5: Frontend Milestones UI

- T016 [P] Create Workspace page with tabs (Milestones, Messages, Files, Details)
  - Files:
    - `frontend/src/pages/workspace/[projectId]/index.tsx` (or similar)
    - `frontend/src/components/workspace/Tabs.tsx`

- T017 Implement Milestones tab UI and flows (create, edit, submit, view audit trail, approve/request revision)
  - Files:
    - `frontend/src/components/workspace/Milestones/*.tsx`
  - Action: UI should reflect states from backend and allow attachments to be added when submitting.

---

## Phase 3.6: Validation & Polish

- T018 [P] Unit tests for services and utilities
  - Files: `E:\workdev\specs\005-title-shared-project\tests\unit\` and `backend/src/**/__tests__`

- T019 [P] End-to-end integration test: quickstart scenario
  - Test file: `E:\workdev\specs\005-title-shared-project\tests\e2e\milestones.e2e.test.ts`
  - Action: Ensure full flow (create workspace → create milestone → submit → approve) passes.

- T020 [P] Documentation: Update `specs/005-title-shared-project/README.md` with setup and quickstart steps

---

## Dependencies & Ordering (high level)
- Setup (T002/T003) before Tests (T004-T006)
- Tests (T004-T006) must be in place and failing before Core Implementation (T007-T011)
- Models/migrations (T007-T009) before services (T010) and endpoints (T011)
- Integration (T012-T015) after endpoints exist
- Frontend (T016-T017) after backend endpoints for features are available
- Polish & validation (T018-T020) last

## Parallel groups examples
- Group 1 (can run in parallel): T004, T005, T006 (tests)  
- Group 2 (can run in parallel): T007, T008, T009 (migrations/models)  
- Group 3 (can run in parallel): T010, T011 (services + endpoints) — coordinate if touching same files

## Agent commands (examples)
- Run contract tests (parallel group):
  - `npx vitest run E:\workdev\specs\005-title-shared-project\contracts\tests\milestones.contract.test.ts`
- Run integration tests:
  - `npx vitest run E:\workdev\specs\005-title-shared-project\tests\integration\milestones.integration.test.ts`

---

## Validation checklist (ensure before marking done)
- [ ] All contract files have a corresponding failing contract test
- [ ] Each entity from `data-model.md` has a model creation task
- [ ] Integration scenarios from `quickstart.md` are captured as tests
- [ ] Tasks specify exact file paths
- [ ] Parallel tasks truly independent

````
