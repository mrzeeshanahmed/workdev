-- 0011_migrate_legacy_ids.sql
-- Migration guide: safely migrate legacy integer primary keys to UUIDs
-- NOTE: This file provides an idempotent, data-preserving pattern but SHOULD be reviewed
-- and adapted to your production data and constraints before running.

BEGIN;

-- 1) Ensure pgcrypto is available for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Example pattern for migrating an integer PK table (e.g., old_skills with id serial)
--  a) Add a new uuid column
--  b) Backfill UUIDs for existing rows
--  c) Update referencing FK columns in dependent tables to new UUIDs (requires temporary mapping table)
--  d) Swap columns (rename) and drop old integer columns

-- WARNING: The following is a template and not a drop-in replacement. Test on a copy of the DB.

-- Example: migrate skills.id (int) -> skills.id (uuid)
-- 1) add uuid column
ALTER TABLE IF EXISTS skills ADD COLUMN IF NOT EXISTS _new_id uuid;

-- 2) populate new UUIDs for existing rows
UPDATE skills SET _new_id = gen_random_uuid() WHERE _new_id IS NULL;

-- 3) create mapping table to map old integer id -> new uuid
CREATE TABLE IF NOT EXISTS skills_id_map (old_id bigint PRIMARY KEY, new_id uuid NOT NULL);
INSERT INTO skills_id_map (old_id, new_id)
SELECT id::bigint, _new_id FROM skills WHERE id IS NOT NULL
ON CONFLICT (old_id) DO NOTHING;

-- 4) For each dependent table, add a temporary uuid FK column and populate it using the map
-- Example for project_skills.project_id:
-- ALTER TABLE project_skills ADD COLUMN IF NOT EXISTS _new_project_id uuid;
-- UPDATE project_skills SET _new_project_id = m.new_id FROM skills_id_map m WHERE project_skills.project_id::bigint = m.old_id;

-- 5) Once all dependent tables are updated, swap columns:
-- DROP CONSTRAINTS referencing the old int PKs, rename columns, recreate FKs.

-- 6) Finally, set the new uuid as primary key and drop old int column
-- ALTER TABLE skills DROP CONSTRAINT IF EXISTS skills_pkey;
-- ALTER TABLE skills DROP COLUMN IF EXISTS id;
-- ALTER TABLE skills RENAME COLUMN _new_id TO id;
-- ALTER TABLE skills ADD PRIMARY KEY (id);

-- 7) Cleanup mapping tables and temporary columns when satisfied.

COMMIT;

-- IMPORTANT: This migration is a template. For production deployments, create tailored migration scripts
-- for each table, run on staging first, and ensure backups and downtime/window planning.
