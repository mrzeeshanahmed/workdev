-- 0006_create_search_indices.sql
-- Unified migration: ensure search_vector columns, backfill using english
-- text configuration, create GIN indexes, and install predictable trigger
-- functions/triggers for `projects` and `developer_profiles`.

BEGIN;

-- Ensure helpful extensions exist
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;

-- Add search_vector columns if missing
ALTER TABLE IF EXISTS projects ADD COLUMN IF NOT EXISTS search_vector tsvector;
ALTER TABLE IF EXISTS developer_profiles ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Backfill search_vector for existing rows (only where NULL)
UPDATE projects
SET search_vector = to_tsvector('english', coalesce(title,'') || ' ' || coalesce(short_description,'') || ' ' || coalesce(description,''))
WHERE search_vector IS NULL;

UPDATE developer_profiles
SET search_vector = to_tsvector('english', coalesce(display_name,'') || ' ' || coalesce(headline,'') || ' ' || coalesce(bio,''))
WHERE search_vector IS NULL;

-- Create one canonical GIN index per table (idempotent)
DO $$
BEGIN
	IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'idx_projects_search_vector') THEN
		CREATE INDEX idx_projects_search_vector ON projects USING GIN(search_vector);
	END IF;
	IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'idx_developer_profiles_search_vector') THEN
		CREATE INDEX idx_developer_profiles_search_vector ON developer_profiles USING GIN(search_vector);
	END IF;
END$$;

-- Create/update trigger functions (single canonical name per purpose)
-- 1) updated_at setter
CREATE OR REPLACE FUNCTION trg_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
	NEW.updated_at = now();
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2) per-table search_vector updaters using english config
CREATE OR REPLACE FUNCTION trg_update_projects_search_vector()
RETURNS TRIGGER AS $$
BEGIN
	NEW.search_vector := to_tsvector('english', coalesce(NEW.title,'') || ' ' || coalesce(NEW.short_description,'') || ' ' || coalesce(NEW.description,''));
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION trg_update_developer_profiles_search_vector()
RETURNS TRIGGER AS $$
BEGIN
	NEW.search_vector := to_tsvector('english', coalesce(NEW.display_name,'') || ' ' || coalesce(NEW.headline,'') || ' ' || coalesce(NEW.bio,''));
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Install triggers with consistent names, guarded to avoid duplicates
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
