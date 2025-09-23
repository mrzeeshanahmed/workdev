import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import fetch from 'node-fetch'
import app from '../../../../backend/src/app.js'

let server: any
let PORT: number
beforeAll(async () => {
  await new Promise<void>((resolve) => {
    server = app.listen(0, () => {
      const addr = server.address()
      PORT = (addr && (addr as any).port) || 0
      resolve()
    })
  })
})
afterAll(() => {
  server && server.close()
})

// Integration test: quickstart scenario (create workspace → create milestone → submit → approve)
describe('Milestones integration (quickstart)', () => {
  it('runs the quickstart scenario end-to-end (will fail until API exists)', async () => {
    const workspaceId = '00000000-0000-0000-0000-000000000000'
    // Create milestone
  const createRes = await fetch(`http://localhost:${PORT}/api/workspaces/${workspaceId}/milestones`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Integration milestone', description: 'Integration test', dueDate: '2025-10-01' })
    })
    expect(createRes.status).toBe(201)
  const created = await createRes.json()
  expect(created).toHaveProperty('milestoneId')

  const milestoneId = (created as any).milestoneId

    // Submit milestone
  const submitRes = await fetch(`http://localhost:${PORT}/api/workspaces/${workspaceId}/milestones/${milestoneId}/submit`, {
      method: 'POST'
    })
    expect(submitRes.status).toBe(200)

    // Approve milestone
  const approveRes = await fetch(`http://localhost:${PORT}/api/workspaces/${workspaceId}/milestones/${milestoneId}/approve`, {
      method: 'POST'
    })
    expect(approveRes.status).toBe(200)
  })
})
