const crypto = require('crypto')

// Expect TOTP_ENCRYPTION_KEY to be a 32-byte base64 string
const KEY_ENV = process.env.TOTP_ENCRYPTION_KEY
if (!KEY_ENV) {
  console.warn('TOTP_ENCRYPTION_KEY not set — falling back to insecure random key (dev)')
}

function getKey() {
  if (KEY_ENV) return Buffer.from(KEY_ENV, 'base64')
  // In-memory fallback for dev (NOT for prod)
  return crypto.createHash('sha256').update('dev-totp-key').digest()
}

function encrypt(plaintext) {
  const iv = crypto.randomBytes(12)
  const key = getKey()
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv)
  const ciphertext = Buffer.concat([cipher.update(Buffer.from(plaintext, 'utf8')), cipher.final()])
  const tag = cipher.getAuthTag()
  // return base64 of iv|tag|ciphertext
  return Buffer.concat([iv, tag, ciphertext]).toString('base64')
}

function decrypt(b64) {
  const data = Buffer.from(b64, 'base64')
  const iv = data.slice(0, 12)
  const tag = data.slice(12, 28)
  const ciphertext = data.slice(28)
  const key = getKey()
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv)
  decipher.setAuthTag(tag)
  const pt = Buffer.concat([decipher.update(ciphertext), decipher.final()])
  return pt.toString('utf8')
}

module.exports = { encrypt, decrypt }
