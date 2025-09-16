import { describe, it, expect } from 'vitest'
import { SkillModel } from '../../src/models/skill'

const makeDb = (rows: any[]) => ({ query: async () => ({ rows }) })

describe('SkillModel', () => {
  it('findAll returns list', async () => {
    const db = makeDb([{ id: 's1', name: 'js', slug: 'js' }])
    const rows = await SkillModel.findAll(db as any)
    expect(rows).toHaveLength(1)
    expect(rows[0].slug).toBe('js')
  })

  it('findById returns first or null', async () => {
    const db = makeDb([{ id: 's1', name: 'py', slug: 'py' }])
    const row = await SkillModel.findById(db as any, 's1')
    expect(row).not.toBeNull()
    expect(row.slug).toBe('py')
  })
})
