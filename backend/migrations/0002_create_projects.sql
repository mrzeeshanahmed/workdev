-- 0002_create_projects.sql
-- Create projects table, indexes, and seed sample project
BEGIN;

CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'fixed',
  budget_min INTEGER,
  budget_max INTEGER,
  status TEXT NOT NULL DEFAULT 'draft',
  search_vector tsvector,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ensure extension for gen_random_uuid and trigram if not present
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS unaccent;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Function to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to set updated_at
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'projects_updated_at_tr') THEN
    CREATE TRIGGER projects_updated_at_tr
    BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
  END IF;
END$$;

-- Create GIN index on search_vector
CREATE INDEX IF NOT EXISTS projects_search_vector_idx ON projects USING GIN (search_vector);

-- Sample seed project (idempotent by title+owner)
INSERT INTO projects (owner_id, title, description, type, budget_min, budget_max, status, search_vector)
SELECT v.owner_id, v.title, v.description, v.type, v.bmin, v.bmax, v.status, to_tsvector('english', v.title || ' ' || v.description)
FROM (VALUES
  ('00000000-0000-0000-0000-000000000001','Landing page revamp','A modern landing page redesign using Tailwind and React','fixed',2000,5000,'open')
) AS v(owner_id, title, description, type, bmin, bmax, status)
WHERE NOT EXISTS (
  SELECT 1 FROM projects p WHERE p.title = v.title AND p.owner_id = v.owner_id
);

COMMIT;
-- Migration: create projects table
-- File: backend/migrations/0002_create_projects.sql
BEGIN;



-- 0002_create_projects.sql
-- Canonical projects table: UUID primary key and project_type enum
BEGIN;

CREATE TYPE IF NOT EXISTS project_type AS ENUM ('internal','public','private');

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL,
  description text,
  project_type project_type NOT NULL DEFAULT 'public',
  owner_id uuid NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_projects_slug ON projects (lower(slug));

-- If a users table exists, set up FK; deferred if not present at migration time.
-- ALTER TABLE projects ADD CONSTRAINT fk_projects_owner FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL;

COMMIT;
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured, featured_at DESC);

COMMIT;
-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  short_description text,
  description text,
  project_type text,
  budget_min integer,
  budget_max integer,
  budget_currency text DEFAULT 'USD',
  is_public boolean DEFAULT true,
  featured boolean DEFAULT false,
  featured_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
