// @ts-nocheck
import { serve } from 'std/server'
import speakeasy from 'speakeasy'
import QRCode from 'qrcode'

// NOTE: This is a simple in-memory store for demo/testing. In production
// replace with a secure DB-backed storage (e.g., Supabase table linked to auth.users)
const secretsStore: Record<string, { secret: string; backupCodes: string[] }> = {}

serve(async (req) => {
  try {
    if (req.method === 'POST') {
      const { userId } = await req.json()
      if (!userId) return new Response(JSON.stringify({ error: 'userId required' }), { status: 400 })

      const secret = speakeasy.generateSecret({ name: `WorkDev (${userId})` })
      // generate 8 backup codes (each 8 chars) - should be stored hashed in prod
      const backupCodes = Array.from({ length: 8 }).map(() => Math.random().toString(36).slice(2, 10))
      secretsStore[userId] = { secret: secret.base32, backupCodes }

      const otpAuth = secret.otpauth_url
      const qr = await QRCode.toDataURL(otpAuth)

      return new Response(JSON.stringify({ qr, secret: secret.base32, backupCodes }), { headers: { 'Content-Type': 'application/json' } })
    }
    return new Response('Method Not Allowed', { status: 405 })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
})
