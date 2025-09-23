import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { spawn } from 'child_process'

let serverProc: any
const PORT = 3000
const BASE = `http://localhost:${PORT}`
const workspaceId = '00000000-0000-0000-0000-000000000000'

function startServer() {
  serverProc = spawn(process.execPath, ['backend/start-app.cjs'], { cwd: process.cwd(), env: { ...process.env, PORT: String(PORT) }, stdio: ['ignore', 'pipe', 'pipe'] })
  return new Promise<void>((resolve, reject) => {
    const onData = (chunk: any) => {
      const s = chunk.toString()
      if (s.includes('Started app on') || s.includes('Server listening on')) {
        serverProc.stdout.off('data', onData)
        resolve()
      }
    }
    serverProc.stdout.on('data', onData)
    serverProc.stderr.on('data', (c) => { /* swallow */ })
    serverProc.on('error', reject)
    setTimeout(() => reject(new Error('server start timeout')), 4000)
  })
}

function stopServer() {
  if (serverProc) serverProc.kill()
}

describe('E2E quickstart: workspace milestones', () => {
  beforeAll(async () => { await startServer() })
  afterAll(() => { stopServer() })

  it('run quickstart flow (create -> submit -> approve)', async () => {
    const createRes = await fetch(`${BASE}/api/workspaces/${workspaceId}/milestones`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: 'E2E Milestone', description: 'quickstart' }) })
    expect(createRes.status).toBe(201)
    const cr = await createRes.json()
    const id = cr.milestoneId || cr.id

    const submitRes = await fetch(`${BASE}/api/workspaces/${workspaceId}/milestones/${id}/submit`, { method: 'POST' })
    expect(submitRes.status).toBe(200)
    const sj = await submitRes.json()
    expect(sj.state).toBe('Submitted')

    const approveRes = await fetch(`${BASE}/api/workspaces/${workspaceId}/milestones/${id}/approve`, { method: 'POST' })
    expect(approveRes.status).toBe(200)
    const aj = await approveRes.json()
    expect(aj.state).toBe('Approved')
  })
})
