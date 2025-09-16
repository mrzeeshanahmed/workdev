import { describe, it, expect } from 'vitest'
import fetch from 'node-fetch'
import { BASE } from './testHelper'

describe('Contract: GET /api/public/projects/:id', () => {
  it('returns 200 and project object', async () => {
    const placeholderId = '00000000-0000-0000-0000-000000000000'
    const res = await fetch(`${BASE}/api/public/projects/${placeholderId}`)
    expect(res.status).toBe(200)
    const body: any = await res.json()
    expect(body).toHaveProperty('id')
    expect(body).toHaveProperty('title')
    expect(body).toHaveProperty('budget')
  })
})
