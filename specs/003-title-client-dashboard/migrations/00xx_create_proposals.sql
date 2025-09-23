-- 00xx_create_proposals.sql
CREATE TABLE IF NOT EXISTS proposals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL,
  applicant_id uuid NOT NULL,
  cover_letter text NOT NULL,
  amount numeric,
  hours_estimate integer,
  status text DEFAULT 'submitted',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_proposals_project_id ON proposals(project_id);
