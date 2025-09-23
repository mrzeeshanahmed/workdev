import { describe, it, expect } from 'vitest'
import * as ms from '../../../../backend/src/services/milestonesService.js'

describe('milestonesService (spec-run)', () => {
  it('create -> submit -> requestRevision -> approve', async () => {
    const rec = await ms.createMilestone({ workspaceId: '00000000-0000-0000-0000-000000000000', title: 'spec svc', description: 'desc', createdBy: null })
    expect(rec).toBeTruthy()
    const id = rec.id || rec.milestoneId
    const upd = await ms.updateMilestone({ id, title: 'updated', description: 'x' })
    expect(upd).toBeTruthy()
    const sub = await ms.submitMilestone(id)
    expect(sub).toBeTruthy()
    const rev = await ms.requestRevision(id, 'fix')
    expect(rev).toBeTruthy()
    const app = await ms.approveMilestone(id)
    expect(app).toBeTruthy()
  })
})
