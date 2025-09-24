-- 0007_triggers.sql
-- This migration previously created trigger functions and triggers for
-- updated_at and search_vector maintenance. The canonical unified
-- migration is `0006_create_search_indices.sql`. Keep this file as a
-- guarded no-op to avoid duplicate definitions if older deploys run it.

BEGIN;

RAISE NOTICE '0007 is a safe no-op; canonical search triggers/indexes are in 0006_create_search_indices.sql';

COMMIT;
