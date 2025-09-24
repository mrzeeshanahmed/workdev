-- 0001_create_skills.sql
-- Canonical skills table: use UUID primary keys and slug + name uniqueness
BEGIN;

-- Ensure pgcrypto for gen_random_uuid
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- case-insensitive unique constraints via indexes
CREATE UNIQUE INDEX IF NOT EXISTS uq_skills_name ON skills (lower(name));
CREATE UNIQUE INDEX IF NOT EXISTS uq_skills_slug ON skills (lower(slug));

-- Optional lightweight seed (idempotent)
INSERT INTO skills (name, slug)
SELECT v.name, lower(regexp_replace(v.name, '\\s+', '-', 'g')) FROM (VALUES
  ('javascript'),
  ('typescript'),
  ('react'),
  ('nodejs'),
  ('postgres')
) AS v(name)
WHERE NOT EXISTS (
  SELECT 1 FROM skills s WHERE lower(s.name) = lower(v.name)
);

COMMIT;
