````markdown
# Data Model (Supabase/Postgres)

All paths are intended for a Supabase project. Use `auth.users` for identity and link `profiles` one-to-one.

## Tables

### profiles
- id: uuid (PK) references auth.users(id)
- role: text CHECK ('Client' OR 'Developer')
- full_name: text
- display_name: text
- avatar_url: text
- website: text
- bio: text
- hourly_rate: numeric
- currency: text
- availability_status: text (available|busy|away)
- is_vetted: boolean
- github_connected: boolean
- created_at, updated_at: timestamptz

Indexes: role, is_vetted

### projects
- id: uuid PK
- client_id: uuid references profiles(id)
- title: text
- description: text
- budget: numeric
- currency: text
- status: text (open|in_progress|completed|cancelled)
- created_at, updated_at

### proposals
- id: uuid PK
- project_id: uuid references projects(id)
- developer_profile_id: uuid references profiles(id)
- cover_letter: text
- proposed_rate: numeric
- status: text (pending|accepted|rejected)
- created_at, updated_at

### reviews
- id: uuid PK
- project_id: uuid references projects(id)
- reviewer_id: uuid references profiles(id)
- reviewee_id: uuid references profiles(id)
- quality: smallint (1-5)
- communication: smallint (1-5)
- expertise: smallint (1-5)
- deadlines: smallint (1-5)
- comment: text
- created_at

### messages
- id: uuid PK
- conversation_id: uuid (grouping conversation or project-based)
- sender_id: uuid references profiles(id)
- recipient_id: uuid references profiles(id)
- body: text
- attachments: jsonb (array of attachment metadata)
- read_at: timestamptz NULL
- created_at: timestamptz

### attachments (optional normalized table)
- id: uuid PK
- owner_id: uuid references profiles(id)
- file_url: text
- content_type: text
- size: integer
- virus_scan_status: text
- created_at

## RLS & Policies
- Enforce Row Level Security (RLS) on profiles, projects, proposals, reviews, messages and attachments.
- Policies examples:
  - profiles: allow select public fields to everyone, allow updates only by the owner, allow vets to update `is_vetted`.
  - messages: allow insert/select between participants; allow delete only by sender or admin.

## Storage
- Buckets: `avatars`, `project-files`.
- Use signed URLs for downloads; restrict uploads to authenticated users and relevant buckets.

````
