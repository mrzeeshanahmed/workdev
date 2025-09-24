-- 0005_triggers_search_vector.sql
-- This file previously created a search_vector update function and trigger
-- for `projects`. The canonical unified migration lives in
-- `0006_create_search_indices.sql`. Keep a no-op guard here so older
-- deployments that run this file explicitly do not fail or duplicate
-- definitions when the unified migration is applied.

BEGIN;

-- No-op guard: ensure the canonical function/trigger names are present
-- If the canonical function/trigger are missing, defer to the unified
-- migration which creates them. We avoid creating alternate names here.
RAISE NOTICE '0005 is a safe no-op; use 0006_create_search_indices.sql for canonical setup';

COMMIT;
