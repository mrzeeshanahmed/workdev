# Client Dashboard — Data Model

This document outlines the database tables and relationships required for the Client Dashboard and Project Management features.

Core Tables

- projects
  - id uuid PK
  - owner_id uuid FK -> auth.users
  - title text
  - description text
  - type text enum('fixed','hourly')
  - budget_min numeric
  - budget_max numeric NULLABLE
  - skills jsonb (array of skill ids or names)
  - status text enum('draft','open','in_progress','completed','archived') DEFAULT 'draft'
  - created_at timestamptz DEFAULT now()
  - updated_at timestamptz DEFAULT now()
  - search_vector tsvector (for full-text search)

- proposals
  - id uuid PK
  - project_id uuid FK -> projects.id
  - applicant_id uuid FK -> auth.users
  - cover_letter text
  - amount numeric NULLABLE
  - hours_estimate integer NULLABLE
  - status text enum('submitted','shortlisted','rejected','accepted','archived') DEFAULT 'submitted'
  - created_at timestamptz DEFAULT now()
  - updated_at timestamptz DEFAULT now()

- project_skills
  - project_id uuid FK -> projects.id
  - skill_id uuid FK -> skills.id

- skills
  - id uuid PK
  - name text UNIQUE

Notes & decisions
- Projects store skills as both a join table and a JSONB snapshot for fast searching and denormalized UI needs. Initial implementation may only use jsonb to simplify migrations; add join table in a follow-up migration.
- RLS/Ownership: Add policies to ensure only project owner can edit or delete a project. Proposals created by applicants; owners can read proposals for their projects.
- Search: Use PostgreSQL full-text search on title + description + skills to support keyword queries. We'll add a trigger to maintain search_vector on insert/update.

Initial migration files (to create)
- 00xx_create_skills.sql
- 00xx_create_projects.sql
- 00xx_create_proposals.sql
- 00xx_create_project_skills.sql (optional)
- 00xx_triggers_search_vector.sql

Acceptance criteria for migrations
- Migrations create tables with appropriate indices (projects.search_vector GIN, projects.owner_id index, proposals.project_id index)
- search_vector trigger updates on project insert/update
- Basic FK constraints in place
