/* eslint-env node, mocha */
import { describe, it, expect } from 'vitest'
import request from '../../../../backend/tests/helpers/request.js'

describe('Saved Searches API', () => {
  it('creates a saved search and returns 201', async () => {
  const payload = { name: 'My Search', criteria: { keywords: 'api', skills: ['node'] }, notification_cadence: 'daily' }
  const res = await request.post('/developers/dev-1/saved-searches').send(payload)
  expect(res.status).toBe(201)
  expect(res.body).toHaveProperty('id')
  })

  it('lists saved searches', async () => {
  const res = await request.get('/developers/dev-1/saved-searches')
  expect(res.status).toBe(200)
  expect(res.body).toHaveProperty('saved_searches')
  })

  it('deletes a saved search', async () => {
  // create one
  const payload = { name: 'ToDelete', criteria: { keywords: 'x' } }
  const create = await request.post('/developers/dev-1/saved-searches').send(payload)
    expect(create.status).toBe(201)
    const id = create.body.id
  const del = await request.delete(`/developers/dev-1/saved-searches/${id}`)
    expect(del.status).toBe(204)
  // no-op: using pre-bound supertest client
  })
})
