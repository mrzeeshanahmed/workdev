#!/usr/bin/env node
import { spawn } from 'child_process'
import fs from 'fs'
import path from 'path'

const migrationsDir = path.resolve(process.cwd(), 'migrations')
const dryRun = process.argv.includes('--dry-run')
const databaseUrl = process.env.DATABASE_URL

function fail(msg) {
  console.error(msg)
  process.exit(1)
}

if (!databaseUrl && !dryRun) {
  fail('DATABASE_URL is not set. Set it to your Postgres connection string and retry.')
}

if (!fs.existsSync(migrationsDir)) {
  fail(`Migrations directory not found: ${migrationsDir}`)
}

const files = fs.readdirSync(migrationsDir)
  .filter(f => f.endsWith('.sql'))
  .sort()

if (!files.length) {
  console.log('No .sql migration files found.')
  process.exit(0)
}

console.log(`Running ${files.length} migrations from ${migrationsDir} (dryRun=${dryRun})`)

async function runFile(file) {
  const full = path.join(migrationsDir, file)
  console.log(`--> ${file}`)
  if (dryRun) return
  return new Promise((resolve, reject) => {
    const psql = spawn('psql', [databaseUrl, '-f', full], { stdio: 'inherit' })
    psql.on('error', (err) => reject(err))
    psql.on('close', (code) => {
      if (code !== 0) return reject(new Error(`psql exited with code ${code} for ${file}`))
      resolve()
    })
  })
}

(async () => {
  try {
    for (const f of files) {
      await runFile(f)
    }
    console.log('Migrations completed successfully.')
  } catch (e) {
    console.error('Migration failed:', e && e.message ? e.message : String(e))
    process.exit(1)
  }
})()
