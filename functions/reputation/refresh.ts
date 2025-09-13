import { createClient } from '@supabase/supabase-js'

// Lightweight script to refresh the reputation materialized view.
// This should run with service role privileges.

const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const URL = process.env.SUPABASE_URL || ''

export async function handler() {
  if (!SERVICE_ROLE || !URL) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY or SUPABASE_URL')
  }
  const client = createClient(URL, SERVICE_ROLE)
  // Call the DB function that refreshes the materialized view
  const { data, error } = await client.rpc('refresh_reputation') as any
  if (error) throw error
  return { ok: true }
}

// If run directly via node for local testing
if (require.main === module) {
  handler().then(() => console.log('refreshed')).catch((e) => console.error('refresh failed', e.message))
}
