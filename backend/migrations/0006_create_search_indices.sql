-- Migration: create search-related indexes and tsvector columns
-- File: backend/migrations/0006_create_search_indices.sql
BEGIN;

-- add tsvector column for project search
DO $$ BEGIN
    ALTER TABLE projects ADD COLUMN IF NOT EXISTS search_vector tsvector;
EXCEPTION WHEN undefined_table THEN NULL; END$$;

-- populate search_vector for existing rows
UPDATE projects SET search_vector = to_tsvector('english', coalesce(title,'') || ' ' || coalesce(short_description,'') || ' ' || coalesce(description,'')) WHERE search_vector IS NULL;

CREATE INDEX IF NOT EXISTS idx_projects_search_vector ON projects USING GIN(search_vector);

-- add tsvector for developer profiles
DO $$ BEGIN
    ALTER TABLE developer_profiles ADD COLUMN IF NOT EXISTS search_vector tsvector;
EXCEPTION WHEN undefined_table THEN NULL; END$$;

UPDATE developer_profiles SET search_vector = to_tsvector('english', coalesce(display_name,'') || ' ' || coalesce(headline,'') || ' ' || coalesce(bio,'')) WHERE search_vector IS NULL;

CREATE INDEX IF NOT EXISTS idx_developer_profiles_search_vector ON developer_profiles USING GIN(search_vector);

COMMIT;
-- Add tsvector columns and GIN indexes for full-text search
ALTER TABLE IF EXISTS projects ADD COLUMN IF NOT EXISTS search_vector tsvector;
UPDATE projects SET search_vector = to_tsvector('simple', coalesce(title,'') || ' ' || coalesce(short_description,''));
CREATE INDEX IF NOT EXISTS idx_projects_search_vector ON projects USING GIN(search_vector);

ALTER TABLE IF EXISTS developer_profiles ADD COLUMN IF NOT EXISTS search_vector tsvector;
UPDATE developer_profiles SET search_vector = to_tsvector('simple', coalesce(display_name,'') || ' ' || coalesce(headline,''));
CREATE INDEX IF NOT EXISTS idx_developers_search_vector ON developer_profiles USING GIN(search_vector);

-- Optional trigram indexes for ILIKE performance
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX IF NOT EXISTS idx_projects_title_trgm ON projects USING gin (title gin_trgm_ops);
