-- 0010_create_files.sql
CREATE TABLE IF NOT EXISTS files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  uploader_id TEXT NOT NULL,
  filename TEXT NOT NULL,
  size BIGINT NOT NULL,
  mime_type TEXT,
  storage_path TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
