-- 005_messages.sql
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid,
  sender_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  recipient_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  body text,
  attachments jsonb,
  read_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- RLS policy examples (commented):
-- ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
-- -- Allow participants to insert/select messages for conversations they are in
-- CREATE POLICY "messages_insert_participant" ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id OR auth.uid() = recipient_id);
-- CREATE POLICY "messages_select_participant" ON messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = recipient_id);
