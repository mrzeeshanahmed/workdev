-- rls_messages.sql
-- Row Level Security for `messages` table
-- Usage: apply after running messages migration.

ALTER TABLE IF EXISTS messages ENABLE ROW LEVEL SECURITY;

-- Allow participants (sender or recipient) to SELECT messages in a conversation.
CREATE POLICY IF NOT EXISTS messages_select_participant
  ON messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

-- Allow sender to INSERT a message (auth.uid must match sender_id)
CREATE POLICY IF NOT EXISTS messages_insert_sender
  ON messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

-- Allow sender or recipient to UPDATE (e.g., mark read)
CREATE POLICY IF NOT EXISTS messages_update_participant
  ON messages FOR UPDATE
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id)
  WITH CHECK (auth.uid() = sender_id OR auth.uid() = recipient_id);

-- Allow sender deletion by sender only (optional, use with care)
-- CREATE POLICY messages_delete_sender ON messages FOR DELETE USING (auth.uid() = sender_id);
