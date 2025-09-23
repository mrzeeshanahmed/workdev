import nodeFetch from 'node-fetch'
import { describe, test, beforeAll, afterAll, expect } from 'vitest'

describe('happy-path create project -> submit proposal', ()=>{
  /** @type {string} */
  let base = ''
  let startIfNeeded
  let stop
  beforeAll(async ()=>{
    const mod = await import('../../../test-helpers/devServerSetup.js')
    startIfNeeded = mod.startIfNeeded
    stop = mod.stop
    const info = await startIfNeeded()
    base = info.urlBase || info.baseUrl || 'http://localhost:4000'
  }, 20000)

  afterAll(async ()=>{ if (stop) await stop() })

  test('create project and submit proposal', async ()=>{
    const fetch = nodeFetch
    const projectPayload = { title: 'E2E Project', description: 'E2E description', skills: ['js'], budget_min: 100, budget_max: 200 }
    const res = await fetch(base + '/api/projects', { method: 'POST', body: JSON.stringify(projectPayload), headers: { 'Content-Type':'application/json', 'x-user-id':'e2e-user' } })
    expect(res.status).toBe(201)
    const project = await res.json()
    expect(project.id).toBeTruthy()

    // submit proposal
    const proposal = { applicant_name: 'Eve', cover_letter: 'I can do this', bid: 150 }
    const pres = await fetch(base + '/api/projects/' + project.id + '/proposals', { method: 'POST', body: JSON.stringify(proposal), headers: { 'Content-Type':'application/json', 'x-user-id':'freelancer' } })
    expect(pres.status).toBe(201)
    const p = await pres.json()
    expect(p.id).toBeTruthy()

    // accept the proposal
    const ares = await fetch(base + '/api/projects/' + project.id + '/proposals/' + p.id + '/accept', { method: 'PATCH', headers: { 'x-user-id': 'owner' } })
    expect(ares.status).toBe(200)
    const accepted = await ares.json()
    expect(accepted.status === 'accepted' || accepted.status === 'in_progress' || accepted.accepted_at).toBeTruthy()
  }, 20000)
})
import nodeFetch from 'node-fetch'
import { describe, test, beforeAll, afterAll, expect } from 'vitest'

const { startIfNeeded, stop } = await import('../../../test-helpers/devServerSetup.js')

describe('happy-path create project -> submit proposal', ()=>{
  /** @type {string} */
  let base = ''
  beforeAll(async ()=>{
    const info = await startIfNeeded()
    base = info.urlBase
  }, 20000)

  afterAll(async ()=>{ await stop() })

  test('create project and submit proposal', async ()=>{
    const fetch = nodeFetch
    const projectPayload = { title: 'E2E Project', description: 'E2E description', skills: ['js'], budget_min: 100, budget_max: 200 }
    const res = await fetch(base + '/api/projects', { method: 'POST', body: JSON.stringify(projectPayload), headers: { 'Content-Type':'application/json', 'x-user-id':'e2e-user' } })
    expect(res.status).toBe(201)
    const project = await res.json()
    expect(project.id).toBeTruthy()

    // submit proposal
    const proposal = { applicant_name: 'Eve', cover_letter: 'I can do this', bid: 150 }
    const pres = await fetch(base + '/api/projects/' + project.id + '/proposals', { method: 'POST', body: JSON.stringify(proposal), headers: { 'Content-Type':'application/json', 'x-user-id':'freelancer' } })
    expect(pres.status).toBe(201)
  const p = await pres.json()
  expect(p.id).toBeTruthy()

  // accept the proposal
  const ares = await fetch(base + '/api/projects/' + project.id + '/proposals/' + p.id + '/accept', { method: 'PATCH', headers: { 'x-user-id': 'owner' } })
  expect(ares.status).toBe(200)
  const accepted = await ares.json()
  expect(accepted.status === 'accepted' || accepted.status === 'in_progress' || accepted.accepted_at).toBeTruthy()
  }, 20000)
})
// Note: older supertest-based integration block removed in favor of the startIfNeeded-based test above.
