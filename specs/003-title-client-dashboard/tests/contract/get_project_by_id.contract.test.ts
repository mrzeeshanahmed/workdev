import { describe, it } from 'vitest'
import supertest from 'supertest'

const BASE = process.env.CONTRACT_BASE_URL
if (!BASE) {
  console.warn('CONTRACT_BASE_URL not set — skipping get_project_by_id contract test')
}

describe('GET /api/projects/:projectId (contract)', () => {
  it('returns 200 with project shape', async () => {
    if (!BASE) return
    // Use a placeholder id; the dev-server should respond with 200 for existing sample projects
    const projectId = 'example-project-id'
    const res = await supertest(BASE).get(`/api/projects/${projectId}`)
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`)
    const body = res.body
    if (!body.id || !body.title) throw new Error('Missing id or title in project response')
  })
})
