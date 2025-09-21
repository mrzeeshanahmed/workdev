import { describe, it, expect } from 'vitest'
import { createProposal, validateProposal } from '../../src/models/proposal.js'

describe('Proposal model', () => {
  it('creates and validates a proposal', () => {
    const prop = createProposal({ id: 'pr1', developer_id: 'd1', project_id: 'p1', cover_letter: 'ok' })
    expect(validateProposal(prop)).toBe(true)
    expect(prop.status).toBe('submitted')
  })
})
