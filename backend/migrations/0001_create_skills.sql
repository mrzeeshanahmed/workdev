-- Migration: create skills table
-- File: backend/migrations/0001_create_skills.sql
BEGIN;

CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- case-insensitive unique constraints via index
CREATE UNIQUE INDEX IF NOT EXISTS uq_skills_name ON skills( lower(name) );
CREATE UNIQUE INDEX IF NOT EXISTS uq_skills_slug ON skills( lower(slug) );

COMMIT;
