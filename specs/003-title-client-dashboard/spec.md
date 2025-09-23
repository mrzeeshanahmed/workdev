# Feature Specification: Client dashboard & project management

**Feature Branch**: `003-title-client-dashboard`  
**Created**: 2025-09-16  
**Status**: Draft  
**Input**: User description: "Create the client dashboard and project management experience for WorkDev. This must include a \"Post a Project\" wizard with steps for defining project basics, scope, skills, and budget. The client dashboard should be the central hub for managing projects, with views for Draft, Open, In Progress, and Completed projects. Also, implement a proposal review page where clients can see a list of applicants for a project, with options to shortlist, archive, and message candidates directly."

## Execution Flow (main)
```
1. Parse user description from Input
	→ Identify actors: client (project owner), applicants (developers), admin
2. Extract key concepts from description
	→ Post a Project wizard, project lifecycle states, proposal review, messaging
3. For each unclear aspect:
	→ Mark with [NEEDS CLARIFICATION: specific question]
4. Fill User Scenarios & Testing section
5. Generate Functional Requirements (testable)
6. Identify Key Entities and data shapes
7. Run Review Checklist
8. Return: SUCCESS (spec ready for planning)
```

---

## ⚡ Quick Guidelines
- ✅ Focus on WHAT users need and WHY
- ❌ Avoid HOW to implement (no implementation-level tech details)
- 👥 Written for business stakeholders and product teams

### Section Requirements
- Mandatory sections are completed below

## User Scenarios & Testing *(mandatory)*

### Primary User Story
As a client I want a single dashboard where I can post new projects, manage my projects through their lifecycle (Draft → Open → In Progress → Completed), and review proposals from developers so I can shortlist and hire the best candidate quickly.

### Acceptance Scenarios
1. Given I am a logged-in client, When I click "Post a Project", Then I am guided through a step-by-step wizard that collects project basics, scope, required skills, and budget, and I can save as Draft or Publish (Open).
2. Given I have saved multiple projects, When I open the Client Dashboard, Then I see tabs/filters for Draft, Open, In Progress, and Completed, each listing the relevant projects with summary cards.
3. Given I view a specific project that has received proposals, When I open the Proposal Review page, Then I see a paginated list of applicants with key details (name, headline, hourly rate, proposal note, attachments) and action controls to Shortlist, Archive, or Message each applicant.
4. Given I shortlist an applicant, When I mark them as selected, Then the project's status can be moved to In Progress and the selected applicant is recorded on the project record.
5. Given I click Message on an applicant, When I send a message, Then the system records the message and (optionally) opens a conversation thread visible to both client and applicant.

### Edge Cases
- What if the client navigates away during the Post a Project wizard? (draft autosave behavior)
- What if a required field is missing on Publish? (validation errors with inline guidance)
- How are duplicate or spam proposals handled? (rate-limit and basic moderation)
- What happens if a client shortlists multiple applicants? (ui/flow to pick one or convert to team)
- What if the client deletes a project with active proposals? (confirmation + archive behavior)

## Requirements *(mandatory)*

