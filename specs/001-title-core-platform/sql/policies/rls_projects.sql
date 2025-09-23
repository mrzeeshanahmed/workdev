-- rls_projects.sql
-- Row Level Security for `projects` table
-- Usage: apply after running projects migration.

ALTER TABLE IF EXISTS projects ENABLE ROW LEVEL SECURITY;

-- Allow public read of project listings (adjust as needed)
CREATE POLICY IF NOT EXISTS projects_select_public
  ON projects FOR SELECT
  USING (true);

-- Allow project owner (client_id) to INSERT/UPDATE their projects
CREATE POLICY IF NOT EXISTS projects_insert_owner
  ON projects FOR INSERT
  WITH CHECK (auth.uid() = client_id);

CREATE POLICY IF NOT EXISTS projects_update_owner
  ON projects FOR UPDATE
  USING (auth.uid() = client_id)
  WITH CHECK (auth.uid() = client_id);

-- Allow owner to delete their project
CREATE POLICY IF NOT EXISTS projects_delete_owner
  ON projects FOR DELETE
  USING (auth.uid() = client_id);
