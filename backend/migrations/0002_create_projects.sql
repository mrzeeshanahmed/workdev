-- Migration: create projects table
-- File: backend/migrations/0002_create_projects.sql
BEGIN;

-- create enum for project_type
DO $$ BEGIN
    CREATE TYPE project_type_t AS ENUM ('fixed', 'hourly', 'retainer');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
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
  owner_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

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
