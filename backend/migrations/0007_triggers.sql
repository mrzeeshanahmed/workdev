-- Migration: triggers to maintain updated_at and search_vector
-- File: backend/migrations/0007_triggers.sql
BEGIN;

-- ensure pg_trgm for better ILIKE performance (optional)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- function to update updated_at timestamp
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- function to update project search_vector
CREATE OR REPLACE FUNCTION update_project_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := to_tsvector('english', coalesce(NEW.title,'') || ' ' || coalesce(NEW.short_description,'') || ' ' || coalesce(NEW.description,''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- function to update developer profile search_vector
CREATE OR REPLACE FUNCTION update_developer_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := to_tsvector('english', coalesce(NEW.display_name,'') || ' ' || coalesce(NEW.headline,'') || ' ' || coalesce(NEW.bio,''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach triggers
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'projects') THEN
    CREATE TRIGGER trg_projects_set_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION set_updated_at();
    CREATE TRIGGER trg_projects_search_vector BEFORE INSERT OR UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_project_search_vector();
  END IF;
  IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'developer_profiles') THEN
    CREATE TRIGGER trg_devprofiles_set_updated_at BEFORE UPDATE ON developer_profiles FOR EACH ROW EXECUTE FUNCTION set_updated_at();
    CREATE TRIGGER trg_devprofiles_search_vector BEFORE INSERT OR UPDATE ON developer_profiles FOR EACH ROW EXECUTE FUNCTION update_developer_search_vector();
  END IF;
END$$;

COMMIT;
-- Migration: add triggers to maintain updated_at and search_vector
-- File: backend/migrations/0007_triggers.sql
BEGIN;

-- trigger for updated_at
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_timestamp') THEN
    -- Attach to projects and developer_profiles
    CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_timestamp_dev') THEN
    CREATE TRIGGER set_timestamp_dev
    BEFORE UPDATE ON developer_profiles
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp();
  END IF;
END $$;

-- search vector maintenance for projects
CREATE OR REPLACE FUNCTION update_projects_search_vector() RETURNS trigger AS $$
BEGIN
  NEW.search_vector := to_tsvector('english', coalesce(NEW.title,'') || ' ' || coalesce(NEW.short_description,'') || ' ' || coalesce(NEW.description,''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'projects_search_vector') THEN
    CREATE TRIGGER projects_search_vector
    BEFORE INSERT OR UPDATE ON projects
    FOR EACH ROW
    EXECUTE PROCEDURE update_projects_search_vector();
  END IF;
END $$;

-- search vector maintenance for developer_profiles
CREATE OR REPLACE FUNCTION update_devprofiles_search_vector() RETURNS trigger AS $$
BEGIN
  NEW.search_vector := to_tsvector('english', coalesce(NEW.display_name,'') || ' ' || coalesce(NEW.headline,'') || ' ' || coalesce(NEW.bio,''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'devprofiles_search_vector') THEN
    CREATE TRIGGER devprofiles_search_vector
    BEFORE INSERT OR UPDATE ON developer_profiles
    FOR EACH ROW
    EXECUTE PROCEDURE update_devprofiles_search_vector();
  END IF;
END $$;

COMMIT;
