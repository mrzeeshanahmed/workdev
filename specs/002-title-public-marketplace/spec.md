```markdown
# Feature Specification: Public marketplace and developer directory

**Feature Branch**: `002-title-public-marketplace`
**Created**: 2025-09-15
**Status**: Draft
**Input**: User description: "Create the public marketplace and discovery features for WorkDev. Include a public project listings page showing project details in a standardized card format with a 'Featured Projects' section. Implement search and filtering by keywords, required skills, budget, and project type. Also create a public developer marketplace: a directory of developer profiles that clients can browse, search, and filter to find talent. Include API contracts, data models, and acceptance criteria."

## Execution Flow (main)
```
1. Parse user description from Input
	 → If empty: ERROR "No feature description provided"
2. Extract key concepts from description
	 → Identify: actors, actions, data, constraints
3. For each unclear aspect:
	 → Mark with [NEEDS CLARIFICATION: specific question]
4. Fill User Scenarios & Testing section
	 → If no clear user flow: ERROR "Cannot determine user scenarios"
5. Generate Functional Requirements
	 → Each requirement must be testable
	 → Mark ambiguous requirements
6. Identify Key Entities (if data involved)
7. Run Review Checklist
	 → If any [NEEDS CLARIFICATION]: WARN "Spec has uncertainties"
	 → If implementation details found: ERROR "Remove tech details"
