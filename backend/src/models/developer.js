// Simple Developer model (in-memory / validation helpers)
export function createDeveloper(payload = {}) {
  const { id, user_id, display_name, headline, bio, skills = [], location = {}, hourly_rate_min = null, hourly_rate_max = null, portfolio_urls = [], avatar_url = null, visibility = 'public' } = payload

  if (!id) throw new Error('id is required')
  if (!user_id) throw new Error('user_id is required')
  if (!display_name) throw new Error('display_name is required')

  const normalizedSkills = Array.isArray(skills) ? skills.map(s => String(s).toLowerCase()) : []

  return {
    id: String(id),
    user_id: String(user_id),
    display_name: String(display_name),
    headline: headline || '',
    bio: bio || '',
    skills: Array.from(new Set(normalizedSkills)),
    location: {
      country: location.country || null,
      city: location.city || null,
      remote: Boolean(location.remote),
    },
    hourly_rate_min: hourly_rate_min === null ? null : Number(hourly_rate_min),
    hourly_rate_max: hourly_rate_max === null ? null : Number(hourly_rate_max),
    portfolio_urls: Array.isArray(portfolio_urls) ? portfolio_urls : [],
    avatar_url,
    visibility: visibility === 'private' ? 'private' : 'public',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
}

export function validateDeveloper(obj) {
  if (!obj) return false
  return typeof obj.id === 'string' && typeof obj.user_id === 'string' && typeof obj.display_name === 'string'
}
