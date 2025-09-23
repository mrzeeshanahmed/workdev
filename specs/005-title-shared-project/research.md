````markdown
# Research: Shared project workspace - WorkDev

## Unknowns and recommendations

1. Role reassignment behavior
- Decision: Recommend that when a developer is removed, open milestones remain assigned to the project but are marked "Unassigned" and locked for client-only actions; client can reassign or archive. This preserves audit trails.
  - Rationale: Preserves historical approvals and prevents accidental loss of work.
  - Alternatives: Immediately archive or transfer ownership — rejected for auditability concerns.

2. File upload constraints
- Decision: Default max upload size 50MB per file; allow common document/image types and zip. Enforce server-side MIME type checking and optional virus scanning via an external scanning service.
  - Rationale: Balances usability and storage costs for typical milestone attachments.
  - Alternatives: Larger sizes or client-side compression.

3. Export format
- Decision: Provide export as JSON snapshot plus a ZIP bundle of attachments; supply a generated PDF summary as optional.
  - Rationale: JSON+ZIP is machine-friendly; PDF is user-friendly.

4. Concurrency
- Decision: Use optimistic locking (entity version) for milestone edits and present conflict UI if submit fails due to version mismatch.
  - Rationale: Simpler than distributed locks; user-visible resolution possible.

5. Notifications
- Decision: Provide in-app notifications and email fallback; expose optional webhook for advanced integrations.
  - Rationale: Aligns with common delivery patterns; minimal infra required.

## Short Rationale and next steps
- With these choices, proceed to design data models and API contracts for Milestones, Messages, Files, and Workspace metadata.

````
