-- 0005_triggers_search_vector.sql
-- Create trigger to populate/update search_vector on projects
BEGIN;

-- Helper function to set search_vector from title and description
CREATE OR REPLACE FUNCTION projects_search_vector_update() RETURNS trigger AS $$
BEGIN
  NEW.search_vector := to_tsvector('english', coalesce(NEW.title,'') || ' ' || coalesce(NEW.description,''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'projects_search_vector_tr') THEN
    CREATE TRIGGER projects_search_vector_tr
    BEFORE INSERT OR UPDATE ON projects
    FOR EACH ROW EXECUTE PROCEDURE projects_search_vector_update();
  END IF;
END$$;

COMMIT;
