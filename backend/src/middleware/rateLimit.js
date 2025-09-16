// Simple in-memory rate limiter for unauthenticated requests
const buckets = new Map()
const WINDOW_MS = 60 * 1000 // 1 minute
const LIMIT = 60 // 60 requests per minute

function rateLimit(req, res, next) {
  const key = req.ip || req.headers['x-forwarded-for'] || 'global'
  const now = Date.now()
  let bucket = buckets.get(key)
  if (!bucket || bucket.expires < now) {
    bucket = { count: 0, expires: now + WINDOW_MS }
    buckets.set(key, bucket)
  }
  bucket.count++
  if (bucket.count > LIMIT) {
    res.status(429).json({ error: 'rate_limited' })
    return
  }
  next()
}

module.exports = rateLimit