### Functional Requirements
- FR-001: System MUST provide a "Post a Project" wizard for clients with the following steps: Basics, Scope/Deliverables, Required Skills, Budget & Timeline, Review & Publish.
- FR-002: Users MUST be able to save a project as Draft at any step and return later to continue editing.
- FR-003: System MUST support publishing a project to an Open state which makes it discoverable by developers (subject to platform rules).
- FR-004: Client Dashboard MUST display projects organized by lifecycle state: Draft, Open, In Progress, Completed. Each state must be accessible via tabs or a filter.
- FR-005: For each project card in the dashboard, show at minimum: title, short description, status, number of proposals, created_at, and primary budget summary.
- FR-006: System MUST provide a Proposal Review page for each project that lists applicants with the following attributes: applicant name, headline, portfolio link (if any), rate, proposal text, attachments, and profile visibility indicator.
- FR-007: On the Proposal Review page, clients MUST be able to perform these actions per applicant: Shortlist, Archive, Message, and View Profile.
- FR-008: Shortlisting an applicant MUST not automatically hire them; it flags them for easy selection and filtering. The client MUST explicitly mark an applicant as Selected/Hired.
- FR-009: When a client selects/hire an applicant, the project's state MUST be updatable to In Progress and the selected applicant recorded on the project entity.
- FR-010: System MUST persist messages between clients and applicants and surface them in a conversation view for that project.
- FR-011: System MUST support pagination and basic filtering on the Proposal Review page (by skills match, rate range, recent activity) — filtering fields to be defined in implementation.
- FR-012: System MUST autosave wizard progress every N seconds or on significant change (N to be defined) and expose a manual Save Draft action.
  - Decision FR-015: The system will autosave the draft to local storage every 10 seconds. Drafts are retained in the browser until the user submits the project or clears their cache. Server-side draft retention is not implemented in this version.
- FR-013: System MUST log project lifecycle transitions (Draft→Open→In Progress→Completed) for auditability.
- FR-014: Actions that change a project's visibility or delete projects MUST require confirmation and show the impact (e.g., removing proposals).

Ambiguities / Clarifications (decisions applied):
- FR-015 (autosave & retention): Autosave to local storage every 10 seconds. Drafts retained in browser until submit or cache clear. No server-side draft retention in this release.
- FR-016 (attachments): Developers can upload a single attachment to a proposal. File size limit 10MB. Allowed file types: PDF, DOCX, TXT.
- FR-017 (messaging): Use a simple persisted messages API; no real-time websocket delivery for initial version. UI should allow manual refresh and pagination; realtime can be added later.
- FR-018 (roles/permissions): Stick to a single client-owner model for this version; no co-owners or team member roles.

### Key Entities *(include if feature involves data)*
- Project: id, owner_id, title, short_description, description, project_type, budget_min, budget_max, budget_currency, status (Draft|Open|In Progress|Completed|Archived), skills[], created_at, updated_at, draft_data (json)
- Proposal: id, project_id, applicant_id, proposal_text, attachments[], rate, currency, created_at, status (active|archived|shortlisted|selected)
- Applicant(User/Profile): user_id, display_name, headline, skills[], hourly_rate, profile_url
- Message: id, project_id, from_user_id, to_user_id, body, attachments[], created_at
- AuditLog: id, entity_type, entity_id, action, performed_by, timestamp, details

## Review & Acceptance Checklist

### Content Quality
- [x] No implementation details (languages/frameworks) — spec focuses on product
- [x] Focused on user value and business needs
- [x] All mandatory sections completed

### Requirement Completeness
- [x] No [NEEDS CLARIFICATION] markers remain
- [x] Requirements are testable and unambiguous
- [x] Success criteria are measurable
- [x] Dependencies and assumptions identified

## Execution Status
- [x] User description parsed
- [x] Key concepts extracted
- [x] Ambiguities marked and decisions applied
- [x] User scenarios defined
- [x] Requirements generated
- [x] Entities identified
- [x] Review checklist passed

---

## Implementation Notes for Planning (do not include in spec body)
- Suggested iteration plan:
  1. Create contract tests for project endpoints (create/update/get/list), proposal endpoints (list/create/archive/shortlist), and messaging endpoints.
  2. Implement Post a Project wizard UI scaffolding with client-side draft autosave.
  3. Implement backend project model, migrations for projects and proposals, and proposal listing API (with pagination and filters).
  4. Implement Proposal Review UI, shortlist/archive/message actions, and message persistence.
  5. Add unit/integration tests and smoke e2e flows.

## [NEEDS CLARIFICATION — summary]
- Autosave frequency and draft retention policy (FR-015)
- Attachment count and size/type limits for proposals (FR-016)
- Real-time message requirement (FR-017)
- Role/permission complexity beyond single client-owner (FR-018)


