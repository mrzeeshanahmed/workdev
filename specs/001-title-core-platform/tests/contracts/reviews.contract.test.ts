import { test, expect } from 'vitest'

// TODO: T003 - contract test (intentionally failing until endpoint exists)
const BASE = process.env.CONTRACT_BASE_URL || ''
test.skipIf = (cond: boolean) => cond ? test.skip : test

test.skipIf(!BASE)('POST /projects/:id/reviews -> 201 (create review)', async () => {
  const projectId = '00000000-0000-0000-0000-000000000100'
  const res = await fetch(`${BASE}/projects/${projectId}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reviewer_id: '00000000-0000-0000-0000-000000000002', reviewee_id: '00000000-0000-0000-0000-000000000003', quality: 5, comment: 'Great work' })
  })
  expect(res.status).toBe(201)
})
