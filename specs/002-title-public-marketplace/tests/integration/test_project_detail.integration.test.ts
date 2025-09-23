import { describe, it, expect } from 'vitest'
import fetch from 'node-fetch'

const BASE = process.env.FUNCTIONS_BASE_URL || ''
const shouldSkip = !BASE

describe('Integration: Project detail', () => {
  it('skips when FUNCTIONS_BASE_URL not set', () => {
    if (shouldSkip) {
      expect(shouldSkip).toBeTruthy()
      return
    }
  })

  it('returns full project detail for an existing project', async () => {
    if (shouldSkip) return
    // Fetch list first to obtain an id
    const listRes = await fetch(`${BASE}/api/public/projects?page_size=1`)
    expect(listRes.status).toBe(200)
    const listBody: any = await listRes.json()
    if (!Array.isArray(listBody.items) || listBody.items.length === 0) {
      // No projects to test against — consider this test a noop but not a failure
      expect(listBody.items.length).toBe(0)
      return
    }
    const id = listBody.items[0].id
    const res = await fetch(`${BASE}/api/public/projects/${id}`)
    expect(res.status).toBe(200)
    const body: any = await res.json()
    expect(body).toHaveProperty('id')
    expect(body).toHaveProperty('title')
    expect(body).toHaveProperty('description')
  })
})
