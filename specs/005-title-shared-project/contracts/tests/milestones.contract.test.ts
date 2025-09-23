import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import fetch from 'node-fetch'
import app from '../../../../backend/src/app.js'

let server: any
let PORT: number
beforeAll(async () => {
  // Listen on an ephemeral port to avoid collisions when tests run in parallel
  await new Promise<void>((resolve) => {
    server = app.listen(0, () => {
      // Read the actually assigned port and use it for requests
      const addr = server.address()
      PORT = (addr && (addr as any).port) || 0
      resolve()
    })
  })
})
afterAll(() => {
  server && server.close()
})

// Contract test: attempts to POST to the milestones create endpoint and
// assert the response follows the contract. This test should FAIL until
// the API is implemented (TDD - red first).
describe('Milestones contract', () => {
  it('POST /api/workspaces/:workspaceId/milestones should return 201 and milestone shape', async () => {
    const workspaceId = '00000000-0000-0000-0000-000000000000'
  const url = `http://localhost:${PORT}/api/workspaces/${workspaceId}/milestones`

    const payload = {
      title: 'Contract test milestone',
      description: 'This is a contract test payload',
      dueDate: '2025-10-01',
      amount: 0
    }

    // Try to call the running API. If it's not available, the test will fail
    // which is intended for TDD.
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body).toHaveProperty('milestoneId')
    expect(body).toHaveProperty('state')
  })
})
