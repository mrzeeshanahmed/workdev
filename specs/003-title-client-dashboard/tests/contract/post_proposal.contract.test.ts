import { describe, it } from 'vitest'
import supertest from 'supertest'

const BASE = process.env.CONTRACT_BASE_URL
if (!BASE) {
  console.warn('CONTRACT_BASE_URL not set — skipping post_proposal contract test')
}

describe('POST /api/projects/:projectId/proposals (contract)', () => {
  it('creates a proposal and returns 201 with proposal shape', async () => {
    if (!BASE) return
    const projectId = 'example-project-id'
    const res = await supertest(BASE).post(`/api/projects/${projectId}/proposals`).send({
      cover_letter: 'I can do this work',
      amount: 1000
    })
    if (res.status !== 201) throw new Error(`Expected 201, got ${res.status}`)
    const body = res.body
    if (!body.id || !body.project_id) throw new Error('Missing id or project_id in proposal response')
  })
})
