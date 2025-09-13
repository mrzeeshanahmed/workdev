-- 006_attachments.sql
CREATE TABLE IF NOT EXISTS attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  file_url text,
  content_type text,
  size integer,
  virus_scan_status text,
  created_at timestamptz DEFAULT now()
);

-- RLS policy examples (commented):
-- ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "attachments_select_owner" ON attachments FOR SELECT USING (auth.uid() = owner_id);
-- CREATE POLICY "attachments_insert_owner" ON attachments FOR INSERT WITH CHECK (auth.uid() = owner_id);
