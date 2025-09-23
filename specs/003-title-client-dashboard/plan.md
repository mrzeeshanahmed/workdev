## Client Dashboard — Implementation Plan

Goal
- Implement a Client Dashboard and Project Management experience that includes:
  - A "Post a Project" wizard (multi-step: basics → scope → skills → budget → review & publish)
  - A dashboard hub with project lists by lifecycle state (Draft, Open, In Progress, Completed)
  - A proposal review page where clients can view applicants, shortlist, archive, and message candidates

Strategy
- TDD-first: create failing contract and unit tests for each backend API and critical frontend component before implementing behavior.
- Incremental rollout: implement minimal backend APIs and frontend UI with sample/fallback data, then wire DB-backed controllers and policies.
- Keep surface area small and well-tested: prioritize data contracts (OpenAPI) and one end-to-end smoke test for the happy path (post project → receive proposals → choose applicant).

Milestones
1) Contracts & Data model (TDD seeds)
  - Create OpenAPI contracts for: POST /api/projects, GET /api/projects (filters + pagination), GET /api/projects/:id, PATCH /api/projects/:id (status transitions), POST /api/projects/:id/proposals, GET /api/projects/:id/proposals
  - Add failing contract tests under specs/003-title-client-dashboard/tests/contract/
  - Draft db changes in data-model.md and minimal SQL migrations

2) Backend: controllers, models, migrations
  - Implement DB migrations: projects, proposals, proposal_messages, project_skills join table
  - Implement model helpers in backend/src/models/
  - Add controllers (Express) with validation and error handling
  - Add sensible defaults and sample-data fallback for local/dev
  - Add RLS/ownership rules notes for when wiring Supabase

3) Frontend: Pages & Components
  - PostProjectWizard component (stepper) with local form state and validation
  - Dashboard page with list filters, status tabs, and project cards
  - ProposalReview page listing applicants with actions (shortlist, archive, message)
  - Wire TanStack Query hooks for project and proposal endpoints

4) Integration & e2e smoke
  - Add integration tests for happy-path: create project, list in dashboard, submit proposal (sample-fallback), client accepts applicant
  - Ensure dev-server serves endpoints and tests run with globalSetup that starts/stops server

5) Polish & CI
  - Accessibility checks and ESLint fixes
  - Add unit tests for critical helpers and validation logic
  - Update CI workflow to include contract/integration tests for this feature

Files to create / edit (primary)
- specs/003-title-client-dashboard/
  - plan.md (this file)
  - data-model.md (DB schema + migrations plan)
  - research.md (security, RLS, rate limits, quota)
  - quickstart.md, tasks.md
  - contracts/openapi.yaml (project and proposal endpoints)
  - tests/contract/*.contract.test.ts
  - tests/integration/*.integration.test.ts
- backend/
  - src/controllers/projectsController.js
  - src/controllers/proposalsController.js
  - src/models/project.js, proposal.js, skill.js
  - migrations/00xx_create_projects.sql, 00xx_create_proposals.sql, 00xx_project_skills.sql
  - unit tests for controllers/models
- frontend/
  - src/pages/dashboard/ClientDashboard.tsx
  - src/pages/projects/PostProjectWizard.tsx
  - src/pages/projects/ProposalReview.tsx
  - src/components/projects/ProjectCard.tsx
  - src/hooks/useProjects.ts, useProposals.ts
  - tests for the PostProjectWizard and ProposalReview

TDD checkpoints
- Write failing contract tests for POST /api/projects and GET /api/projects
- Implement lightweight controller that returns sample data to make tests pass gradually
- Write failing unit tests for PostProjectWizard validation (e.g., missing required skills, budget out of range)
- Implement frontend components until unit tests pass

Acceptance criteria (Done)
- Client can create a project via the Post Project wizard and see it in their dashboard (Draft → Publish → Open)
- Dashboard shows projects grouped by lifecycle with correct counts and pagination
- Clients can view proposals for a project and perform actions: shortlist, archive, and send a message
- Contract tests for project and proposal endpoints pass against the local dev-server
- Basic accessibility and lint rules satisfied for new UI components

Edge cases and decisions
- Auth & ownership: controllers must assert current user owns the project before allowing edits. For local/dev sample data, tests will mock auth.
- Large attachments/uploads: out of scope for first iteration; accept attachments as metadata only. Add TODO in research.md for Storage integration.
- Budget ranges: enforce min > 0 and optional max; support hourly vs fixed (enum)

Next steps (immediate)
1. Commit this plan.md to the feature branch
2. Create specs/003-title-client-dashboard/data-model.md and start drafting migrations
3. Add contract stubs under specs/003-title-client-dashboard/contracts/openapi.yaml and failing contract tests
