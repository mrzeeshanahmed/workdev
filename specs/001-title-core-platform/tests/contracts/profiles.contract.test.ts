import { test, expect } from 'vitest'

// TODO: T003 - contract test (intentionally failing until endpoint exists)
const BASE = process.env.CONTRACT_BASE_URL || 'http://localhost:8787'

test('GET /profiles/:id -> 200 (public fields)', async () => {
  const id = '00000000-0000-0000-0000-000000000002'
  const res = await fetch(`${BASE}/profiles/${id}`)
  expect(res.status).toBe(200)
})

test('PUT /profiles/:id -> 200 (owner)', async () => {
  const id = '00000000-0000-0000-0000-000000000002'
  const res = await fetch(`${BASE}/profiles/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ display_name: 'updated-dev' })
  })
  expect(res.status).toBe(200)
})
