import { createClient } from '@supabase/supabase-js'

const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const URL = process.env.SUPABASE_URL || ''
const ADMIN_SECRET = process.env.REPUTATION_ADMIN_SECRET || ''

export async function handler(req: any, res: any) {
  try {
    const header = (req.headers?.['x-admin-secret'] || req.headers?.['x-admin-secret']?.toString()) || ''
    if (!SERVICE_ROLE && header !== ADMIN_SECRET) return res.status(401).json({ error: 'unauthorized' })

    const client = createClient(URL, SERVICE_ROLE || ADMIN_SECRET)
    const { error } = (await client.rpc('refresh_reputation')) as any
    if (error) return res.status(500).json({ error: error.message || error })
    return res.status(200).json({ ok: true })
  } catch (e: any) {
    return res.status(500).json({ error: e.message })
  }
}

// CLI runner for local testing
if (require.main === module) {
  ;(async () => {
    try {
      if (!URL || !SERVICE_ROLE) throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
      const client = createClient(URL, SERVICE_ROLE)
      const { error } = (await client.rpc('refresh_reputation')) as any
      if (error) throw error
      console.log('refreshed')
    } catch (e: any) {
      console.error('refresh failed', e.message || e)
      process.exit(1)
    }
  })()
}
