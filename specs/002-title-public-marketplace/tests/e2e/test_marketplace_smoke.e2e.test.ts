import { describe, it, expect } from 'vitest'

// This is a smoke e2e test that requires the backend dev server to be running (see backend/dev-server.js)
describe('Marketplace smoke e2e', () => {
  it('health endpoint responds', async () => {
    const res = await fetch('http://localhost:4000/health')
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.status).toBe('ok')
  })
})
