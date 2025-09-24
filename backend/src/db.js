import { Pool } from 'pg'
import { fileURLToPath } from 'url'
import path from 'path'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let pool = null
// Use a mutable flag so tests can toggle DB mode by mutating the default export object.
let isDbEnabled = Boolean(process.env.DATABASE_URL)

if (isDbEnabled) {
  pool = new Pool({ connectionString: process.env.DATABASE_URL })
} else {
  console.warn('DATABASE_URL not set; DB-backed mode disabled. Controllers will fallback to sample data.')
}

export let query = async function (text, params = []) {
  if (!pool) throw new Error('Database not configured. Set DATABASE_URL to enable DB-backed mode.')
  return pool.query(text, params)
}

export let transaction = async function (fn) {
  if (!pool) throw new Error('Database not configured. Set DATABASE_URL to enable DB-backed mode.')
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const res = await fn(client)
    await client.query('COMMIT')
    return res
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
  }
}

// Sample-data loader for local/dev fallback
function loadSampleData() {
  try {
    const p = path.resolve(__dirname, '..', 'data', 'sample-data.json')
    if (fs.existsSync(p)) {
      const raw = fs.readFileSync(p, 'utf8')
      const parsed = JSON.parse(raw)
      return {
        projects: parsed.projects || [],
        skills: parsed.skills || [],
        proposals: parsed.proposals || []
      }
    }
    return { projects: [], skills: [], proposals: [] }
  } catch (err) {
    return { projects: [], skills: [], proposals: [] }
  }
}

let sampleData = loadSampleData()

function refreshSampleData() {
  sampleData = loadSampleData()
}

// Default export object used throughout the codebase and by tests. Tests mutate this object
// (for example `db.isDbEnabled = true`) so its properties must be mutable.
const db = {
  get isDbEnabled() {
    return isDbEnabled
  },
  set isDbEnabled(v) {
    isDbEnabled = Boolean(v)
    // if toggling on, ensure pool is created; toggling off won't tear down pool in tests
    if (isDbEnabled && !pool) {
      pool = new Pool({ connectionString: process.env.DATABASE_URL })
    }
  },
  get query() {
    return query
  },
  set query(fn) {
    query = fn
  },
  get transaction() {
    return transaction
  },
  set transaction(fn) {
    transaction = fn
  },
  pool,
  sampleData,
  refreshSampleData
}

// Also expose named helpers for modules that prefer them.
export { pool, sampleData, refreshSampleData }
export default db
