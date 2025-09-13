# Tasks: Core platform and user management system (WorkDev)

Feature: Core platform and user management system
Branch: 001-title-core-platform

NOTE: This tasks list is TDD-first. Tasks marked [P] can be run in parallel where noted. Each task is explicit and includes the target file path to create or edit so an LLM agent can execute it directly.

---

T001 — Setup: Repo & Dev environment
- Title: Initialize frontend dev workspace and test runner
- Files/paths:
  - frontend/package.json (create/update)
  - frontend/vite.config.ts (ensure exists)
  - .github/workflows/ci.yml (add simple test job) [optional]
- Action:
  1. Create a minimal `package.json` with scripts: dev, build, test (Vitest).
  2. Add Vitest + React Testing Library + pnpm/pnpm-lock or npm lockfile to the manifest.
  3. Ensure `frontend` folder exists and `vite.config.ts` present. If project uses a different layout, adapt paths in following tasks.
- Why: Ensures consistent environment for running contract & unit tests.
- Depends on: none

T002 — Setup: Supabase local/test configuration
- Title: Add sample `.env.example` and supabase cli config
- Files/paths:
  - specs/001-title-core-platform/.env.example (create)
  - specs/001-title-core-platform/sql/seed.sql (create)
  - specs/001-title-core-platform/sql/schema.sql (create)
- Action:
  1. Create `.env.example` listing VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY placeholders.
  2. Create `sql/schema.sql` containing CREATE TABLE statements for `profiles`, `projects`, `proposals`, `reviews`, `messages`, and `attachments` (use the columns listed in `data-model.md`).
  3. Create `sql/seed.sql` with minimal seed rows for admin/profile/dev accounts used by tests.
- Depends on: T001

T003 [P] — Contract tests: API contracts -> failing tests
- Title: Generate failing contract tests from `contracts/openapi.yaml`
- Files/paths:
  - specs/001-title-core-platform/tests/contracts/auth.contract.test.ts
  - specs/001-title-core-platform/tests/contracts/profiles.contract.test.ts
  - specs/001-title-core-platform/tests/contracts/messages.contract.test.ts
  - specs/001-title-core-platform/tests/contracts/reviews.contract.test.ts
- Action:
  1. For each group in `contracts/openapi.yaml` create a test file that imports the OpenAPI spec and asserts the following endpoints return expected status codes when unauthenticated/authenticated as needed (these tests should intentionally fail until server/edge functions are implemented):
     - Auth: POST /auth/signup -> 201, POST /auth/signin -> 200
     - Profiles: GET /profiles/:id -> 200 (public fields), PUT /profiles/:id -> 200 (owner)
     - Messages: POST /messages -> 201, GET /conversations/:id/messages -> 200
     - Reviews: POST /projects/:id/reviews -> 201
  2. Use a test runner that supports HTTP assertions (e.g., supertest or Playwright) and mark tests as [P] so they can run in parallel where they touch different files.
- Depends on: T001, T002

T004 [P] — Data models: create DB migration files (one per table)
- Title: Implement SQL migrations for each entity in `data-model.md`
- Files/paths:
  - specs/001-title-core-platform/sql/migrations/001_profiles.sql
  - specs/001-title-core-platform/sql/migrations/002_projects.sql
  - specs/001-title-core-platform/sql/migrations/003_proposals.sql
  - specs/001-title-core-platform/sql/migrations/004_reviews.sql
  - specs/001-title-core-platform/sql/migrations/005_messages.sql
  - specs/001-title-core-platform/sql/migrations/006_attachments.sql
- Action:
  1. For each migration file, add CREATE TABLE statements matching `data-model.md` including indexes and basic RLS policy comments.
  2. Ensure timestamps and foreign key constraints reference `profiles(id)` where appropriate and `auth.users` for identity linkage.
  3. These migration files should be runnable via the Supabase CLI or psql in CI.
- Depends on: T002

