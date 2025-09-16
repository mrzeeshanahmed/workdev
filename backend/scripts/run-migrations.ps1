Param()

if (-not $env:DATABASE_URL) {
    Write-Error "Please set DATABASE_URL environment variable, e.g. $env:DATABASE_URL = 'postgres://user:pass@host:5432/db'"
    exit 1
}

$migrations = Get-ChildItem -Path (Join-Path $PSScriptRoot '..\migrations') -Filter '*.sql' | Sort-Object Name
foreach ($m in $migrations) {
    Write-Host "Applying migration: $($m.Name)"
    & psql $env:DATABASE_URL -f $m.FullName
    if ($LASTEXITCODE -ne 0) {
        Write-Error "psql failed on $($m.Name) with exit code $LASTEXITCODE"
        exit $LASTEXITCODE
    }
}

Write-Host "Migrations applied successfully."
