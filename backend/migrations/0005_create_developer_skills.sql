-- Migration: create developer_skills join table
-- File: backend/migrations/0005_create_developer_skills.sql
BEGIN;

CREATE TABLE IF NOT EXISTS developer_skills (
  developer_profile_id uuid NOT NULL REFERENCES developer_profiles(id) ON DELETE CASCADE,
  skill_id uuid NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (developer_profile_id, skill_id)
);

CREATE INDEX IF NOT EXISTS idx_developer_skills_skill_id ON developer_skills(skill_id);

COMMIT;
-- Create developer_skills join table
CREATE TABLE IF NOT EXISTS developer_skills (
  developer_id uuid NOT NULL REFERENCES developer_profiles(id) ON DELETE CASCADE,
  skill_id uuid NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  PRIMARY KEY (developer_id, skill_id)
);
