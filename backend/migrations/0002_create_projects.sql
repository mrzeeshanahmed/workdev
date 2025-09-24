-- 0002_create_projects.sql
-- Canonical, idempotent creation of the `projects` table expected by
-- application controllers. This file focuses on DDL only (no seeds, no
-- trigger creation). Triggers for `updated_at` and `search_vector` are
-- applied in separate migrations to avoid duplication.

BEGIN;

-- Ensure pgcrypto is available for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create enum project_type_t if missing (safe, idempotent)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'project_type_t') THEN
    CREATE TYPE project_type_t AS ENUM ('fixed','hourly','retainer');
  END IF;
END$$;

-- Create canonical projects table if it does not exist.
-- Use CREATE TABLE IF NOT EXISTS so repeated runs are safe in CI.
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  title text NOT NULL,
  short_description text,
  description text,
  project_type project_type_t NOT NULL DEFAULT 'fixed',
  budget_min numeric(12,2),
  budget_max numeric(12,2),
  budget_currency varchar(3) NOT NULL DEFAULT 'USD',
  is_public boolean NOT NULL DEFAULT true,
  featured boolean NOT NULL DEFAULT false,
  featured_at timestamptz,
  -- kept for search wiring; indexing/search-vector population is handled elsewhere
  search_vector tsvector,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Ensure any missing columns (for upgrades from older divergent DDLs) exist.
-- This keeps the migration safe when run against repos with legacy variants.
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS short_description text,
  ADD COLUMN IF NOT EXISTS description text,
  ADD COLUMN IF NOT EXISTS project_type project_type_t NOT NULL DEFAULT 'fixed',
  ADD COLUMN IF NOT EXISTS budget_min numeric(12,2),
  ADD COLUMN IF NOT EXISTS budget_max numeric(12,2),
  ADD COLUMN IF NOT EXISTS budget_currency varchar(3) NOT NULL DEFAULT 'USD',
  ADD COLUMN IF NOT EXISTS is_public boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS featured boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS featured_at timestamptz,
  ADD COLUMN IF NOT EXISTS search_vector tsvector,
  ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

-- Idempotent indexes: created_at (for listing/sorting) and featured sorting.
-- Use DO $$ guard in case CREATE INDEX IF NOT EXISTS is not available in the
-- target Postgres version; the guard is safe even if CREATE INDEX IF NOT EXISTS
-- is supported.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'idx_projects_created_at_desc') THEN
    CREATE INDEX idx_projects_created_at_desc ON projects (created_at DESC);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'idx_projects_featured_featured_at') THEN
    CREATE INDEX idx_projects_featured_featured_at ON projects (featured DESC, featured_at DESC);
  END IF;
END$$;

COMMIT;
