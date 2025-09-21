export function createProject(payload = {}) {
  const { id, client_id, title, description = '', required_skills = [], project_type = 'fixed', budget_min = null, budget_max = null, tags = [], remote = false } = payload
  if (!id) throw new Error('id is required')
  if (!client_id) throw new Error('client_id is required')
  if (!title) throw new Error('title is required')

  return {
    id: String(id),
    client_id: String(client_id),
    title: String(title),
    description: String(description),
    required_skills: Array.isArray(required_skills) ? required_skills.map(s => String(s).toLowerCase()) : [],
    project_type: project_type === 'hourly' ? 'hourly' : 'fixed',
    budget_min: budget_min === null ? null : Number(budget_min),
    budget_max: budget_max === null ? null : Number(budget_max),
    tags: Array.isArray(tags) ? tags : [],
    remote: Boolean(remote),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
}

export function validateProject(obj) {
  if (!obj) return false
  return typeof obj.id === 'string' && typeof obj.client_id === 'string' && typeof obj.title === 'string'
}

// Compatibility: export ProjectModel for tests that import from 'models/project'
export const ProjectModel = {
  async findById(db, id) {
    const { rows } = await db.query('SELECT * FROM projects WHERE id = $1', [id])
    return rows[0] || null
  },
  async list(db, opts = {}) {
    const limit = opts.limit || 20
    const offset = opts.offset || 0
    const { rows } = await db.query('SELECT * FROM projects WHERE is_public = true ORDER BY featured DESC, featured_at DESC, created_at DESC LIMIT $1 OFFSET $2', [limit, offset])
    return rows
  }
}
