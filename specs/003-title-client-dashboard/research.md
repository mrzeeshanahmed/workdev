# Research notes — Client Dashboard

Key decisions
- Auth & ownership: Project records must reference auth.users.owner_id and enforce ownership checks at the API/controller layer and via RLS policies when using Supabase/Postgres.
- RLS: Add policy for projects to allow SELECT to project owner and admins, INSERT to authenticated users, and UPDATE/DELETE only to project owner.
- Search: Use Postgres full-text search on title, description, and skills (tsvector + GIN). Add triggers to keep the search_vector up-to-date.
- Rate limiting: Per-user rate limits for creating projects/proposals to prevent spam; for initial implementation use an in-memory limiter in Express dev-server and document production-rate-limit recommendations.

Testing and tools
- Contract tests require a running server reachable at CONTRACT_BASE_URL. We recommend using supertest for contract tests; add it as a devDependency in backend/package.json.
- Integration tests should run with the dev-server started in Vitest globalSetup (already established in repo patterns).

Out of scope / future work
- Attachments and file uploads (Storage). Add as follow-up to integrate Supabase Storage or Cloud provider.
- Advanced matching and recommendations (ML). Future phase.
