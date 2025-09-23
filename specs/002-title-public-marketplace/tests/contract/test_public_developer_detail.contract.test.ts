import { describe, it, expect } from 'vitest'
import { BASE } from './testHelper'

describe('GET /api/public/developers/:id', () => {
  it('returns 200 and developer object', async () => {
    const placeholderId = '00000000-0000-0000-0000-000000000000'
    const res = await fetch(`${BASE}/api/public/developers/${placeholderId}`)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toHaveProperty('id')
    expect(body).toHaveProperty('name')
    expect(body).toHaveProperty('skills')
  })
})
