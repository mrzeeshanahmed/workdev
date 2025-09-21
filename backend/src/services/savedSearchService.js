import store from '../stores/inMemoryStore.js'
import notificationService from './notificationService.js'

function generateId() {
  return `ss-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`
}

// createSavedSearch expects: { developerId, name, query }
// Returns a record shaped like the app expects: { id, developer_id, name, criteria, notification_cadence, ... }
export function createSavedSearch({ developerId, name, query, notification_cadence } = {}) {
  if (!developerId || !name || !query) {
    throw new Error('developerId, name and query are required')
  }
  // dedupe: same developer and identical criteria JSON
  const normalized = JSON.stringify(query)
  for (const s of store.savedSearches.values()) {
    if (s.developer_id === developerId && JSON.stringify(s.criteria) === normalized) {
      const err = new Error('duplicate')
      err.code = 'DUPLICATE'
      throw err
    }
  }

  const id = generateId()
  const now = new Date().toISOString()
  const record = {
    id,
    developer_id: developerId,
    name,
    criteria: query,
    notification_cadence: notification_cadence || 'daily',
    last_notified_at: null,
    created_at: now,
    updated_at: now,
  }

  store.savedSearches.set(id, record)

  // notify (MVP: console / analytics)
  try {
    notificationService.notifyDeveloper(developerId, `Saved search '${name}' created`)
  } catch (e) {
    // swallow notification errors in MVP
    console.warn('notification failure', e && e.message)
  }

  return record
}

export function listSavedSearches({ developerId } = {}) {
  const all = Array.from(store.savedSearches.values())
  if (developerId) return all.filter(s => s.developer_id === developerId)
  return all
}

export function deleteSavedSearch({ id } = {}) {
  if (!id) throw new Error('id is required')
  const existing = store.savedSearches.get(id)
  if (!existing) return false
  store.savedSearches.delete(id)
  try {
    notificationService.notifyDeveloper(existing.developer_id, `Saved search '${existing.name}' deleted`)
  } catch (e) {
    console.warn('notification failure', e && e.message)
  }
  return true
}

export default { createSavedSearch, listSavedSearches, deleteSavedSearch }