8. Return: SUCCESS (spec ready for planning)
```

---

## ⚡ Quick Guidelines
- ✅ Focus on WHAT users need and WHY
- ❌ Avoid HOW to implement (no tech stack, APIs, code structure)
- 👥 Written for business stakeholders, not developers

### Section Requirements
- **Mandatory sections**: Must be completed for every feature
- **Optional sections**: Include only when relevant to the feature
- When a section doesn't apply, remove it entirely (don't leave as "N/A")

---

## User Scenarios & Testing

### Primary User Story
Clients want to discover and hire projects and developers on WorkDev. They should be able to browse public project listings and developer profiles, use search and filters to narrow results (keywords, required skills, budget, project type), view standardized project cards and developer cards, and mark or contact candidates for projects. Marketplace managers should be able to feature projects to increase visibility.

### Acceptance Scenarios
1. Given the public marketplace homepage, when a visitor loads the page, then they see a list of recent projects and a distinct "Featured Projects" section at the top.
2. Given a large set of projects, when the visitor applies filters (keyword, skills, budget range, project type), then the listing updates to only include matching projects and the result count is shown.
3. Given a project card, when a visitor clicks it, then they are taken to a project detail page showing full description, skills required, budget, project type, client rating, and apply/contact actions.
4. Given the developer directory page, when a visitor searches for developers by keyword or filters by skills and availability, then matching developer profiles are shown with summarized cards and pagination.
5. Given an authenticated client user, when they view a developer profile, then they can send an inquiry or shortlisting request (contact flow defined elsewhere).
6. Given a project is marked as featured by an admin, when the marketplace page is loaded, then that project appears in the "Featured Projects" section in a deterministic order (e.g., pinned top or ordered by featured_at timestamp).

### Edge Cases
- Empty results: Display an empty state with suggested popular searches, categories, or a CTA to post a project.
- Large result sets: Support pagination or cursor-based infinite scroll; show counts and active filters.
- Conflicting filters: If a filter combination yields zero results, show a helpful message and offer to relax filters.
- Unpublished/private projects: Ensure only public projects are listed; private or draft projects are excluded.
- Rate limiting / abuse: Expose an abstraction for throttling frequent search requests (left to implementation).

## Requirements

### Functional Requirements
- FR-001: The system MUST provide a public project listings page that shows projects as standardized cards containing: title, short description (excerpt), required skills (tags), budget or budget range, project type (fixed/hourly), client name or anonymized handle, and a CTA to view details.
- FR-002: The project listings page MUST include a distinct "Featured Projects" section at the top of the page that displays a curated subset of projects marked as featured by marketplace managers.
- FR-003: The system MUST support searching projects by free-text keywords that match project title, description, and listed skills.
- FR-004: The system MUST allow filtering projects by required skills (multi-select), budget (min/max or predefined ranges), and project type (e.g., fixed-price, hourly, ongoing).
- FR-005: The system MUST show the total number of matching projects and display applied filters clearly.
- FR-006: The system MUST provide a project detail page for each project with full information and contact/apply options (actual contact flow is out of scope for this feature and should be referenced as a separate integration requirement).
- FR-007: The system MUST provide a public developer marketplace directory page that lists developer profiles as cards including: display name, headline, primary skills, hourly rate or availability indicator, location (optional), and profile summary.
- FR-008: The developer directory MUST support searching by keyword and filtering by skills, availability, minimum hourly rate, and other profile attributes as needed.
- FR-009: The developer profile card MUST link to a developer detail page showing full profile, portfolio links, ratings, and contact actions.
- FR-010: The system MUST provide server-side pagination or cursor-based pagination for both projects and developer directories to handle large datasets.
- FR-011: Featured projects MUST be orderable (e.g., `featured_at` timestamp or explicit featured rank) and must appear above regular listings.
- FR-012: The system MUST ensure only projects marked as `is_public = true` are visible in the public marketplace.
- FR-013: The search and filter endpoints MUST accept parameters for keywords, skill IDs/names, budget_min, budget_max, project_type, page/cursor, and page_size; they MUST return matching items and metadata (total_count, next_cursor if cursor-based).
- FR-014: The API MUST rate-limit unauthenticated search queries to a reasonable threshold to prevent abuse (exact limits to be defined in implementation).
- FR-015: The system MUST record analytics events for search/filter usage and featured project impressions (event schema to be defined separately).

Ambiguities / Decisions made
- FR-016: Search behavior — Decision: Use a simple keyword search matching project titles, descriptions, and listed skills (substring/ILIKE). We will not implement fuzzy search or advanced text ranking in this version.
- FR-017: Skill taxonomy — Decision: Use a predefined, curated list of skills (controlled taxonomy). Developers select skills from this list; user-generated custom skills are not allowed in this release.
- FR-018: Budget and currency UX — Decision: All budgets are specified in USD. Projects can be either fixed-price (budget_min == budget_max) or hourly (hourly_rate_min/hourly_rate_max). No multi-currency support in v1.
- FR-019: Developer profile visibility — Decision: Developer profiles are public by default to maximize discoverability. Privacy controls and restricted visibility can be considered in a later iteration.

### Key Entities
- Project
	- id: UUID
	- title: string
	- short_description: string
	- description: text
	- required_skills: array<skill_id>
	- budget_min: integer
	- budget_max: integer
	- budget_currency: string
	- project_type: enum {fixed, hourly, ongoing}
	- client_id: UUID
	- is_public: boolean
	- featured: boolean
	- featured_at: timestamp (nullable)
	- created_at, updated_at: timestamps

- DeveloperProfile
	- id: UUID
	- user_id: UUID (references auth users)
	- display_name: string
	- headline: string
	- summary: text
	- primary_skills: array<skill_id>
	- hourly_rate_min: integer (nullable)
	- hourly_rate_max: integer (nullable)
	- availability: enum {immediately, within_2_weeks, not_available}
	- location: string (optional)
	- portfolio_links: array<url>
	- rating: numeric (aggregated)
	- created_at, updated_at: timestamps

- Skill
	- id: UUID
	- name: string
	- slug: string

## API Contracts (high level)
- GET /api/public/projects
	- Query params: q, skills[], budget_min, budget_max, project_type, page_size, page/cursor, sort
	- Response: { items: ProjectCard[], total_count, next_cursor }

- GET /api/public/projects/:id
	- Response: Project detail

- GET /api/public/developers
	- Query params: q, skills[], availability, rate_min, rate_max, page_size, page/cursor
	- Response: { items: DeveloperCard[], total_count, next_cursor }

- GET /api/public/developers/:id
	- Response: Developer detail

Notes: Contract examples should include request/response shapes and error conditions during planning.

## Review & Acceptance Checklist

### Content Quality
- [ ] No implementation details (languages, frameworks, APIs) — (focused on WHAT not HOW)
- [ ] Focused on user value and business needs
- [ ] Written for non-technical stakeholders
- [x] All mandatory sections completed

### Requirement Completeness
- [x] No [NEEDS CLARIFICATION] markers remain
- [ ] Requirements are testable and unambiguous
- [ ] Success criteria are measurable
- [ ] Scope is clearly bounded
- [ ] Dependencies and assumptions identified

## Execution Status

- [x] User description parsed
- [x] Key concepts extracted
- [x] Ambiguities marked
- [x] User scenarios defined
- [x] Requirements generated
- [x] Entities identified
- [ ] Review checklist passed

---

### Implementation notes for planning (developer-facing, optional)
- Suggested features during implementation planning (do not lock these into the spec):
	- Use full-text search (Postgres tsvector) or external search (Elasticsearch/Algolia) depending on scale — see FR-016.
	- Store skills in a normalized `skills` table and expose skill ids to the API for reliable filtering.
	- Provide a `featured_projects` admin UI to manage featured flags and ordering.
	- Expose per-page and cursor-based pagination endpoints and return `total_count` for non-cursor views.

### Hand-off / Next steps
1. Resolve clarification items FR-016..FR-019 with stakeholders (search behavior, skill taxonomy, budget/currency UX, public profile visibility).
2. Produce detailed API contracts (OpenAPI) for the listed endpoints with request/response schemas and example payloads.
3. Create DB migrations for `projects`, `developer_profiles`, `skills`, and indexing for search (tsvector, GIN indices).
4. Wire RLS for `projects` to enforce `is_public` for public listing and ensure private data is protected for developer profiles.
5. Implement frontend prototypes for: marketplace homepage (with Featured Projects), project listing and detail pages, developer directory and profile pages, and a simple filters UI.

---

``` 
