import { describe, it, expect } from 'vitest'
import { createSavedSearch, validateSavedSearch } from '../../src/models/savedSearch.js'

describe('SavedSearch model', () => {
  it('creates and validates a saved search', () => {
    const ss = createSavedSearch({ id: 's1', developer_id: 'd1', name: 'Find APIs', criteria: { skills: ['Node', 'Express'] } })
    expect(validateSavedSearch(ss)).toBe(true)
    expect(Array.isArray(ss.criteria.skills)).toBe(true)
  })
})
