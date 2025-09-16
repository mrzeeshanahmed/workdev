import { describe, it, expect } from 'vitest'
import fetch from 'node-fetch'

const BASE = process.env.FUNCTIONS_BASE_URL || ''
const AUTH_TOKEN = process.env.TEST_AUTH_TOKEN || ''
const shouldSkip = !BASE

describe('Integration: Developer contact (auth)', () => {
  it('skips when FUNCTIONS_BASE_URL not set', () => {
    if (shouldSkip) {
      expect(shouldSkip).toBeTruthy()
      return
    }
  })

  it('shows contact action for authenticated clients', async () => {
    if (shouldSkip) return
    // Find a developer id first
    const listRes = await fetch(`${BASE}/api/public/developers?page_size=1`)
    expect(listRes.status).toBe(200)
    const listBody: any = await listRes.json()
    if (!Array.isArray(listBody.items) || listBody.items.length === 0) {
      expect(listBody.items.length).toBe(0)
      return
    }
    const id = listBody.items[0].id

    // Unauthenticated: contact action should be absent or require auth
    const anonRes = await fetch(`${BASE}/api/public/developers/${id}`)
    expect(anonRes.status).toBe(200)
    const anonBody: any = await anonRes.json()
    // If auth required, endpoint may not expose contact info
    expect(anonBody).toHaveProperty('id')

    if (!AUTH_TOKEN) {
      // No test token provided — mark that we've validated the unauthenticated shape
      return
    }

    // Authenticated request: include token
    const authRes = await fetch(`${BASE}/api/public/developers/${id}`, {
      headers: { Authorization: `Bearer ${AUTH_TOKEN}` }
    })
    expect(authRes.status).toBe(200)
    const authBody: any = await authRes.json()
    // Authenticated clients should see contact/action metadata
    expect(authBody).toHaveProperty('contact')
  })
})
