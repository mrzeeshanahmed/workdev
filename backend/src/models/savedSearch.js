export function createSavedSearch(payload = {}) {
  const { id, developer_id, name, criteria = {}, notification_cadence = 'daily' } = payload
  if (!id) throw new Error('id is required')
  if (!developer_id) throw new Error('developer_id is required')
  if (!name) throw new Error('name is required')

  // normalize criteria: lowercase skills/tags
  const normalized = { ...criteria }
  if (Array.isArray(normalized.skills)) normalized.skills = normalized.skills.map(s => String(s).toLowerCase())
  if (Array.isArray(normalized.tags)) normalized.tags = normalized.tags.map(t => String(t).toLowerCase())

  return {
    id: String(id),
    developer_id: String(developer_id),
    name: String(name),
    criteria: normalized,
    notification_cadence: ['immediate', 'daily', 'weekly'].includes(notification_cadence) ? notification_cadence : 'daily',
    last_notified_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
}

export function validateSavedSearch(obj) {
  if (!obj) return false
  return typeof obj.id === 'string' && typeof obj.developer_id === 'string' && typeof obj.name === 'string'
}
