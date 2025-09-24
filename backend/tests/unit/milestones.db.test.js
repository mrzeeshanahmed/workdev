import { expect, it, beforeEach, afterEach } from 'vitest'
import * as milestonesService from '../../../backend/src/services/milestonesService.js'
import db from '../../../backend/src/db.js'

let origIsDb
let queries = []

beforeEach(() => {
  origIsDb = db.isDbEnabled
  // enable DB mode for tests
  db.isDbEnabled = true
  queries = []
  // mock query
  db.query = async (text, params) => {
    queries.push({ text, params })
    if (text.startsWith('INSERT INTO milestones')) {
      return { rows: [{ id: 'db-m-1', state: 'Draft' }], rowCount: 1 }
    }
    if (text.startsWith('SELECT * FROM milestones WHERE id')) {
      return { rows: [{ id: params[0], title: 'T', state: 'Draft' }], rowCount: 1 }
    }
    if (text.startsWith('UPDATE milestones')) {
      return { rows: [{ id: params[0], state: 'Submitted' }], rowCount: 1 }
    }
    return { rows: [], rowCount: 0 }
  }
})

afterEach(() => {
  db.isDbEnabled = origIsDb
})

it('creates milestone using DB when enabled', async () => {
  const out = await milestonesService.createMilestone({ workspaceId: 'w1', title: 'Hello', description: 'desc', dueDate: null, amount: null, createdBy: 'u1' })
  expect(out).toHaveProperty('milestoneId', 'db-m-1')
  expect(queries.some(q => q.text.includes('INSERT INTO milestones'))).toBeTruthy()
})
