# Research: Developer Dashboard & Experience

This research resolves ambiguities from the feature spec and records decisions and alternatives.

## Ambiguities from spec
- Saved search criteria: decision
- Email notification frequency: decision
- Analytics data beyond profile views/proposal success rate: decision
- Proposal statuses and update mechanism: decision
- Duplicate saved searches policy: decision

---

## Decisions & Rationale

### Saved search criteria
Decision: Saved searches will support criteria: keywords (full-text), required skills (array), project_type (fixed/hourly), budget_min, budget_max, remote_or_on_site (enum), and tags. These reflect typical job filters developers expect.
Rationale: Balances relevance and simplicity; covers the primary ways developers search for jobs.
Alternatives considered: allow arbitrary query DSL (too complex for MVP).

### Email notification frequency
Decision: Provide three notification cadence options per saved search: immediate (push on first match), daily digest, weekly digest. Default is daily.
Rationale: Offers flexibility and avoids email spam; immediate useful for high-priority searches.
Alternatives considered: rate-limited immediate notifications (complex throttling).

### Analytics data
Decision: Analytics will include: profile views (total, last 7/30/90 days), proposal submissions (counts), proposal success rate (accepted / submitted), and recent engagement (click-throughs on projects). Additional metrics are optional future work.
Rationale: These metrics directly map to developer outcomes.

### Proposal statuses and update mechanism
Decision: Proposal statuses: submitted, viewed (client opened), shortlisted, interview, offered, accepted, rejected, withdrawn. Status updates will be driven by client actions (API endpoints) and admin tools; developers can also withdraw.
Rationale: Standard lifecycle that supports tracking and analytics.

### Duplicate saved searches
Decision: Prevent exact duplicates (same normalized criteria). Allow similar searches but warn when criteria overlap significantly.
Rationale: Avoids clutter while not blocking legitimate similar searches.

---

## Risks & Mitigations
- Email deliverability: use transactional email provider with retry/backoff and bounce handling.
- Privacy: analytics are private and only shown to the developer; ensure access control.
- Scale: saved search matching may be expensive; implement incremental matching and index searchable fields.

---

## Output
All NEEDS CLARIFICATION items resolved for the plan.
