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
