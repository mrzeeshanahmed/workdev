import { randomUUID } from 'crypto'

// Minimal structured logger for the backend. Uses console.log with JSON payloads
// so CI and local runs can parse easily. Exports a request-logging middleware too.
function formatEntry(level, message, meta = {}) {
  const entry = {
    ts: new Date().toISOString(),
    level,
    msg: message,
    ...meta,
  }
  return JSON.stringify(entry)
}

export function logInfo(message, meta) {
  console.log(formatEntry('info', message, meta))
}

export function logWarn(message, meta) {
  console.warn(formatEntry('warn', message, meta))
}

export function logError(message, meta) {
  console.error(formatEntry('error', message, meta))
}

// Express middleware to attach request ids and log request/response lifecycle
export function requestLogger(req, res, next) {
  // attach a request id if not present
  req.id = req.id || randomUUID()
  const start = Date.now()
  const { method, url } = req
  logInfo('req.start', { method, url, request_id: req.id })

  res.on('finish', () => {
    const duration = Date.now() - start
    logInfo('req.finish', { method, url, status: res.statusCode, duration, request_id: req.id })
  })

  next()
}

export default { logInfo, logWarn, logError, requestLogger }
