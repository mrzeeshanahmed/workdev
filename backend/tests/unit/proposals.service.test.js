import { describe, it, expect, beforeEach } from 'vitest'
import store from '../../src/stores/inMemoryStore.js'
import * as proposalsService from '../../src/services/proposalsService.js'

describe('proposalsService', () => {
  beforeEach(() => {
    // reset in-memory stores
    store.proposals.clear()
    store.projects.clear()
    store.developers.clear()
    store.analytics.clear()

    // seed a developer and a project
    store.developers.set('dev-1', { id: 'dev-1', display_name: 'Dev One' })
    store.projects.set('proj-1', { id: 'proj-1', title: 'Build API' })
  })

  it('submits a proposal and is listed for developer', async () => {
    const rec = await proposalsService.submitProposal({ projectId: 'proj-1', developerId: 'dev-1', cover_letter: 'Here' })
    expect(rec).toHaveProperty('id')
    const list = await proposalsService.listProposals({ developerId: 'dev-1' })
    expect(list.length).toBe(1)
    expect(list[0].id).toBe(rec.id)
  })

  it('throws on missing params', async () => {
    await expect(proposalsService.submitProposal({})).rejects.toThrow()
  })

  it('throws NOT_FOUND when project is missing', async () => {
    await expect(proposalsService.submitProposal({ projectId: 'nope', developerId: 'dev-1', cover_letter: 'x' })).rejects.toHaveProperty('code', 'NOT_FOUND')
  })

  it('throws FORBIDDEN when developer is missing', async () => {
    // remove developer
    store.developers.clear()
    await expect(proposalsService.submitProposal({ projectId: 'proj-1', developerId: 'dev-2', cover_letter: 'x' })).rejects.toHaveProperty('code', 'FORBIDDEN')
  })
})
