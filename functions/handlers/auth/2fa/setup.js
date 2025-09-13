const speakeasy = require('speakeasy')
const QRCode = require('qrcode')
const bcrypt = require('bcryptjs')
const { encrypt } = require('../../../lib/crypto')

let supabase = null
if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
  const { createClient } = require('@supabase/supabase-js')
  supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
}

// In-memory fallback store for local dev
const secretsStore = global.__workdev_2fa_store ||= {}

async function saveSecretToDb(userId, secretBase32, backupCodes) {
  if (!supabase) return null
  const encrypted = encrypt(secretBase32)
  const { data, error } = await supabase.from('two_factor_secrets').upsert({ user_id: userId, secret: encrypted, backup_codes: backupCodes }, { onConflict: 'user_id' }).select().single()
  if (error) throw error
  return data
}

module.exports = async function handler(req) {
  if (req.method !== 'POST') return { status: 405, body: { error: 'Method Not Allowed' } }
  const { userId } = req.body || {}
  if (!userId) return { status: 400, body: { error: 'userId required' } }

  const secret = speakeasy.generateSecret({ name: `WorkDev (${userId})` })
  const plainBackupCodes = Array.from({ length: 8 }).map(() => Math.random().toString(36).slice(2, 10))
  // Hash backup codes before storing
  const hashedBackupCodes = plainBackupCodes.map((c) => bcrypt.hashSync(c, 8))

  // Save using Supabase or fallback to in-memory store (store hashed codes)
  if (supabase) {
    await saveSecretToDb(userId, secret.base32, hashedBackupCodes)
  } else {
    // store unencrypted in-memory for dev
    secretsStore[userId] = { secret: secret.base32, backupCodes: hashedBackupCodes }
  }

  const otpAuth = secret.otpauth_url
  const qr = await QRCode.toDataURL(otpAuth)
  // Return plaintext backup codes once to the caller (user must store them securely)
  return { status: 200, body: { qr, secret: secret.base32, backupCodes: plainBackupCodes } }
}
