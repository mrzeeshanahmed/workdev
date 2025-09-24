-- 0003_create_project_skills.sql
-- Canonical join table between projects and skills (UUID FKs)
BEGIN;

-- Create the join table with UUID FKs and a composite primary key.
CREATE TABLE IF NOT EXISTS project_skills (
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  skill_id uuid NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, skill_id)
);

-- Helpful indexes for lookups (idempotent)
CREATE INDEX IF NOT EXISTS idx_project_skills_project_id ON project_skills(project_id);
CREATE INDEX IF NOT EXISTS idx_project_skills_skill_id ON project_skills(skill_id);

COMMIT;
