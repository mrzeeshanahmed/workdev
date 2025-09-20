-- 0004_create_project_skills.sql
-- Create join table project_skills and seed associations
BEGIN;

CREATE TABLE IF NOT EXISTS project_skills (
  project_id UUID NOT NULL,
  skill_id INTEGER NOT NULL,
  PRIMARY KEY (project_id, skill_id),
  CONSTRAINT fk_ps_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  CONSTRAINT fk_ps_skill FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);

-- Sample association: link sample project to 'react' and 'tailwind' if present
INSERT INTO project_skills (project_id, skill_id)
SELECT p.id, s.id FROM projects p
JOIN skills s ON s.name IN ('react','javascript')
WHERE p.title = 'Landing page revamp'
ON CONFLICT DO NOTHING;

COMMIT;
