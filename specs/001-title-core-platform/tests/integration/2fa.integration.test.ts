import { test, expect } from 'vitest'

const BASE = process.env.FUNCTIONS_BASE_URL || 'http://localhost:54323/functions/v1'

test('2FA setup returns QR, secret and backup codes', async () => {
  const userId = `test-${Date.now()}`
  const res = await fetch(`${BASE}/auth/2fa/setup`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId }) })
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.qr).toBeTruthy()
  expect(body.secret).toBeTruthy()
  expect(Array.isArray(body.backupCodes)).toBe(true)
})
