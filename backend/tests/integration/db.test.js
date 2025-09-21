import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import request from 'supertest'
import app from '../../src/app.js'

describe('integration: in-memory DB flows', () => {
  let consoleSpy

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleSpy.mockRestore()
  })

  it('submit proposal then list it for developer', async () => {
    // submit proposal for seeded project 'proj-1' and developer 'dev-1'
    const payload = { developer_id: 'dev-1', cover_letter: 'I can do this', hourly_rate: 50 }
    const postRes = await request(app).post('/projects/proj-1/proposals').send(payload)
    expect(postRes.status).toBe(201)
    expect(postRes.body).toHaveProperty('id')

    const listRes = await request(app).get('/developers/dev-1/proposals')
    expect(listRes.status).toBe(200)
    expect(Array.isArray(listRes.body.proposals)).toBe(true)
    // at least one proposal with our project id
    const found = listRes.body.proposals.find(p => p.project_id === 'proj-1')
    expect(found).toBeTruthy()
  })

  it('create saved search and emits notification (skeleton)', async () => {
    const payload = { name: 'match-me', criteria: { skills: ['node'] }, notification_cadence: 'daily' }
    const postRes = await request(app).post('/developers/dev-1/saved-searches').send(payload)
    expect(postRes.status).toBe(201)
    expect(postRes.body).toHaveProperty('id')

    // saved search created; notification service logs a message in MVP
    // allow some time if async, but our notification is synchronous
    expect(consoleSpy).toHaveBeenCalled()
    const calledWith = consoleSpy.mock.calls.map(args => args.join(' ')).join('\n')
    expect(calledWith).toContain("Saved search 'match-me' created")

    const getRes = await request(app).get('/developers/dev-1/saved-searches')
    expect(getRes.status).toBe(200)
    expect(Array.isArray(getRes.body.saved_searches)).toBe(true)
    const saved = getRes.body.saved_searches.find(s => s.name === 'match-me')
    expect(saved).toBeTruthy()
  })
})
