-- Migration: create two_factor_secrets table
-- Stores encrypted TOTP secret and backup codes (backup codes should be hashed in production)
CREATE TABLE IF NOT EXISTS two_factor_secrets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  secret text NOT NULL,
  backup_codes jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_two_factor_user_id ON two_factor_secrets(user_id);

-- TODO: Add RLS policies to restrict access: only service role or owner may read/update
