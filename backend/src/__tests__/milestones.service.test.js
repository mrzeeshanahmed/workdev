import { describe, it, expect } from 'vitest'
import * as ms from '../services/milestonesService.js'

describe('milestonesService direct', () => {
  it('create, update, submit, requestRevision, approve', async () => {
    const rec = await ms.createMilestone({ workspaceId: '00000000-0000-0000-0000-000000000000', title: 'svc test', description: 'desc', createdBy: null })
    expect(rec).toBeTruthy()
    const id = rec.id || rec.milestoneId

    const updated = await ms.updateMilestone({ id, title: 'svc test updated', description: 'x' })
    expect(updated).toBeTruthy()

    const sub = await ms.submitMilestone(id)
    expect(sub).toBeTruthy()

    const rev = await ms.requestRevision(id, 'change')
    expect(rev).toBeTruthy()

    const app = await ms.approveMilestone(id)
    expect(app).toBeTruthy()
  })
})
