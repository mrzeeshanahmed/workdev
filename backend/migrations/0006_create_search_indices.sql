-- Migration: create search-related indexes and tsvector columns
-- File: backend/migrations/0006_create_search_indices.sql
BEGIN;

-- Unified full-text search setup: add tsvector columns, populate them, and create GIN indexes

-- Ensure required extensions exist (pg_trgm is optional but helpful for ILIKE/trigram indexes)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Add tsvector columns if they don't exist
ALTER TABLE IF EXISTS projects ADD COLUMN IF NOT EXISTS search_vector tsvector;
ALTER TABLE IF EXISTS developer_profiles ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Populate search_vector for existing rows (only where NULL)
UPDATE projects
SET search_vector = to_tsvector('english', coalesce(title,'') || ' ' || coalesce(short_description,'') || ' ' || coalesce(description,''))
WHERE search_vector IS NULL;

UPDATE developer_profiles
SET search_vector = to_tsvector('english', coalesce(display_name,'') || ' ' || coalesce(headline,'') || ' ' || coalesce(bio,''))
WHERE search_vector IS NULL;

-- Create one GIN index per table on the search_vector column
CREATE INDEX IF NOT EXISTS idx_projects_search_vector ON projects USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_developer_profiles_search_vector ON developer_profiles USING GIN(search_vector);

COMMIT;
