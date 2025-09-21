import { describe, it, expect } from 'vitest'
import { createDeveloper, validateDeveloper } from '../../src/models/developer.js'

describe('Developer model', () => {
  it('creates and validates a developer', () => {
    const dev = createDeveloper({ id: 'd1', user_id: 'u1', display_name: 'Alice' })
    expect(validateDeveloper(dev)).toBe(true)
    expect(dev.skills).toBeInstanceOf(Array)
  })
})