T005 — RLS & Policies: add policy SQL files
- Title: Create RLS policies and helper functions
- Files/paths:
  - specs/001-title-core-platform/sql/policies/rls_profiles.sql
  - specs/001-title-core-platform/sql/policies/rls_messages.sql
  - specs/001-title-core-platform/sql/policies/rls_projects.sql
- Action:
  1. Implement example policies (ALLOW SELECT public fields TO public, ALLOW UPDATE WHEN auth.uid() = profiles.id, etc.) as SQL `CREATE POLICY` statements.
  2. Add comments describing intent and example admin-role checks.
- Depends on: T004

T006 — Service layer: Supabase client wrappers (failing unit tests)
- Title: Scaffold server/service wrappers for DB interactions and auth helpers
- Files/paths:
  - frontend/src/lib/supabaseClient.ts (create)
  - frontend/src/services/profiles.service.ts (create)
  - frontend/src/services/messages.service.ts (create)
  - frontend/src/services/projects.service.ts (create)
  - frontend/src/services/reviews.service.ts (create)
  - specs/001-title-core-platform/tests/unit/profiles.service.test.ts
- Action:
  1. Create a typed `supabaseClient.ts` that reads env vars and exports a configured Supabase client instance.
  2. Scaffold service functions for CRUD operations with minimal signatures (e.g., getProfile(id), updateProfile(id, data)).
  3. Write unit tests that call these services against a mocked supabase client or the local Supabase (these tests should fail until migrations/policies exist).
- Depends on: T001, T002, T004

T007 — Implement Edge Functions / API adapters (failing integration tests)
- Title: Add Supabase Edge Functions or API adapters per contract endpoints
- Files/paths:
  - functions/auth/signup/index.ts
  - functions/auth/signin/index.ts
  - functions/profiles/[id].ts
  - functions/messages/create.ts
  - functions/reviews/create.ts
  - specs/001-title-core-platform/tests/integration/auth.integration.test.ts
- Action:
  1. Create minimal Edge Functions that proxy to Supabase client operations and return JSON responses per the OpenAPI contract.
  2. Create integration tests that invoke the deployed function endpoints (or local runner) and assert contract behaviors.
  3. These tests are expected to fail until services and DB migrations are applied.
- Depends on: T003, T004, T006

T008 — Messaging: Real-time subscriptions & optimistic UI
- Title: Implement frontend subscription hooks and optimistic updates for messages
- Files/paths:
  - frontend/src/features/messages/useMessages.ts
  - frontend/src/features/messages/components/MessageList.tsx
  - specs/001-title-core-platform/tests/integration/messages.integration.test.ts
- Action:
  1. Create a `useMessages` hook that subscribes to `messages` table changes via supabase-realtime and exposes sendMessage() with optimistic update.
  2. Implement a `MessageList` minimal component that uses `useMessages` and displays messages.
  3. Integration test should simulate sending a message and assert optimistic UI shows the message before server ack.
- Depends on: T006, T007

T009 — Profiles: onboarding flows & vetting badge workflow
- Title: Build onboarding screens and vetting admin path
- Files/paths:
  - frontend/src/features/onboarding/OnboardingForm.tsx
  - frontend/src/features/profile/ProfilePage.tsx
  - frontend/src/features/admin/VettingQueue.tsx
- Action:
  1. Implement an Onboarding form that creates a `profiles` row after signup and links to `auth.users` id.
  2. Implement `ProfilePage` that displays public profile fields and `is_vetted` status.
  3. Implement `VettingQueue` admin UI listing candidates and toggling `is_vetted` (this UI should call an Edge Function or service method that enforces admin auth).
- Depends on: T006, T007

T010 — Reviews & Reputation: implement reviews and reputation aggregation
- Title: Add review creation and reputation calculation job
- Files/paths:
  - frontend/src/features/reviews/ReviewForm.tsx
  - frontend/src/services/reviews.service.ts
  - specs/001-title-core-platform/sql/migrations/007_reputation.sql
  - specs/001-title-core-platform/tests/integration/reviews.integration.test.ts
