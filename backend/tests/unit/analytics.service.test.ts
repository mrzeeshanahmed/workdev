import { describe, it, expect } from 'vitest'
const analytics = require('../../src/services/analyticsService')

describe('analyticsService', () => {
  it('exposes emit and does not throw', () => {
    expect(typeof analytics.emit).toBe('function')
    expect(() => analytics.emit('test.event', { a: 1 })).not.toThrow()
  })
})
