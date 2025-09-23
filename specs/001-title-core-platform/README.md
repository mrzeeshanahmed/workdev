# Core platform (WorkDev) - Quickstart for tests

This doc explains how to run unit and integration tests locally and in CI.

Run unit tests (frontend):

```powershell
cd E:\workdev\frontend
npx vitest
```

Run integration tests (starts local functions dev-server automatically via Vitest globalSetup):

```powershell
cd E:\workdev
# Ensure TOTP_ENCRYPTION_KEY is set in your environment (see below)
npx vitest --run specs/001-title-core-platform/tests/integration --reporter verbose
```

Generating a secure `TOTP_ENCRYPTION_KEY` (32 bytes, base64):

PowerShell example to generate and print a base64 key:

```powershell
$keyBytes = New-Object System.Byte[] 32
(New-Object System.Security.Cryptography.RNGCryptoServiceProvider).GetBytes($keyBytes)
$key = [Convert]::ToBase64String($keyBytes)
Write-Host $key
```

In CI (GitHub Actions) add a repository secret named `TOTP_ENCRYPTION_KEY` with the above base64 value. The included `/.github/workflows/ci.yml` will use that secret when running integration tests.

Notes:
- The functions dev-server health endpoint is at `http://127.0.0.1:54323/functions/v1/health` by default. Override with `FUNCTIONS_PORT` env var.
- Backup codes are returned plaintext once during setup and stored hashed in the DB.
- Secrets are encrypted at rest using AES-256-GCM. In production, store `TOTP_ENCRYPTION_KEY` in a managed secret store and avoid plain env vars when possible.
