import { describe, it, expect } from 'vitest'
import { errorHandler } from '../../src/middleware/errorHandler.js'

function mockRes() {
  const res = {}
  res.statusCode = 200
  res._body = null
  res.status = function (code) { this.statusCode = code; return this }
  res.json = function (obj) { this._body = obj; return this }
  return res
}

describe('errorHandler', () => {
  it('returns 404 for NOT_FOUND code and normalized message', () => {
    const req = { id: 'req-1' }
    const res = mockRes()
    const err = { code: 'NOT_FOUND', message: 'missing item', clientMessage: 'not found' }
  function _next() { return undefined }
    errorHandler(err, req, res, _next)
    expect(res.statusCode).toBe(404)
    expect(res._body).toEqual({ error: 'not found' })
  })

  it('returns 500 and generic message for unknown error', () => {
    const req = { id: 'req-2' }
    const res = mockRes()
    const err = new Error('boom')
  function _next() { return undefined }
    errorHandler(err, req, res, _next)
    expect(res.statusCode).toBe(500)
    expect(res._body).toEqual({ error: 'server error' })
  })
})
