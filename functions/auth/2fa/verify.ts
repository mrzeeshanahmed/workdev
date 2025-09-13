import { serve } from 'std/server'
import speakeasy from 'speakeasy'

// Shared in-memory store (same as setup.ts) — in real usage this should be
// a shared DB table or Supabase storage accessed by both functions.
const secretsStore: Record<string, { secret: string; backupCodes: string[] }> = {}

serve(async (req) => {
  try {
    if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 })
    const { userId, token, backupCode } = await req.json()
    if (!userId) return new Response(JSON.stringify({ error: 'userId required' }), { status: 400 })

    const entry = secretsStore[userId]
    if (!entry) return new Response(JSON.stringify({ error: 'no setup for user' }), { status: 404 })

    if (backupCode) {
      const idx = entry.backupCodes.indexOf(backupCode)
      if (idx === -1) return new Response(JSON.stringify({ valid: false }), { status: 200 })
      // consume the backup code
      entry.backupCodes.splice(idx, 1)
      return new Response(JSON.stringify({ valid: true }), { status: 200 })
    }

    const verified = speakeasy.totp.verify({ secret: entry.secret, encoding: 'base32', token })
    return new Response(JSON.stringify({ valid: !!verified }), { status: 200 })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
})
