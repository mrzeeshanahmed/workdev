/* eslint-env node, mocha */
import { describe, it, expect } from 'vitest'
import request from '../../../../backend/tests/helpers/request.js'

describe('POST /projects/:projectId/proposals', () => {
  it('creates a proposal and returns 201 with proposal payload', async () => {
  const payload = { developer_id: 'dev-1', cover_letter: 'I can do this', hourly_rate: 50 }
  const res = await request.post('/projects/proj-1/proposals').send(payload)
    expect(res.status).toBe(201)
  expect(res.body).toHaveProperty('id')
  expect(res.body).toHaveProperty('status')
  })
})

describe('GET /developers/:developerId/proposals', () => {
  it('returns a list of proposals for the developer', async () => {
  const res = await request.get('/developers/dev-1/proposals')
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('proposals')
    expect(Array.isArray(res.body.proposals)).toBe(true)
  // no-op: using pre-bound supertest client
  })
})
