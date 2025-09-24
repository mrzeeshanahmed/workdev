import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'
// In local development, allow bypass if DEV_AUTH_BYPASS is set to '1'
const DEV_BYPASS = process.env.DEV_AUTH_BYPASS === '1'

function parseAuthHeader(header) {
  if (!header) return null
  const parts = String(header).split(' ')
  if (parts.length === 2 && parts[0].toLowerCase() === 'bearer') return parts[1]
  return null
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (e) {
    return null
  }
}

export function requireAuth(req, res, next) {
  // allow bypass in local dev if env flag set
  if (DEV_BYPASS && (req.headers['x-user-id'] || req.body.owner_id)) {
    req.user = { id: req.headers['x-user-id'] || req.body.owner_id }
    return next()
  }
  const token = parseAuthHeader(req.headers['authorization'])
  if (!token) return res.status(401).json({ error: 'unauthorized' })
  const payload = verifyToken(token)
  if (!payload || !payload.sub) return res.status(401).json({ error: 'unauthorized' })
  req.user = { id: payload.sub, claims: payload }
  next()
}

export function optionalAuth(req, res, next) {
  const token = parseAuthHeader(req.headers['authorization'])
  if (token) {
    const payload = verifyToken(token)
    if (payload && payload.sub) req.user = { id: payload.sub, claims: payload }
  } else if (DEV_BYPASS && req.headers['x-user-id']) {
    req.user = { id: req.headers['x-user-id'] }
  }
  next()
}

// ESM exports are declared above
