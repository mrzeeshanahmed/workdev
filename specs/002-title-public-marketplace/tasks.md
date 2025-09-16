# Tasks: Public marketplace and developer directory

**Input**: Design documents from `/specs/002-title-public-marketplace/`
**Prereqs**: `plan.md`, `research.md`, `data-model.md`, `contracts/openapi.yaml`

## Execution Flow
TDD-first ordering. Contract and integration tests must be created and fail before implementation tasks.

## Phase 3.1: Setup
- [ ] T001 Install backend & frontend skeletons and common dev tooling
  - Create folders: `backend/`, `frontend/` if they do not exist
  - Add package manifests (example: `backend/package.json`, `frontend/package.json`) and lint configs
  - Files to create/check: `backend/package.json`, `frontend/package.json`, `.eslintrc.cjs`
  - Reason: required for running tests/builds

- [ ] T002 [P] Add DB migration tooling and test database setup
  - Add migration scaffold (e.g., `backend/migrations/README.md`), and a local test DB connection string placeholder in `.env.example`
  - Files: `backend/migrations/`, `backend/.env.example`
\
- [ ] T003 [P] Configure test runners & CI hooks
  - Ensure backend tests use Vitest/Jest and frontend already has Vitest configured; add scripts in `backend/package.json` and `frontend/package.json`
  - Files: `backend/vitest.config.ts` (or `jest.config.js`), `backend/package.json`

## Phase 3.2: Tests First (TDD) — Contract & Integration (MUST FAIL first)
Note: Each contract endpoint in `contracts/openapi.yaml` → create a contract test file under `specs/002-title-public-marketplace/tests/contract/` and mark [P] (can be written in parallel).

- [ ] T004 [P] Contract test GET /api/public/projects
  - Create: `specs/002-title-public-marketplace/tests/contract/test_public_projects_list.contract.test.ts`
  - Assert: 200 response, JSON shape matches `ProjectCard[]` + `total_count` + `next_cursor`

- [ ] T005 [P] Contract test GET /api/public/projects/{id}
  - Create: `specs/002-title-public-marketplace/tests/contract/test_public_project_detail.contract.test.ts`
  - Assert: 200 response, JSON shape matches `ProjectDetail`

- [ ] T006 [P] Contract test GET /api/public/developers
  - Create: `specs/002-title-public-marketplace/tests/contract/test_public_developers_list.contract.test.ts`
  - Assert: 200 response, JSON shape matches `DeveloperCard[]` + `total_count` + `next_cursor`

- [ ] T007 [P] Contract test GET /api/public/developers/{id}
  - Create: `specs/002-title-public-marketplace/tests/contract/test_public_developer_detail.contract.test.ts`
  - Assert: 200 response, JSON shape matches `DeveloperDetail`

Integration tests derived from acceptance scenarios (create under `specs/002-title-public-marketplace/tests/integration/` and mark [P] where independent):

- [ ] T008 [P] Integration test: marketplace homepage shows Featured Projects and recent projects
  - Create: `specs/002-title-public-marketplace/tests/integration/test_marketplace_home.integration.test.ts`
  - Scenario: featured projects appear in top section, regular projects listed below

- [ ] T009 [P] Integration test: filtering projects updates results and result count
  - Create: `specs/002-title-public-marketplace/tests/integration/test_project_filters.integration.test.ts`
  - Scenario: apply skills, budget range, project_type filters → only matching projects returned

- [ ] T010 [P] Integration test: project detail page returns full info
  - Create: `specs/002-title-public-marketplace/tests/integration/test_project_detail.integration.test.ts`

- [ ] T011 [P] Integration test: developer directory search & filters
  - Create: `specs/002-title-public-marketplace/tests/integration/test_developer_directory.integration.test.ts`

- [ ] T012 Integration test: authenticated client can see contact action on developer detail (requires auth stub)
  - Create: `specs/002-title-public-marketplace/tests/integration/test_developer_contact.integration.test.ts`
  - Note: this can use a test harness or mocked auth token

## Phase 3.3: Core Implementation (after tests fail)
Models and migrations (create migrations under `backend/migrations/` and model files under `backend/src/models/`)

- [ ] T013 [P] Create DB migration for `skills` table
  - File: `backend/migrations/0001_create_skills.sql`
  - Ensure unique constraint on `name` and `slug`

- [ ] T014 [P] Create DB migration for `projects`, `project_skills`
  - File: `backend/migrations/0002_create_projects.sql`
  - Include columns: id, title, short_description, description, project_type, budget_min, budget_max, budget_currency (USD), is_public, featured, featured_at, created_at, updated_at
  - File: `backend/migrations/0003_create_project_skills.sql`

