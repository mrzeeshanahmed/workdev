import { describe, it, expect } from 'vitest'
import fetch from 'node-fetch'

const BASE = process.env.FUNCTIONS_BASE_URL || ''
const shouldSkip = !BASE

describe('Integration: Developer directory', () => {
  it('skips when FUNCTIONS_BASE_URL not set', () => {
    if (shouldSkip) {
      expect(shouldSkip).toBeTruthy()
      return
    }
  })

  it('returns searchable developers list', async () => {
    if (shouldSkip) return
    const params = new URLSearchParams({ q: 'react', page_size: '10' })
    const res = await fetch(`${BASE}/api/public/developers?${params.toString()}`)
    expect(res.status).toBe(200)
    const body: any = await res.json()
    expect(body).toHaveProperty('items')
    expect(Array.isArray(body.items)).toBe(true)
    expect(body).toHaveProperty('total_count')
  })
})
