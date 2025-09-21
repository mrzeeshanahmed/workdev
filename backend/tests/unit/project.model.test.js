import { describe, it, expect } from 'vitest'
import { createProject, validateProject } from '../../src/models/project.js'

describe('Project model', () => {
  it('creates and validates a project', () => {
    const p = createProject({ id: 'p1', client_id: 'c1', title: 'Test' })
    expect(validateProject(p)).toBe(true)
    expect(p.required_skills).toBeInstanceOf(Array)
  })
})
