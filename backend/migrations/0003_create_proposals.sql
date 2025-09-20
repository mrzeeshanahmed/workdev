-- 0003_create_proposals.sql
-- Create proposals table and sample seed data
BEGIN;

CREATE TABLE IF NOT EXISTS proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL,
  proposer_id UUID NOT NULL,
  cover_letter TEXT,
  amount INTEGER,
  status TEXT NOT NULL DEFAULT 'submitted',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT fk_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Trigger for proposals.updated_at
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'proposals_updated_at_tr') THEN
    CREATE TRIGGER proposals_updated_at_tr
    BEFORE UPDATE ON proposals
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
  END IF;
END$$;

-- Sample seed proposal
INSERT INTO proposals (project_id, proposer_id, cover_letter, amount)
SELECT p.id, v.proposer_id, v.cover, v.amount
FROM (VALUES
  ('00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000002','I can deliver this in 2 weeks with high quality','3500')
) AS v(project_ref, proposer_id, cover, amount)
JOIN projects p ON p.owner_id = v.project_ref::uuid OR p.title = 'Landing page revamp'
WHERE NOT EXISTS (
  SELECT 1 FROM proposals r WHERE r.proposer_id = v.proposer_id AND r.amount = v.amount
);

COMMIT;
