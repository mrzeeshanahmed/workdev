import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../../src/app.js'

describe('Developer Dashboard contract', () => {
  it('returns developer profile, analytics, recent_proposals and saved_searches', async () => {
    const res = await request(app).get('/developers/dev-1/dashboard')
    expect(res.status).toBe(200)
    const body = res.body
    expect(body).toHaveProperty('developer')
    expect(body).toHaveProperty('analytics')
    expect(body).toHaveProperty('recent_proposals')
    expect(body).toHaveProperty('saved_searches')

    // developer shape
    expect(body.developer).toHaveProperty('id')
    expect(body.developer).toHaveProperty('display_name')

    // analytics basic counters
    expect(body.analytics).toHaveProperty('profile_views')
    expect(body.analytics).toHaveProperty('proposals_submitted')

    // recent_proposals is an array
    expect(Array.isArray(body.recent_proposals)).toBe(true)

    // saved_searches is an array
    expect(Array.isArray(body.saved_searches)).toBe(true)
  })
})
