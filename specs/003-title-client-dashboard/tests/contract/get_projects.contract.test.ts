import { describe, it } from 'vitest'
import supertest from 'supertest'

const BASE = process.env.CONTRACT_BASE_URL
if (!BASE) {
  console.warn('CONTRACT_BASE_URL not set — skipping get_projects contract test')
}

describe('GET /api/projects (contract)', () => {
  it('returns 200 with total and items array', async () => {
    if (!BASE) return
    const res = await supertest(BASE).get('/api/projects').query({ page: 1 })
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`)
    const body = res.body
    if (typeof body.total !== 'number' || !Array.isArray(body.items)) throw new Error('Invalid response shape')
  })
})
