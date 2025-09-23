-- 003_proposals.sql
CREATE TABLE IF NOT EXISTS proposals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  developer_profile_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  cover_letter text,
  proposed_rate numeric,
  status text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RLS policy examples (commented):
-- ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "proposal_insert_participant" ON proposals FOR INSERT WITH CHECK (auth.uid() = developer_profile_id);
-- CREATE POLICY "proposal_select_participant" ON proposals FOR SELECT USING (auth.uid() = developer_profile_id OR EXISTS (SELECT 1 FROM projects p WHERE p.id = project_id AND p.client_id = auth.uid()));
