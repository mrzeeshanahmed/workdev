import { test, expect } from 'vitest'

// TODO: T003 - contract test (intentionally failing until endpoint exists)
const BASE = process.env.CONTRACT_BASE_URL || ''

test.skipIf = (cond: boolean) => cond ? test.skip : test

test.skipIf(!BASE)('POST /messages -> 201 (send message)', async () => {
  const res = await fetch(`${BASE}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sender_id: '00000000-0000-0000-0000-000000000002', recipient_id: '00000000-0000-0000-0000-000000000003', body: 'hello' })
  })
  expect(res.status).toBe(201)
})

test.skipIf(!BASE)('GET /conversations/:id/messages -> 200 (list)', async () => {
  const id = '00000000-0000-0000-0000-000000000010'
  const res = await fetch(`${BASE}/conversations/${id}/messages`)
  expect(res.status).toBe(200)
})
