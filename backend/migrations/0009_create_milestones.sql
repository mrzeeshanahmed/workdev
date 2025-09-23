-- 0009_create_milestones.sql
CREATE TYPE milestone_state AS ENUM ('Draft','Submitted','RevisionRequested','Approved','Rejected','Archived');

CREATE TABLE IF NOT EXISTS milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  amount NUMERIC(12,2),
  state milestone_state NOT NULL DEFAULT 'Draft',
  attachments JSONB DEFAULT '[]',
  created_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  version INTEGER NOT NULL DEFAULT 1
);
