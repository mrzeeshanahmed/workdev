# Research: Public marketplace and developer directory

## Decisions and rationale

- Decision: Simple keyword search (substring/ILIKE) for v1
  - Rationale: Keeps implementation simple, uses built-in Postgres capabilities (ILIKE) or basic tsvector without complex relevance ranking. Faster to implement and lower operational cost compared to full-text engines like Elasticsearch or Algolia.
  - Alternatives considered: Algolia/Elastic — better ranking and fuzzy search but requires additional infra and cost.

- Decision: Predefined curated skills taxonomy
  - Rationale: Ensures consistent filtering, avoids synonyms/duplicate skills. Simplifies analytics and aggregation.
  - Alternatives considered: Allow user-generated skills with moderation — more flexible but messy for filtering and analytics.

- Decision: USD-only budgets and support for fixed/hourly
  - Rationale: Reduces complexity in initial release, avoids currency conversion and localization concerns.
  - Alternatives considered: Multi-currency support — deferred to future work.

- Decision: Developer profiles public by default
  - Rationale: Maximizes discoverability for developers and reduces friction for clients searching for talent.
  - Alternatives considered: Private-by-default with opt-in public listing — adds friction and reduces marketplace liquidity.

## Implementation considerations
- Use Postgres indexes (GIN/GIN on tsvector or btree indexes for numeric filters) for performance.
- Expose search parameters via an API that supports pagination and total count.
- Normalize skills into a `skills` table and store relationships in join tables for efficient querying.

## Research output
- Decisions recorded in `spec.md`.
- Next: Phase 1 artifacts generated (data model, contracts, quickstart) and ready for task generation.
