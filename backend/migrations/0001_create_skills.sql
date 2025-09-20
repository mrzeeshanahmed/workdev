-- 0001_create_skills.sql
-- Create skills table and sample seed data
BEGIN;

CREATE TABLE IF NOT EXISTS skills (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Sample data (idempotent)
INSERT INTO skills (name)
SELECT v.name FROM (VALUES
  ('javascript'),
  ('typescript'),
  ('react'),
  ('nodejs'),
  ('postgres')
) AS v(name)
WHERE NOT EXISTS (
  SELECT 1 FROM skills s WHERE s.name = v.name
);

COMMIT;
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
