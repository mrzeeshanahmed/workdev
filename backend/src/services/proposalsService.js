import store from '../stores/inMemoryStore.js'

function generateId() {
  return `prop-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`
}

export async function submitProposal({ projectId, developerId, cover_letter, hourly_rate = null, total_price = null } = {}) {
  if (!projectId || !developerId || !cover_letter) {
    throw new Error('projectId, developerId and cover_letter are required')
  }

  // ensure project exists
  const project = store.projects.get(projectId)
  if (!project) {
    const err = new Error('project not found')
    err.code = 'NOT_FOUND'
    throw err
  }

  // ensure developer exists
  const dev = store.developers.get(developerId)
  if (!dev) {
    const err = new Error('developer not authorized')
    err.code = 'FORBIDDEN'
    throw err
  }

  const id = generateId()
  const now = new Date().toISOString()
  const record = {
    id,
    developer_id: developerId,
    project_id: projectId,
    cover_letter,
    hourly_rate: hourly_rate === null ? null : Number(hourly_rate),
    total_price: total_price === null ? null : Number(total_price),
    status: 'submitted',
    created_at: now,
    updated_at: now,
  }

  store.proposals.set(id, record)

  // update analytics
  const a = store.analytics.get(developerId) || { profile_views: 0, proposals_submitted: 0, proposals_accepted: 0 }
  a.proposals_submitted = (a.proposals_submitted || 0) + 1
  store.analytics.set(developerId, a)

  return record
}

export async function listProposals({ developerId } = {}) {
  if (!developerId) return Array.from(store.proposals.values())
  return Array.from(store.proposals.values()).filter(p => p.developer_id === developerId)
}

export default { submitProposal, listProposals }
