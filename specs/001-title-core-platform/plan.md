````markdown
# Implementation Plan: Core platform and user management system for WorkDev

**Branch**: `001-title-core-platform` | **Date**: 2025-09-13 | **Spec**: `E:\workdev\specs\001-title-core-platform\spec.md`
**Input**: Feature specification from `E:\workdev\specs\001-title-core-platform\spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from context (web=frontend+backend)
   → Set Structure Decision based on project type (frontend + Supabase backend)
3. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
4. Execute Phase 0 → research.md
5. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file
6. Re-evaluate Constitution Check section
7. Plan Phase 2 → Describe task generation approach
8. STOP - Ready for /tasks command
```

## Summary
Build a React + TypeScript frontend (Vite) using Tailwind + Shadcn UI, Zustand for global state, TanStack Query for server state, and Supabase for backend (Auth, Postgres, Storage, Realtime, Edge Functions). Emphasize TDD: generate failing contract tests first for auth, profiles, messaging, and reviews.

## Technical Context
**Frontend**: React, TypeScript, Vite, Tailwind CSS, Shadcn UI, React Router, Zustand, TanStack Query, Vitest
**Backend**: Supabase (Postgres, Auth, Realtime, Storage, Edge Functions)
**Data client**: supabase-js
**Real-time**: Supabase Realtime subscriptions
**Edge functions**: Deno + TypeScript (Supabase Edge Functions)
**Testing**: Vitest (frontend), contract tests (supertest/Playwright or similar) for API contracts
**Project Type**: Web application (frontend + hosted Supabase)

## Constitution Check
- Library-first approach applies to frontend features under `src/features/` and shared UI under `src/components/ui`.
- TDD: Contract tests must be created before implementations.

## Phase 0: Research (generated)
See `E:\workdev\specs\001-title-core-platform\research.md` for decisions and alternatives on key choices: Supabase features, 2FA approach, messaging architecture, and storage policies.

## Phase 1: Design & Contracts (generated)
- `E:\workdev\specs\001-title-core-platform\data-model.md` (DB table definitions for Supabase)
- `E:\workdev\specs\001-title-core-platform\contracts/openapi.yaml` (initial API contract snippets)
- `E:\workdev\specs\001-title-core-platform\quickstart.md` (mini quickstart to run frontend locally and connect to a dev Supabase)

## Phase 2: Tasks (overview)
- Tasks will be generated from contracts and the data model. Order follows TDD: contract tests → models → services → UI.

## Progress Tracking
- [x] Phase 0: Research complete
- [x] Phase 1: Design complete
- [ ] Phase 2: Task planning complete (tasks.md drafted)

---

## Constitution Notes
- Ensure RLS on tables with PII and profile-sensitive fields.

````
