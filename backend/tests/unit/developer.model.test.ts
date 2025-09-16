import { describe, it, expect } from 'vitest'
import { DeveloperProfileModel } from '../../src/models/developerProfile'

const makeDb = (rows: any[]) => ({ query: async () => ({ rows }) })

describe('DeveloperProfileModel', () => {
  it('search returns matching rows', async () => {
    const db = makeDb([{ id: 'd1', display_name: 'Ada', headline: 'Dev' }])
    const rows = await DeveloperProfileModel.search(db as any, 'Ada')
    expect(rows).toHaveLength(1)
    expect(rows[0].display_name).toBe('Ada')
  })

  it('findById returns row', async () => {
    const db = makeDb([{ id: 'd2', display_name: 'Grace' }])
    const row = await DeveloperProfileModel.findById(db as any, 'd2')
    expect(row).not.toBeNull()
    expect(row.display_name).toBe('Grace')
  })
})