- [ ] T015 [P] Create DB migration for `developer_profiles`, `developer_skills`
  - File: `backend/migrations/0004_create_developer_profiles.sql`
  - File: `backend/migrations/0005_create_developer_skills.sql`

- [ ] T016 Create search-related indexes and basic tsvector columns
  - File: `backend/migrations/0006_create_search_indices.sql`
  - Create GIN indexes for title/description tsvector or trigram indexes for ILIKE

- [ ] T017 [P] Implement backend models and ORM mapping
  - Files: `backend/src/models/project.ts`, `backend/src/models/skill.ts`, `backend/src/models/developerProfile.ts`
  - Map join tables for project_skills and developer_skills

Services & endpoints

- [ ] T018 Implement GET /api/public/projects endpoint (returns ProjectCard list)
  - File: `backend/src/controllers/publicProjectsController.ts`
  - Accepts: q, skills[], budget_min, budget_max, project_type, page_size, page/cursor
  - Returns: items, total_count, next_cursor

- [ ] T019 Implement GET /api/public/projects/:id endpoint (ProjectDetail)
  - File: `backend/src/controllers/publicProjectDetailController.ts`

- [ ] T020 Implement GET /api/public/developers endpoint (DeveloperCard list)
  - File: `backend/src/controllers/publicDevelopersController.ts`

- [ ] T021 Implement GET /api/public/developers/:id endpoint (DeveloperDetail)
  - File: `backend/src/controllers/publicDeveloperDetailController.ts`

- [ ] T022 Implement basic rate-limiting middleware for unauthenticated search queries
  - File: `backend/src/middleware/rateLimit.ts`
  - Note: implement simple in-memory limiter for v1; document for production replacement

- [ ] T023 Implement analytics event emission for search/filter usage and featured project impressions
  - File: `backend/src/services/analyticsService.ts`
  - Emit events on endpoints

## Phase 3.4: Frontend Implementation (after backend endpoints exist)
Frontend components under `frontend/src/components/marketplace/` and pages under `frontend/src/pages/`

- [ ] T024 [P] Implement ProjectCard component and FeaturedProjects section
  - Files: `frontend/src/components/marketplace/ProjectCard.tsx`, `frontend/src/components/marketplace/FeaturedProjects.tsx`

- [ ] T025 [P] Implement Project listing page with filters and search
  - File: `frontend/src/pages/marketplace/ProjectsPage.tsx`
  - Use API: `/api/public/projects`

- [ ] T026 [P] Implement DeveloperCard and Developer directory page
  - Files: `frontend/src/components/marketplace/DeveloperCard.tsx`, `frontend/src/pages/marketplace/DevelopersPage.tsx`

## Phase 3.5: Integration & Polish

- [ ] T027 [P] Unit tests for models and services (`backend/tests/unit/*`)
- [ ] T028 [P] End-to-end smoke test for marketplace flows (`specs/002-title-public-marketplace/tests/e2e/*`)
- [ ] T029 [P] Add admin UI for managing Featured Projects (minimal): `frontend/src/pages/admin/FeaturedProjectsAdmin.tsx`
- [ ] T030 Update docs, quickstart, and add migration instructions (`specs/002-title-public-marketplace/README.md`)

## Dependencies & ordering notes
- Setup tasks (T001-T003) must run before tests and implementation.
- Contract tests (T004-T007) and integration tests (T008-T012) must be created first and fail (TDD) before implementation tasks (T013-T026).
- Model migrations (T013-T016) must be applied before model/ORM code (T017) and endpoints (T018-T021).
- Frontend tasks (T024-T026) depend on backend endpoints (T018-T021) but can be scaffolded in parallel as UI-only work.

## Parallel execution examples
- Run T004, T005, T006, T007 in parallel (contract test files):
  - `specs/002-title-public-marketplace/tests/contract/test_public_projects_list.contract.test.ts`
  - `specs/002-title-public-marketplace/tests/contract/test_public_project_detail.contract.test.ts`
  - `specs/002-title-public-marketplace/tests/contract/test_public_developers_list.contract.test.ts`
  - `specs/002-title-public-marketplace/tests/contract/test_public_developer_detail.contract.test.ts`

- Run model migration tasks in parallel where safe (T013, T014, T015) because they touch different tables.

## Validation checklist (to complete before marking done)
- [ ] All contract tests created and failing
- [ ] All entity model tasks created
- [ ] All endpoints have implementation tasks
- [ ] Quickstart exercises (smoke tests) succeed after implementation