- Action:
  1. Implement ReviewForm to POST reviews per the contract.
  2. Add a DB migration for a `reputation` materialized view or table that aggregates scores per profile and a lightweight job (Edge Function) to refresh it.
  3. Integration test: submit a review and assert reputation changes for the reviewee.
- Depends on: T004, T007

T011 — Security: 2FA, backup codes, and account recovery
- Title: Integrate TOTP 2FA flows and recovery codes
- Files/paths:
  - frontend/src/features/auth/TwoFactorSetup.tsx
  - functions/auth/2fa/setup.ts
  - functions/auth/2fa/verify.ts
  - specs/001-title-core-platform/tests/integration/2fa.integration.test.ts
- Action:
  1. Implement TOTP setup (generate secret, QR) and verification endpoints using Supabase MFA or custom TOTP library in Edge Functions.
  2. Provide backup code generation and a one-time UI to download/store them.
  3. Integration tests to cover setup, verification, and recovery code usage.
- Depends on: T006, T007

T012 — Polish & Tests: unit tests, performance checks, docs
- Title: Fill out unit tests, linting, docs, and CI
- Files/paths:
  - frontend/src/**/*.test.tsx
  - .github/workflows/ci.yml
  - specs/001-title-core-platform/README.md
- Action:
  1. Add unit tests for components and services (Vitest). Aim for key happy paths and edge cases.
  2. Add CI job that runs tests and lints.
  3. Document setup steps in `specs/001-title-core-platform/README.md` and update `quickstart.md` if necessary.
- Depends on: All previous tasks

---

Parallel execution examples
- Group A (can run concurrently): T003 (contract tests scaffolding), T004 (migrations), T001 (frontend setup)
- Group B (after Group A): T006 (service wrappers), T005 (RLS policies)

Agent commands (examples)
- Run contract tests (once scaffolds exist):
  ```powershell
  pnpm --filter frontend test --silent
  ```
- Apply migrations via Supabase CLI:
  ```powershell
  supabase db push --file specs/001-title-core-platform/sql/migrations
  ```

Acceptance notes & execution hints
- Keep tests failing initially (TDD). Each test should include a TODO comment linking back to the task ID.
- Use the seed SQL to create deterministic test accounts (admin, dev, client).
- Where policies require admin role, prefer a simple `is_admin` boolean column on `profiles` for early-stage testing; replace with real RBAC later.

---

Generated-by: tasks.prompt.md
````markdown
# Tasks (draft) - 001-title-core-platform

Priority ordering follows TDD: tests first, implementation next.

1. Contract tests: Auth
   - Create failing tests for `/auth/register`, password reset, OAuth flows, and 2FA enforcement.
2. Contract tests: Profiles
   - Failing tests for `GET /profiles/{id}`, `PATCH /profiles/{id}` (owner only), vetting badge flow.
3. Contract tests: Messaging
   - Failing tests for `POST /messages`, unread count, and attachment handling.
4. Contract tests: Reviews
   - Failing tests for `POST /projects/{id}/reviews` and public exposure on profiles.
5. Implement DB schema migrations for Supabase (profiles, projects, proposals, reviews, messages, attachments).
6. Implement Supabase Auth configuration (email, GitHub, Google) and TOTP 2FA enrollment UI.
7. Implement storage buckets and upload flow for avatars and project-files with signed URLs.
8. Implement minimal backend (Edge Functions) for vetting workflow and webhook handlers (GitHub integration).
9. Implement frontend auth flows (email, OAuth) and protected routes.
10. Implement Developer and Client onboarding UIs and profile CRUD flows.
11. Implement messaging UI with realtime subscriptions and attachment uploads.
12. Implement reviews UI and aggregation logic for profile pages.
13. Add monitoring/logging for security events and test audit logs.

Each task should map to one or more PRs and include tests that fail before implementation.

````
