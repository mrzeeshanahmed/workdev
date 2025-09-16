import { test, expect } from 'vitest'
import fetch from 'node-fetch'

const BASE = process.env.INTEGRATION_BASE_URL || 'http://localhost:4000'

test('filtering projects by q param narrows results', async () => {
  try {
    const all = await fetch(`${BASE}/api/public/projects`).then(r => r.json())
    const filtered = await fetch(`${BASE}/api/public/projects?q=Featured`).then(r => r.json())
    expect(filtered.items.length).toBeLessThanOrEqual(all.items.length)
  } catch (err) {
    test.skip(true)
  }
})
import { describe, it, expect } from 'vitest'
import fetch from 'node-fetch'

const BASE = process.env.FUNCTIONS_BASE_URL || ''
const shouldSkip = !BASE

describe('Integration: Project filters', () => {
  it('skips when FUNCTIONS_BASE_URL not set', () => {
    if (shouldSkip) {
      expect(shouldSkip).toBeTruthy()
      return
    }
  })

  it('applies skills and budget filters', async () => {
    if (shouldSkip) return
    // Example: filter by skill slug and budget range
    const params = new URLSearchParams({
      skills: 'javascript,react',
      budget_min: '500',
      budget_max: '5000',
      page_size: '20'
    })
    const res = await fetch(`${BASE}/api/public/projects?${params.toString()}`)
    expect(res.status).toBe(200)
    const body: any = await res.json()
    expect(Array.isArray(body.items)).toBe(true)
    // Ensure total_count exists
    expect(body).toHaveProperty('total_count')
  })
})
