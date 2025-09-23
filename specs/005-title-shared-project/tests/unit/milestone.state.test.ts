import { spawn } from 'child_process'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

const BASE = 'http://localhost:3000'
let serverProc: any

function startServer() {
  serverProc = spawn(process.execPath, ['backend/start-app.cjs'], { cwd: process.cwd(), stdio: ['ignore', 'pipe', 'pipe'] })
  return new Promise<void>((resolve, reject) => {
    const onData = (chunk: any) => {
      const s = chunk.toString()
      if (s.includes('Started app on') || s.includes('Server listening on')) {
        serverProc.stdout.off('data', onData)
        resolve()
      }
    }
    serverProc.stdout.on('data', onData)
    serverProc.on('error', reject)
    setTimeout(() => reject(new Error('server start timeout')), 3000)
  })
}

function stopServer() {
  if (serverProc) {
    serverProc.kill()
  }
}

describe('Milestone state transitions (unit-style)', () => {
  beforeAll(async () => { await startServer() })
  afterAll(() => { stopServer() })

  it('creates -> submits -> approves a milestone', async () => {
    const workspaceId = '00000000-0000-0000-0000-000000000000'
    const createRes = await fetch(`${BASE}/api/workspaces/${workspaceId}/milestones`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: 'UT Milestone', description: 'unit test' }) })
    expect(createRes.status).toBe(201)
    const cr = await createRes.json()
    const id = cr.milestoneId || cr.id

    // Submit
    const submitRes = await fetch(`${BASE}/api/workspaces/${workspaceId}/milestones/${id}/submit`, { method: 'POST' })
    expect(submitRes.status).toBe(200)
    const sj = await submitRes.json()
    expect(sj.state).toBe('Submitted')

    // Request revision
    const revRes = await fetch(`${BASE}/api/workspaces/${workspaceId}/milestones/${id}/request-revision`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ reason: 'Needs changes' }) })
    expect(revRes.status).toBe(200)
    const rj = await revRes.json()
    expect(rj.state).toBe('RevisionRequested')

    // Approve should move to Approved
    const approveRes = await fetch(`${BASE}/api/workspaces/${workspaceId}/milestones/${id}/approve`, { method: 'POST' })
    expect(approveRes.status).toBe(200)
    const aj = await approveRes.json()
    expect(aj.state).toBe('Approved')
  })
})
import { describe, it, expect } from 'vitest'
import * as ms from '../../../../backend/src/services/milestonesService.js'

describe('Milestone state machine', () => {
  it('allows Draft -> Submitted -> Approved', async () => {
    const created = await ms.createMilestone({ workspaceId: '00000000-0000-0000-0000-000000000000', title: 's', description: 'd' })
    expect(created.state).toBe('Draft')
    const sub = await ms.submitMilestone(created.id)
    expect(sub.state).toBe('Submitted')
    const app = await ms.approveMilestone(created.id)
    expect(app.state).toBe('Approved')
  })
})
