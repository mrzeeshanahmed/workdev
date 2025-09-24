-- 0005_create_developer_skills.sql
-- Canonical developer_skills join table linking developer_profiles (uuid) to skills (uuid)
BEGIN;

CREATE TABLE IF NOT EXISTS developer_skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  developer_profile_id uuid NOT NULL,
  skill_id uuid NOT NULL,
  level integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_developer_skill_pair ON developer_skills (developer_profile_id, skill_id);
CREATE INDEX IF NOT EXISTS idx_developer_skills_developer_id ON developer_skills(developer_profile_id);
CREATE INDEX IF NOT EXISTS idx_developer_skills_skill_id ON developer_skills(skill_id);

-- Foreign keys can be added via ALTER TABLE if referenced tables exist at migration time
-- ALTER TABLE developer_skills ADD CONSTRAINT fk_ds_developer_profile FOREIGN KEY (developer_profile_id) REFERENCES developer_profiles(id) ON DELETE CASCADE;
-- ALTER TABLE developer_skills ADD CONSTRAINT fk_ds_skill FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE;

COMMIT;
