-- 001_profiles.sql
-- profiles are linked 1:1 to auth.users. When using Supabase Auth, create the
-- auth.users entry first, then insert a profiles row with the same id.
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  role text NOT NULL,
  full_name text,
  display_name text,
  avatar_url text,
  website text,
  bio text,
  hourly_rate numeric,
  currency text,
  availability_status text,
  is_vetted boolean DEFAULT false,
  github_connected boolean DEFAULT false,
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_is_vetted ON profiles(is_vetted);

-- RLS policy examples (commented):
-- Enable RLS and create example policies after applying migrations.
-- ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
-- -- Allow anyone to select public fields (adjust columns as needed):
-- CREATE POLICY "public_select_profiles" ON profiles FOR SELECT USING (true);
-- -- Allow owners to update their profile:
-- CREATE POLICY "owner_update_profile" ON profiles FOR UPDATE USING (auth.uid() = id);
-- -- Allow admins to update vetting flag (assumes is_admin boolean on profiles):
-- CREATE POLICY "admin_update_vetting" ON profiles FOR UPDATE USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin));
