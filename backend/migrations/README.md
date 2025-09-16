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
