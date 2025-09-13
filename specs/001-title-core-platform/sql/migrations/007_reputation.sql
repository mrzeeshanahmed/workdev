-- Migration: 007_reputation.sql
-- Create a materialized view that aggregates average review score per profile

CREATE MATERIALIZED VIEW IF NOT EXISTS reputation AS
SELECT
  r.reviewee_id AS profile_id,
  COUNT(*) AS review_count,
  AVG(r.score) AS avg_score,
  MAX(r.created_at) AS last_reviewed_at
FROM reviews r
GROUP BY r.reviewee_id;

-- Index for quick lookup
CREATE UNIQUE INDEX IF NOT EXISTS reputation_profile_id_idx ON reputation (profile_id);

-- Note: Refresh this materialized view via a lightweight job or Edge Function after writes.
