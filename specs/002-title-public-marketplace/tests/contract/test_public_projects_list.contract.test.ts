import { describe, it, expect } from 'vitest'
import fetch from 'node-fetch'
import { BASE } from './testHelper'

describe('Contract: GET /api/public/projects', () => {
  it('returns 200 and correct shape', async () => {
    const res = await fetch(`${BASE}/api/public/projects`)
    expect(res.status).toBe(200)
    const body: any = await res.json()
    expect(body).toHaveProperty('items')
    expect(Array.isArray(body.items)).toBe(true)
    expect(body).toHaveProperty('total_count')
    expect(body).toHaveProperty('next_cursor')
  })
})
