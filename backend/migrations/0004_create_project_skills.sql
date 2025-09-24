-- 0004_create_project_skills.sql
-- Optional idempotent seed for project_skills associations.
-- This file intentionally contains only seed statements. The table is created in 0003.
BEGIN;

-- Example: link a sample project to 'react' and 'javascript' skills if they exist.
INSERT INTO project_skills (project_id, skill_id)
SELECT p.id, s.id
FROM projects p
JOIN skills s ON s.name IN ('react','javascript')
WHERE p.title = 'Landing page revamp'
ON CONFLICT DO NOTHING;

COMMIT;
