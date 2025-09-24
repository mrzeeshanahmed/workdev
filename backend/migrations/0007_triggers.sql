-- Migration: triggers to maintain updated_at and search_vector
-- File: backend/migrations/0007_triggers.sql
BEGIN;

-- Unified trigger functions and triggers for updated_at and search_vector maintenance

-- Ensure pg_trgm exists for optional trigram indexes
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 1) updated_at trigger function (single shared function)
CREATE OR REPLACE FUNCTION trg_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2) shared search_vector updater that accepts table-specific concatenation
-- We create per-table wrapper functions that call to_tsvector with 'english'

-- projects search vector updater
CREATE OR REPLACE FUNCTION trg_update_projects_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := to_tsvector('english', coalesce(NEW.title,'') || ' ' || coalesce(NEW.short_description,'') || ' ' || coalesce(NEW.description,''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- developer_profiles search vector updater
CREATE OR REPLACE FUNCTION trg_update_developer_profiles_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := to_tsvector('english', coalesce(NEW.display_name,'') || ' ' || coalesce(NEW.headline,'') || ' ' || coalesce(NEW.bio,''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Ensure triggers exist (idempotent creation using pg_trigger check)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'projects') THEN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_projects_set_updated_at') THEN
      CREATE TRIGGER trg_projects_set_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_projects_search_vector') THEN
      CREATE TRIGGER trg_projects_search_vector BEFORE INSERT OR UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION trg_update_projects_search_vector();
    END IF;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'developer_profiles') THEN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_devprofiles_set_updated_at') THEN
      CREATE TRIGGER trg_devprofiles_set_updated_at BEFORE UPDATE ON developer_profiles FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_devprofiles_search_vector') THEN
      CREATE TRIGGER trg_devprofiles_search_vector BEFORE INSERT OR UPDATE ON developer_profiles FOR EACH ROW EXECUTE FUNCTION trg_update_developer_profiles_search_vector();
    END IF;
  END IF;
END$$;

COMMIT;
