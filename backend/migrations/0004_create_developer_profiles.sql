-- Migration: create developer_profiles table
-- File: backend/migrations/0004_create_developer_profiles.sql
BEGIN;

CREATE TABLE IF NOT EXISTS developer_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL,
  headline text,
  bio text,
  location text,
  hourly_rate numeric(10,2),
  is_public boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_developer_profiles_user_id ON developer_profiles(user_id);

COMMIT;
-- Create developer_profiles table
CREATE TABLE IF NOT EXISTS developer_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  headline text,
  bio text,
  location text,
  hourly_rate integer,
  is_public boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
