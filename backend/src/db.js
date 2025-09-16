const { Pool } = require('pg')

let pool = null
if (process.env.DATABASE_URL) {
  pool = new Pool({ connectionString: process.env.DATABASE_URL })
} else {
  console.warn('DATABASE_URL not set; DB-backed mode disabled. Controllers will need to fallback to sample data.')
}

async function query(text, params) {
  if (!pool) throw new Error('Database not configured. Set DATABASE_URL to enable DB-backed mode.')
  return pool.query(text, params)
}

module.exports = { query, pool }
