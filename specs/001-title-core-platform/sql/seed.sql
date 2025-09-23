-- Seed data for tests
INSERT INTO profiles (id, role, full_name, display_name, is_admin)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Admin', 'Admin User', 'admin', true),
  ('00000000-0000-0000-0000-000000000002', 'Developer', 'Dev User', 'devuser', false),
  ('00000000-0000-0000-0000-000000000003', 'Client', 'Client User', 'clientuser', false)
ON CONFLICT (id) DO NOTHING;
