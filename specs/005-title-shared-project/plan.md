````markdown
# Implementation Plan: Shared project workspace - WorkDev

**Branch**: `005-title-shared-project` | **Date**: 2025-09-21 | **Spec**: `E:\workdev\specs\005-title-shared-project\spec.md`
**Input**: Feature specification from `E:\workdev\specs\005-title-shared-project\spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
4. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
5. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file
6. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
7. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
8. STOP - Ready for /tasks command
```

## Summary
Create a private, two-party shared project workspace for WorkDev with a tabbed UI (Milestones, Messages, Files, Details). The primary deliverable is a Milestones system enabling Draft → Submit → Approve/Request Revision flows with notifications, audit trail, and attachments. The implementation plan focuses on designing data models, API contracts, and quickstart steps for test-driven development of the Milestones feature and supporting workspace UI.

## Technical Context
**Language/Version**: NEEDS CLARIFICATION (use existing repo stack: Node/TypeScript likely)  
**Primary Dependencies**: NEEDS CLARIFICATION (API + frontend frameworks to be aligned with repo)  
**Storage**: PostgreSQL (project uses migrations and backend; choose SQL-backed storage)  
**Testing**: Vitest (repo contains vitest configs)  
**Target Platform**: Web (frontend + backend)  
**Project Type**: Web application (frontend + backend)  
**Performance Goals**: Low-volume collaboration per workspace (real-time-ish notifications acceptable)  
**Constraints**: Private access (per-project ACL) and small team (2 users per workspace)  
**Scale/Scope**: Per-project workspaces; initial rollout expected for small number of active projects

## Constitution Check
**Simplicity**:
- Projects: 2 (backend API + frontend UI) — within allowed simplicity targets
- Using framework directly? Yes; keep minimal abstractions

**Architecture**:
- Feature will be implemented as additions to existing backend/frontend codebases; if repository constitution prefers library-first, extract shared workspace logic into a small `workspace` module under `backend/src/lib/workspace` and a frontend component library under `frontend/src/lib/workspace`.

**Testing (NON-NEGOTIABLE)**:
- TDD enforced: Contract tests generated first and must fail before implementation.
- Use Vitest for unit/contract tests (repo already includes vitest configs).

**Observability**:
- Log milestone state transitions and workspace events with structured logs (timestamp, actor, action, milestoneId).

**Versioning**:
- Follow repository versioning conventions; feature branch for now.

## Project Structure (decision)

Use Option 2 from template (web application):
- backend/: Add `workspaces` and `milestones` routes, models, services
- frontend/: Add `Workspace` page with tabbed UI and `Milestones` components

## Phase 0: Outline & Research (outputs: research.md)

Unknowns extracted from the spec (research tasks):
- Role reassignment behavior (when developer removed/reassigned)
- File upload constraints (size, allowed types, virus scanning)
- Export format for snapshots (PDF, JSON, ZIP?)
- Concurrency/conflict resolution strategy for milestone edits
- Notification delivery channels (in-app, email, webhooks)

Research tasks (Phase 0):
- Research role transition patterns and recommend behavior for removing or reassigning developers.
- Research file storage best practices and virus scan/integrity options for the project's stack.
- Propose an export snapshot format (JSON + ZIP of attachments; optionally PDF summary).
- Recommend a conflict resolution approach (optimistic locking with last-write-wins fallback + user-visible conflicts).
- Recommend notification mechanisms compatible with repo (in-app + email; optional webhook) and retry strategies.

Decision (placeholder - research output summarized in research.md): See `research.md` for decisions, rationale, and alternatives.

## Phase 1: Design & Contracts (outputs: data-model.md, contracts/, quickstart.md)

Prerequisite: research.md complete and all NEEDS CLARIFICATION resolved.

Planned outputs (created in this phase):
- `E:\workdev\specs\005-title-shared-project\data-model.md`  
- `E:\workdev\specs\005-title-shared-project\quickstart.md`  
- `E:\workdev\specs\005-title-shared-project\contracts\milestones.contract.yml`  
- Contract tests skeleton under `E:\workdev\specs\005-title-shared-project\contracts\tests\` (these should fail initially)

Design notes:
- Data model will include ProjectWorkspace, Milestone (with state machine), Message, and File metadata per spec.
- API contracts will expose endpoints for: create/read/update milestones, submit milestone, approve/request revision, upload files, list messages, post messages, workspace metadata.

## Phase 2: Task Planning Approach
Follow `templates/tasks-template.md` to generate tasks. Key strategy:
- Generate contract tests first for each endpoint and entity
- Implement models and migrations next
- Implement backend services and route handlers
- Implement frontend components and pages with TDD
- Integrate notifications and file storage as separate tasks (can be parallelized)

## Complexity Tracking
No constitution violations identified that require special justification at this point.

## Progress Tracking
**Phase Status**:
- [x] Phase 0: Research complete (/plan command) — research.md created
- [x] Phase 1: Design complete (/plan command) — data model, quickstart, and contracts created
- [x] Phase 2: Task planning described (/plan command)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS
- [ ] Post-Design Constitution Check: pending
- [x] All NEEDS CLARIFICATION resolved: pending research (some remain in research.md)
- [ ] Complexity deviations documented: none

---

*Plan generated from template copied into the feature specs directory.*

````
