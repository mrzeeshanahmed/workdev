-- Migration: 008_refresh_reputation_function.sql
-- Creates a database function to refresh the reputation materialized view safely.

CREATE OR REPLACE FUNCTION refresh_reputation()
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  -- Use CONCURRENTLY where supported and no locking on the main table
  REFRESH MATERIALIZED VIEW CONCURRENTLY reputation;
END;
$$;

COMMENT ON FUNCTION refresh_reputation() IS 'Refreshes the reputation materialized view';
