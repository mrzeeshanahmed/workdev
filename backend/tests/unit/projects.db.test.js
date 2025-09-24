import { expect, it, beforeEach, afterEach, describe } from 'vitest'
import * as projectsController from '../../../backend/src/controllers/projectsController.js'
import db from '../../../backend/src/db.js'

let origIsDb
let queries = []

beforeEach(() => {
  origIsDb = db.isDbEnabled
  db.isDbEnabled = true
  queries = []
  db.query = async (text, params) => {
    queries.push({ text, params })
    // simple routing for INSERT/SELECT used by controller
    if (text.startsWith('INSERT INTO projects')) {
      return { rows: [{ id: 'db-p-1', title: params[1], owner_id: params[0], project_type: params[4], created_at: new Date().toISOString() }], rowCount: 1 }
    }
    if (text.includes('FROM projects p') && text.includes('LEFT JOIN project_skills')) {
      // return a single paged row with aggregated skills
      return { rows: [{ id: 'db-p-1', title: 'T', owner_id: 'u-1', project_type: 'fixed', skills: ['js','react'], created_at: new Date().toISOString() }], rowCount: 1 }
    }
    if (text.startsWith('SELECT COUNT(*)')) {
      return { rows: [{ cnt: 1 }], rowCount: 1 }
    }
    if (text.includes('FROM projects p WHERE p.id =')) {
      return { rows: [{ id: params[0], title: 'T', owner_id: 'u-1', project_type: 'fixed', skills: ['js'] }], rowCount: 1 }
    }
    return { rows: [], rowCount: 0 }
  }
})

afterEach(() => {
  db.isDbEnabled = origIsDb
})

describe('projects controller (db mode)', () => {
  it('createProject persists owner_id and project_type', async () => {
    const payload = { owner_id: 'u-1', title: 'T', project_type: 'hourly', budget_min: 100 }
    const out = await projectsController.createProject(payload)
    expect(out).toHaveProperty('id')
    // last INSERT params should contain owner_id and project_type
    const ins = queries.find(q => q.text.startsWith('INSERT INTO projects'))
    expect(ins).toBeDefined()
    expect(ins.params[0]).toBe('u-1')
    expect(ins.params[4]).toBe('hourly')
  })

  it('listProjects returns paginated items and total_count', async () => {
    const out = await projectsController.listProjects({ page: '0', page_size: '10' })
    expect(out).toHaveProperty('items')
    expect(Array.isArray(out.items)).toBeTruthy()
    expect(out).toHaveProperty('total_count')
  })
})
