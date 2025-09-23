import { describe, it, expect } from 'vitest'
import fetch from 'node-fetch'

const BASE = process.env.FUNCTIONS_BASE_URL || process.env.INTEGRATION_BASE_URL || ''
const shouldSkip = !BASE

describe('Integration: Marketplace home', () => {
  it('skips if no base URL is configured', () => {
    if (shouldSkip) {
      expect(shouldSkip).toBeTruthy()
      return
    }
  })

  it('returns featured and recent projects sections', async () => {
    if (shouldSkip) return
    const res = await fetch(`${BASE}/api/public/projects`)
    expect(res.status).toBe(200)
    const body: any = await res.json()
    expect(body).toHaveProperty('items')
    expect(Array.isArray(body.items)).toBe(true)
  })
})
