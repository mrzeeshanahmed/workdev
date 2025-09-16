// Minimal controller for public projects (DB-backed when DATABASE_URL is set, otherwise sample data)
const db = require('../db')

const SAMPLE_PROJECTS = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    title: 'Featured Project',
    short_description: 'An important featured project',
    description: 'Full description',
    project_type: 'fixed',
    budget_min: 1000,
    budget_max: 5000,
    budget_currency: 'USD',
    is_public: true,
    featured: true,
    featured_at: new Date().toISOString(),
    created_at: new Date().toISOString()
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    title: 'Regular Project',
    short_description: 'A regular project',
    description: 'Full description',
    project_type: 'hourly',
    budget_min: 20,
    budget_max: 60,
    budget_currency: 'USD',
    is_public: true,
    featured: false,
    created_at: new Date().toISOString()
  }
]

async function listPublicProjects(query = {}) {
  // DB-backed when available
  if (db.pool) {
    const limit = parseInt(query.page_size, 10) || 20
    const page = parseInt(query.page, 10) || 0
    const offset = page * limit
    const where = ['is_public = true']
    const params = []
    let idx = 1
    if (query.q) {
      where.push("(title ILIKE $" + idx + " OR short_description ILIKE $" + idx + " OR description ILIKE $" + idx + ")")
      params.push('%' + query.q + '%')
      idx++
    }
    if (query.project_type) {
      where.push('project_type = $' + idx)
      params.push(query.project_type)
      idx++
    }
    if (query.budget_min) {
      where.push('budget_max >= $' + idx)
      params.push(query.budget_min)
      idx++
    }
    if (query.budget_max) {
      where.push('budget_min <= $' + idx)
      params.push(query.budget_max)
      idx++
    }
    const whereSql = where.length ? 'WHERE ' + where.join(' AND ') : ''
    const sql = `SELECT * FROM projects ${whereSql} ORDER BY featured DESC, featured_at DESC, created_at DESC LIMIT $${idx} OFFSET $${idx+1}`
    params.push(limit, offset)
    const { rows } = await db.query(sql, params)
    return { items: rows, total_count: rows.length, next_cursor: (rows.length === limit ? String(page + 1) : null) }
  }

  // Fallback to sample data
  let items = SAMPLE_PROJECTS.slice()
  if (query.q) {
    const q = String(query.q).toLowerCase()
    items = items.filter(p => (p.title + ' ' + (p.short_description||'') + ' ' + (p.description||'')).toLowerCase().includes(q))
  }
  const page_size = parseInt(query.page_size, 10) || 20
  const page = parseInt(query.page, 10) || 0
  const start = page * page_size
  const paged = items.slice(start, start + page_size)
  return { items: paged, total_count: items.length, next_cursor: (start + page_size < items.length) ? String(page + 1) : null }
}

async function getProjectDetail(id) {
  if (db.pool) {
    const { rows } = await db.query('SELECT * FROM projects WHERE id = $1 AND is_public = true', [id])
    return rows[0] || null
  }
  return SAMPLE_PROJECTS.find(p => p.id === id) || null
}

module.exports = { listPublicProjects, getProjectDetail }
