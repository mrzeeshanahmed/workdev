# Migrations

This folder contains SQL migrations that should be applied in lexical order.

Quick usage (PowerShell):

1. Set `DATABASE_URL` environment variable (Postgres connection string). Example:

```powershell
$env:DATABASE_URL = 'postgres://user:pass@localhost:5432/workdev_test'
```

2. Run the helper script from repository root:

```powershell
.
\backend\scripts\run-migrations.ps1
```

Notes:
- The script uses `psql` (Postgres client) to run migrations. Ensure `psql` is installed and available in PATH.
- Migrations are executed in filename order. If you use a CI system, run these against a disposable test database.
# Database migrations

Place SQL migration files here. Use your project's migration tooling (eg. node-pg-migrate, prisma migrate, or plain sql files executed by CI).

Files in this directory are applied in lexical order.

## Canonical schema decisions

This project follows a small set of conventions to keep migrations predictable and avoid duplicates:

- Use UUIDs for primary keys and cross-table references. Example column type: `id uuid PRIMARY KEY DEFAULT gen_random_uuid()`.
- Prefer composite PKs for join tables (no surrogate id) when the relation is a pure many-to-many. Example: `PRIMARY KEY (project_id, skill_id)`.
- Use explicit FK constraints with `ON DELETE CASCADE` for join tables so related cleanup is automatic.
- Use enums sparingly for domain-like fields (e.g., `project_type`) and create them with `CREATE TYPE ... AS ENUM (...)` before using in the table.
- Keep seed data idempotent using `INSERT ... ON CONFLICT DO NOTHING` so re-running migrations or seeds is safe.
- Add only idempotent index/statements in migrations (use `IF NOT EXISTS` where available).

Example canonical join table (projects <-> skills):

```sql
BEGIN;

CREATE TABLE IF NOT EXISTS project_skills (
	project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
	skill_id uuid NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
	PRIMARY KEY (project_id, skill_id)
);

CREATE INDEX IF NOT EXISTS idx_project_skills_project_id ON project_skills(project_id);
CREATE INDEX IF NOT EXISTS idx_project_skills_skill_id ON project_skills(skill_id);

COMMIT;
```

Example enum creation and usage:

```sql
BEGIN;
CREATE TYPE IF NOT EXISTS project_type AS ENUM ('fixed','hourly');

CREATE TABLE IF NOT EXISTS projects (
	id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	title text NOT NULL,
	project_type project_type NOT NULL DEFAULT 'fixed',
	-- ... other columns ...
);
COMMIT;
```

## Triggers and search indices

- Keep triggers small and focused; prefer to implement complex indexing in separate migrations so they can be rolled back independently.
- Use `CREATE INDEX IF NOT EXISTS` for additional search indices, and prefer GIN indexes for tsvector/search columns.

Example search index (tsvector):

```sql
CREATE INDEX IF NOT EXISTS idx_projects_search ON projects USING GIN (to_tsvector('english', coalesce(title,'') || ' ' || coalesce(description,'')));
```

## How to add a new migration safely

1. Create a new file in `backend/migrations/` with a sequential filename (e.g., `00NN_description.sql`).
2. Wrap changes in `BEGIN; ... COMMIT;` and use `IF NOT EXISTS` where possible.
3. Avoid duplicating table creation: prefer editing the canonical migration only when it's safe and all environments are coordinated.
4. For schema changes that touch existing data, write a separate data-migration step (populate new columns/tables) and keep it idempotent.
5. Add seeds in a separate migration file and use `ON CONFLICT DO NOTHING` to make them safe to re-run.
6. Run migrations against a disposable test DB before pushing; CI should run the same script against a fresh DB to validate ordering.

Quick checklist example for a new migration that adds a join table and seed:

```sql
-- 00NN_create_foo_bar.sql
BEGIN;

CREATE TABLE IF NOT EXISTS foo_bar (
	foo_id uuid NOT NULL REFERENCES foo(id) ON DELETE CASCADE,
	bar_id uuid NOT NULL REFERENCES bar(id) ON DELETE CASCADE,
	PRIMARY KEY (foo_id, bar_id)
);

CREATE INDEX IF NOT EXISTS idx_foo_bar_foo ON foo_bar(foo_id);

COMMIT;
```

And a separate seed file:

```sql
-- 00NN_seed_foo_bar.sql
BEGIN;

INSERT INTO foo_bar (foo_id, bar_id)
SELECT f.id, b.id FROM foo f JOIN bar b ON b.name = 'example' WHERE f.slug = 'sample'
ON CONFLICT DO NOTHING;

COMMIT;
```

## Avoiding duplicate migrations

- Never create multiple migrations that both `CREATE TABLE project_skills` or similar — prefer a single canonical migration file per object.
- If you must change the canonical table shape (rare), create a migration that alters the table (ALTER TABLE) and include data migration/cleanup steps; do not re-create the table.

## Rollback and forward compatibility

- We don't maintain automated down migrations in this repo; instead, write forward-compatible changes and test them on a disposable DB. For destructive schema changes, provide a separate reversible script and document the manual rollback steps in the migration file header.

If you'd like, I can add a short template file (`backend/migrations/TEMPLATE_migration.sql`) you can copy when authoring new migrations.

