import { describe, it, expect } from 'vitest'

// lightweight in-memory mock for db.query
const makeDb = (rows: any[]) => ({ query: async () => ({ rows }) })

import { ProjectModel } from '../../src/models/project'

describe('ProjectModel', () => {
  it('list returns rows from db', async () => {
    const db = makeDb([{ id: '1', title: 'X' }])
    const rows = await ProjectModel.list(db as any, { limit: 10, offset: 0 })
    expect(rows).toHaveLength(1)
    expect(rows[0].title).toBe('X')
  })

  it('findById returns single row or null', async () => {
    const db = makeDb([{ id: '1', title: 'One' }])
    const row = await ProjectModel.findById(db as any, '1')
    expect(row).not.toBeNull()
    expect(row.title).toBe('One')
  })
})
