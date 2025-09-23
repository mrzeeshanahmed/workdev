-- rls_profiles.sql
-- Row Level Security for `profiles` table
-- Usage: apply this file after running the profiles migration.

-- Enable RLS
ALTER TABLE IF EXISTS profiles ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read public profile fields. Adjust SELECT columns at the
-- application layer to avoid leaking sensitive fields.
CREATE POLICY IF NOT EXISTS public_select_profiles
  ON profiles FOR SELECT
  USING (true);

-- Allow a user to INSERT their own profile row only when auth.uid() matches.
CREATE POLICY IF NOT EXISTS owner_insert_profile
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Allow a user to UPDATE their own profile.
CREATE POLICY IF NOT EXISTS owner_update_profile
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow admins (profiles.is_admin = true) to update vetting-related fields.
CREATE POLICY IF NOT EXISTS admin_update_vetting
  ON profiles FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = true))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = true));

-- Example: revoke public access to some columns by enforcing column-level
-- filtering in SELECT views or application queries. Policies operate on rows.
