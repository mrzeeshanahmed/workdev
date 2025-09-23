import { test, expect } from 'vitest'

// TODO: T003 - contract test (intentionally failing until endpoint exists)
const BASE = process.env.CONTRACT_BASE_URL || ''

test.skipIf = (cond: boolean) => cond ? test.skip : test

test.skipIf(!BASE)('POST /auth/signup -> 201 (signup)', async () => {
  const res = await fetch(`${BASE}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: `test+signup+${Date.now()}@example.com`, password: 'Password123!' })
  })
  expect(res.status).toBe(201)
})

test.skipIf(!BASE)('POST /auth/signin -> 200 (signin)', async () => {
  const res = await fetch(`${BASE}/auth/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'test+signup@example.com', password: 'Password123!' })
  })
  expect(res.status).toBe(200)
})
