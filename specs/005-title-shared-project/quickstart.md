````markdown
# Quickstart: Shared project workspace - WorkDev

This quickstart shows how to validate the contracts and run the minimal test scenario for the Milestones API (TDD-first).

1. Install dependencies (root of repo): follow repository README. The project uses Node.js and Vitest for tests.

2. Run contract tests (these will initially fail):
- From repo root run: `npm test` or the repository's test command; narrow to contracts with your test runner's filtering feature.

3. Implement backend endpoint: create milestone model and route to satisfy first failing contract test.

4. Re-run tests until green.

Minimal acceptance scenario to run locally:
- Create a test ProjectWorkspace with client and developer
- Create a Milestone in Draft
- Submit the Milestone (expect state Submitted and notification)
- Client approves the Milestone (expect state Approved and audit entry)

````
