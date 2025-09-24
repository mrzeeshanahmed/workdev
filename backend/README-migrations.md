# Running SQL migrations (POSIX / cross-platform)

This repository ships a PowerShell migration runner (`backend/scripts/run-migrations.ps1`).
For POSIX-compatible environments (macOS, Linux, WSL) and cross-platform Node.js users, use the Node ESM runner:

`backend/scripts/run-migrations.mjs`

Requirements
- `node` (>=14)
- `psql` available on PATH (Postgres client)
- `DATABASE_URL` environment variable set to a Postgres connection string (for example: `postgresql://user:pass@localhost:5432/dbname`)

Usage

- Dry-run (list migrations without executing):

```bash
cd backend
DATABASE_URL=postgresql://user:pass@localhost:5432/dbname node ./scripts/run-migrations.mjs --dry-run
```

- Execute migrations (applies each `.sql` file in lexical order):

```bash
cd backend
export DATABASE_URL=postgresql://user:pass@localhost:5432/dbname
node ./scripts/run-migrations.mjs
```

Notes
- Files in `backend/migrations` are applied in lexical order — prefix files with zero-padded numbers to guarantee ordering.
- The runner prints each filename before running it and will fail fast on errors (non-zero `psql` exit code).
- This script intentionally shells out to `psql` so it behaves similarly to running `psql -f <file>` locally and inherits `psql`'s client-side features.
# Running database migrations (local)

This project includes SQL migrations in `backend/migrations/` and a helper script `backend/scripts/run-migrations.ps1`.

Quickstart (Windows / PowerShell):

1. Copy the example env file and set a working Postgres DATABASE_URL:

```powershell
cp backend\.env.example backend\.env
# Edit backend\.env and set DATABASE_URL, e.g.:
# postgresql://postgres:password@localhost:5432/workdev_test
``` 

2. Run the migrations script (the script uses DATABASE_URL from the environment):

```powershell
cd backend
./scripts/run-migrations.ps1
```

3. If you prefer to run migrations manually, you can execute the SQL files in `backend/migrations/` against your database in order.

Notes:
- If `DATABASE_URL` is unset or empty, services default to in-memory mode and tests run against sample data.
- The `backend/.env.example` sets `DB_ENABLED=true` but you still need to supply `DATABASE_URL`.
- For CI, set `DATABASE_URL` to a test Postgres instance and run the migration script before tests.
