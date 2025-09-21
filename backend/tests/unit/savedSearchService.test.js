/* eslint-env node, mocha */
import { describe, it, beforeEach, expect } from 'vitest'
import store from '../../src/stores/inMemoryStore.js'
import * as savedSearchService from '../../src/services/savedSearchService.js'

describe('savedSearchService', () => {
  beforeEach(() => {
    // reset store
    for (const k of Object.keys(store.savedSearches)) delete store.savedSearches[k]
  })

  it('creates and lists saved searches', () => {
    const s = savedSearchService.createSavedSearch({ developerId: 'dev1', name: 'foo', query: 'lang:js' })
    expect(s).toHaveProperty('id')
    const all = savedSearchService.listSavedSearches({ developerId: 'dev1' })
    expect(all.length).toBe(1)
    expect(all[0].id).toBe(s.id)
  })

  it('deletes saved search', () => {
    const s = savedSearchService.createSavedSearch({ developerId: 'dev-delete', name: 'todel', query: 'x' })
    const ok = savedSearchService.deleteSavedSearch({ id: s.id })
    expect(ok).toBe(true)
    const all = savedSearchService.listSavedSearches({ developerId: 'dev-delete' })
    expect(all.length).toBe(0)
  })

  it('throws on missing params', () => {
    expect(() => savedSearchService.createSavedSearch({})).toThrow()
    expect(() => savedSearchService.deleteSavedSearch({})).toThrow()
  })
})
