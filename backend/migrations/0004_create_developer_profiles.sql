-- 0004_create_developer_profiles.sql
-- Canonical, idempotent creation of the `developer_profiles` table.
-- Focuses on DDL only: table + unique index. Triggers (search_vector, updated_at)
-- and GIN indexes are created in a separate migration to avoid duplication.

BEGIN;

-- Ensure pgcrypto extension is available for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create the canonical developer_profiles table if missing.
CREATE TABLE IF NOT EXISTS developer_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL,
  headline text,
  bio text,
  location text,
  hourly_rate numeric(10,2),
  is_public boolean NOT NULL DEFAULT true,
  -- kept for search wiring; trigger/index applied in separate migration
  search_vector tsvector,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- If upgrading from older divergent DDLs, ensure missing columns exist (idempotent)
ALTER TABLE developer_profiles
  ADD COLUMN IF NOT EXISTS display_name text NOT NULL,
  ADD COLUMN IF NOT EXISTS headline text,
  ADD COLUMN IF NOT EXISTS bio text,
  ADD COLUMN IF NOT EXISTS location text,
  ADD COLUMN IF NOT EXISTS hourly_rate numeric(10,2),
  ADD COLUMN IF NOT EXISTS is_public boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS search_vector tsvector,
  ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

-- Unique index on user_id to enforce one profile per user (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'idx_developer_profiles_user_id') THEN
    CREATE UNIQUE INDEX idx_developer_profiles_user_id ON developer_profiles(user_id);
  END IF;
END$$;

COMMIT;

