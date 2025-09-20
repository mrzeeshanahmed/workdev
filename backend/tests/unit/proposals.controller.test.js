/* eslint-env jest */
const { createProposal, acceptProposal } = require('../../src/controllers/proposalsController')

describe('proposalsController (unit)', ()=>{
  test('createProposal validation fails without payload', async ()=>{
    await expect(createProposal('p1', null)).rejects.toMatchObject({ message: 'validation', status: 400 })
  })

  test('createProposal returns fallback proposal when DB disabled', async ()=>{
    const p = await createProposal('project-1', { cover_letter: 'hi', proposer_id: 'u1' })
    expect(p).toHaveProperty('id')
    expect(p.project_id).toBe('project-1')
    expect(p.proposer_id).toBe('u1')
  })

  test('acceptProposal returns accepted object in fallback', async ()=>{
    const accepted = await acceptProposal('project-1', 'prop-1', 'owner-1')
    expect(accepted).toHaveProperty('status', 'accepted')
    expect(accepted).toHaveProperty('id', 'prop-1')
  })
})
