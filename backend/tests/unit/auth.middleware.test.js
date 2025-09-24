/* eslint-env vitest */
/* global describe,test,expect,vi */
const { requireAuth, optionalAuth } = require('../../src/middleware/auth')
// Vitest globals (describe, test, expect, vi) are enabled via backend/vitest.config.ts
// so we don't import 'vitest' here (importing Vitest in CommonJS test causes runtime error).
// Use global `vi` for mocks.
const jwt = require('jsonwebtoken')

describe('auth middleware (unit)', () => {
  const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'

  test('verify token and set req.user in requireAuth', () => {
    const token = jwt.sign({}, JWT_SECRET, { subject: 'u123', expiresIn: '1h' })
    const req = { headers: { authorization: `Bearer ${token}` }, body: {} }
  const json = vi.fn()
  const res = { status: () => ({ json }) }
  const next = vi.fn()
    requireAuth(req, res, next)
    expect(req.user).toBeDefined()
    expect(req.user.id).toBe('u123')
    expect(next).toHaveBeenCalled()
  })

  test('optionalAuth attaches user when token present', () => {
    const token = jwt.sign({}, JWT_SECRET, { subject: 'u456', expiresIn: '1h' })
    const req = { headers: { authorization: `Bearer ${token}` }, body: {} }
    const res = {}
    const next = vi.fn()
    optionalAuth(req, res, next)
    expect(req.user).toBeDefined()
    expect(req.user.id).toBe('u456')
    expect(next).toHaveBeenCalled()
  })

  test('requireAuth fails without token', () => {
    const req = { headers: {}, body: {} }
    const json = vi.fn()
    const res = { status: () => ({ json }) }
    const next = vi.fn()
    requireAuth(req, res, next)
    expect(json).toHaveBeenCalledWith({ error: 'unauthorized' })
    expect(next).not.toHaveBeenCalled()
  })
})
