import { describe, it } from 'vitest'
import supertest from 'supertest'

const BASE = process.env.CONTRACT_BASE_URL
if (!BASE) {
  console.warn('CONTRACT_BASE_URL not set — skipping post_project contract test')
}

describe('POST /api/projects (contract)', () => {
  it('creates a project and returns 201 with project shape', async () => {
    if (!BASE) return
    const payload = {
      owner_id: '00000000-0000-0000-0000-000000000001',
      title: 'Contract test project',
      description: 'Created by contract test',
      type: 'fixed',
      budget_min: 1000,
      budget_max: 2000,
      skills: ['javascript','react']
    }
    const res = await supertest(BASE).post('/api/projects').send(payload)
    if (res.status !== 201) throw new Error(`Expected 201, got ${res.status} - ${res.text}`)
    const body = res.body
    if (!body.id || !body.owner_id) throw new Error('Missing id or owner_id in response')
  })
})
