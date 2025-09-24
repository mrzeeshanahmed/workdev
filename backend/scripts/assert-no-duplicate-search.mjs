#!/usr/bin/env node
import pg from 'pg'

const { Client } = pg

const TABLES = [
  { name: 'projects', trigger_prefix: 'projects_', index_name_like: '%projects_search_vector%'},
  { name: 'developer_profiles', trigger_prefix: 'developer_profiles_', index_name_like: '%developer_profiles_search_vector%'},
]

async function main() {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    console.error('DATABASE_URL is not set. This script requires a read-only connection to the database.')
    process.exit(2)
  }

  const client = new Client({ connectionString: databaseUrl })
  await client.connect()

  try {
    let hasError = false

    for (const tbl of TABLES) {
      // Count triggers that reference the table and touch search_vector in their definition
      const triggerQuery = `
        SELECT t.tgname
        FROM pg_trigger t
        JOIN pg_class c ON t.tgrelid = c.oid
        JOIN pg_namespace n ON c.relnamespace = n.oid
        WHERE c.relname = $1
          AND t.tgname IS NOT NULL
          AND pg_get_triggerdef(t.oid) ILIKE '%search_vector%'
      `
      const triggerRes = await client.query(triggerQuery, [tbl.name])

      console.log(`Table: ${tbl.name} — found triggers: ${triggerRes.rowCount}`)
      if (triggerRes.rowCount === 0) {
        console.warn(`WARNING: no trigger referencing search_vector found for table ${tbl.name}`)
        hasError = true
      }
      if (triggerRes.rowCount > 1) {
        console.error(`ERROR: multiple triggers referencing search_vector found for table ${tbl.name}:`)
        for (const r of triggerRes.rows) console.error('  -', r.tgname)
        hasError = true
      }

      // Count GIN indexes on search_vector for the table — look in pg_indexes
      const indexQuery = `
        SELECT indexname, indexdef
        FROM pg_indexes
        WHERE tablename = $1
          AND indexdef ILIKE '%gin%search_vector%'
      `
      const indexRes = await client.query(indexQuery, [tbl.name])
      console.log(`Table: ${tbl.name} — found GIN indexes on search_vector: ${indexRes.rowCount}`)
      if (indexRes.rowCount === 0) {
        console.warn(`WARNING: no GIN index on search_vector found for table ${tbl.name}`)
        hasError = true
      }
      if (indexRes.rowCount > 1) {
        console.error(`ERROR: multiple GIN indexes on search_vector found for table ${tbl.name}:`)
        for (const r of indexRes.rows) console.error('  -', r.indexname)
        hasError = true
      }
    }

    if (hasError) {
      console.error('\nDuplicate/ missing search_vector triggers/indexes detected. Failing.')
      process.exit(1)
    }

    console.log('\nAll checks passed: exactly one trigger and one GIN index per table on search_vector.')
    process.exit(0)
  } finally {
    await client.end()
  }
}

main().catch(err => {
  console.error('Fatal error while asserting search_vector duplicates:', err)
  process.exit(2)
})
