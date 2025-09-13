-- 002_projects.sql
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  -- client_id is a profiles.id; profiles.id is expected to be linked to auth.users(id)
  client_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  title text,
  description text,
  budget numeric,
  currency text,
  status text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RLS policy examples (commented):
-- ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "project_select_public" ON projects FOR SELECT USING (true);
-- CREATE POLICY "project_owner_update" ON projects FOR UPDATE USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.id = client_id));
