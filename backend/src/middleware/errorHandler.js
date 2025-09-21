import { logError } from '../utils/logger.js'

export function errorHandler(err, req, res, _next) {
  // Normalize error shape
  const code = err && err.code ? err.code : 'INTERNAL'
  const status = err && err.status ? err.status : (code === 'NOT_FOUND' ? 404 : 500)

  // Log error with request id if available
  logError('handler.error', { error: err && err.message ? err.message : String(err), code, request_id: req?.id })

  // Safe JSON response for clients
  res.status(status).json({ error: err && err.clientMessage ? err.clientMessage : (code === 'NOT_FOUND' ? 'not found' : 'server error') })
}

export default errorHandler
