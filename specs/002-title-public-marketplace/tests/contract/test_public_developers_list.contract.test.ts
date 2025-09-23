import { describe, it, expect } from 'vitest'
import { BASE } from './testHelper'

describe('Contract: GET /api/public/developers', () => {
  it('returns 200 and correct shape', async () => {
    const res = await fetch(`${BASE}/api/public/developers`)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toHaveProperty('items')
    expect(Array.isArray(body.items)).toBe(true)
    expect(body).toHaveProperty('total_count')
    expect(body).toHaveProperty('next_cursor')
  })
})
