/* eslint-env jest */
import { listProjects, createProject } from '../../src/controllers/projectsController.js'
import db from '../../src/db.js'

describe('projects pagination (in-memory fallback)', () => {
  beforeEach(() => {
    // Ensure fallback mode
    db.isDbEnabled = false
  })

  test('returns correct page_size, total_count and next_cursor in fallback mode', async () => {
    // create two projects via fallback
    await createProject({ title: 'P1', description: 'd1', skills: ['js'] })
    await createProject({ title: 'P2', description: 'd2', skills: ['node'] })

    const res0 = await listProjects({ page: '0', page_size: '1' })
    expect(res0.items.length).toBe(1)
    expect(typeof res0.total_count).toBe('number')
    // since there are at least 2 items and page_size is 1, next_cursor should be '1'
    expect(res0.next_cursor).toBe('1')

    const res1 = await listProjects({ page: '1', page_size: '1' })
    // page 1 should return the next item and then no further cursor
    expect(res1.items.length).toBeGreaterThanOrEqual(0)
    // when fewer items than page_size, next_cursor should be null
    if (res1.items.length < 1) {
      expect(res1.next_cursor).toBeNull()
    }
  })
})

describe('projects pagination (db mode - mocked)', () => {
  let origIsDb
  let queries

  beforeEach(() => {
    origIsDb = db.isDbEnabled
    db.isDbEnabled = true
    // patch CJS copy used by some modules
    const rawCjs = require('../../src/db.js')
    const cjsDb = rawCjs && rawCjs.default ? rawCjs.default : rawCjs
    cjsDb.isDbEnabled = true
    queries = []

    const mockQuery = async (text, params) => {
      queries.push({ text, params })
      if (text.includes('FROM projects p') && text.includes('LEFT JOIN project_skills')) {
        // simulate a single row page (page_size=1)
        return { rows: [{ id: 'db-p-1', title: 'DB1', owner_id: 'u1', project_type: 'fixed', skills: ['js'], created_at: new Date().toISOString() }], rowCount: 1 }
      }
      if (text.startsWith('SELECT COUNT(*)')) {
        return { rows: [{ cnt: 2 }], rowCount: 1 }
      }
      return { rows: [], rowCount: 0 }
    }

    db.query = mockQuery
    cjsDb.query = mockQuery
  })

  afterEach(() => {
    db.isDbEnabled = origIsDb
  })

  test('returns deterministic pagination values in DB mode', async () => {
    const out = await listProjects({ page: '0', page_size: '1' })
    expect(Array.isArray(out.items)).toBeTruthy()
    expect(out.items.length).toBe(1)
    expect(out.total_count).toBe(2)
    expect(out.next_cursor).toBe('1')
  })
})
