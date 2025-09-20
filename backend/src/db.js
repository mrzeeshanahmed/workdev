const { Pool } = require('pg')
const path = require('path')
const fs = require('fs')

let pool = null
const isDbEnabled = Boolean(process.env.DATABASE_URL)

if (isDbEnabled) {
  pool = new Pool({ connectionString: process.env.DATABASE_URL })
} else {
  console.warn('DATABASE_URL not set; DB-backed mode disabled. Controllers will fallback to sample data.')
}

async function query(text, params = []) {
  if (!pool) throw new Error('Database not configured. Set DATABASE_URL to enable DB-backed mode.')
  return pool.query(text, params)
}

async function transaction(fn) {
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

module.exports = { query, transaction, pool, isDbEnabled, sampleData, refreshSampleData }
