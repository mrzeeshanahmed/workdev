const speakeasy = require('speakeasy')
const bcrypt = require('bcryptjs')
const { decrypt } = require('../../../lib/crypto')

let supabase = null
if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
  const { createClient } = require('@supabase/supabase-js')
  supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
}

const secretsStore = global.__workdev_2fa_store ||= {}

async function loadSecretFromDb(userId) {
  if (!supabase) return null
  const { data, error } = await supabase.from('two_factor_secrets').select('*').eq('user_id', userId).maybeSingle()
  if (error) throw error
  return data
}

async function consumeBackupCodeDb(userId, code) {
  if (!supabase) return false
  // fetch entry
  const { data, error } = await supabase.from('two_factor_secrets').select('backup_codes').eq('user_id', userId).maybeSingle()
  if (error) throw error
  if (!data) return false
  const codes = data.backup_codes || []
  for (let i = 0; i < codes.length; i++) {
    const match = await bcrypt.compareSync(code, codes[i])
    if (match) {
      codes.splice(i, 1)
      const { error: upErr } = await supabase.from('two_factor_secrets').update({ backup_codes: codes }).eq('user_id', userId)
      if (upErr) throw upErr
      return true
    }
  }
  return false
}

module.exports = async function handler(req) {
  if (req.method !== 'POST') return { status: 405, body: { error: 'Method Not Allowed' } }
  const { userId, token, backupCode } = req.body || {}
  if (!userId) return { status: 400, body: { error: 'userId required' } }

  let entry = null
  if (supabase) {
    entry = await loadSecretFromDb(userId)
  } else {
    entry = secretsStore[userId]
  }
  if (!entry) return { status: 404, body: { error: 'no setup for user' } }

  if (backupCode) {
    if (supabase) {
      const ok = await consumeBackupCodeDb(userId, backupCode)
      return { status: 200, body: { valid: !!ok } }
    }
    // in-memory: compare hashed codes
    const codes = entry.backupCodes || []
    for (let i = 0; i < codes.length; i++) {
      const match = bcrypt.compareSync(backupCode, codes[i])
      if (match) {
        codes.splice(i, 1)
        return { status: 200, body: { valid: true } }
      }
    }
    return { status: 200, body: { valid: false } }
  }

  const secret = entry.secret
  // If secret was stored encrypted in DB, decrypt it first
  let secretPlain = secret
  try {
    // encrypted values are base64 strings — attempt decrypt, but fall back if not encrypted
    secretPlain = decrypt(secret)
  } catch (err) {
    // not encrypted or decryption failed — assume stored in plain base32
    secretPlain = secret
  }
  const verified = speakeasy.totp.verify({ secret: secretPlain, encoding: 'base32', token })
  return { status: 200, body: { valid: !!verified } }
}
