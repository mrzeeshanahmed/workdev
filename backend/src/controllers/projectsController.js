const db = require('../db')

const SAMPLE_PROJECTS = [
  {
    id: 'p-11111111-1111-1111-1111-111111111111',
    owner_id: 'local-user',
    title: 'Sample Project A',
    description: 'Sample description',
    project_type: 'fixed',
    budget_min: 500,
    budget_max: 1000,
    skills: ['react','node'],
    status: 'open',
    created_at: new Date().toISOString()
  }
]

async function listProjects(query = {}) {
  if (db.isDbEnabled) {
    const page_size = parseInt(query.page_size, 10) || 20
    const page = parseInt(query.page, 10) || 0
    const offset = page * page_size
    const where = []
    const params = []
    let idx = 1
    if (query.q) {
      where.push("(title ILIKE $" + idx + " OR description ILIKE $" + idx + ")")
      params.push('%' + query.q + '%')
      idx++
    }
    if (query.status) {
      where.push('status = $' + idx)
      params.push(query.status)
      idx++
    }
    const whereSql = where.length ? 'WHERE ' + where.join(' AND ') : ''
    // Select minimal project columns and aggregate skills as a text[] via a correlated subquery.
    // Keep ordering and pagination stable.
    const sql = `SELECT
      p.id, p.owner_id, p.title, p.description, p.project_type, p.budget_min, p.budget_max, p.status, p.created_at,
      COALESCE((SELECT array_agg(s.name) FROM project_skills pk JOIN skills s ON s.id = pk.skill_id WHERE pk.project_id = p.id), ARRAY[]::text[]) AS skills
      FROM projects p
      ${whereSql}
      ORDER BY created_at DESC
      LIMIT $${idx} OFFSET $${idx+1}`
    params.push(page_size, offset)
    const { rows } = await db.query(sql, params)
    // ensure skills is always an array (Postgres text[] should map to JS array; fallback to empty array)
    const items = rows.map(r => {
      r.skills = Array.isArray(r.skills) ? r.skills : []
      return r
    })
    // get total count (use same where params)
    const countParams = params.slice(0, Math.max(0, idx-1))
    const countRes = await db.query(`SELECT COUNT(*)::int AS cnt FROM projects ${whereSql}`, countParams)
    const total = countRes.rows[0] ? countRes.rows[0].cnt : items.length
    return { items, total_count: total, next_cursor: (items.length === page_size ? String(page + 1) : null) }
  }

  // fallback
  let items = SAMPLE_PROJECTS.slice()
  if (query.q) {
    const q = String(query.q).toLowerCase()
    items = items.filter(p => (p.title + ' ' + (p.description||'')).toLowerCase().includes(q))
  }
  if (query.status) items = items.filter(p => p.status === query.status)
  const page_size = parseInt(query.page_size, 10) || 20
  const page = parseInt(query.page, 10) || 0
  const start = page * page_size
  const paged = items.slice(start, start + page_size)
  return { items: paged, total_count: items.length, next_cursor: (start + page_size < items.length) ? String(page + 1) : null }
}

async function createProject(payload) {
  if (db.isDbEnabled) {
    const { rows } = await db.query(
      `INSERT INTO projects (owner_id, title, description, project_type, budget_min, budget_max)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [payload.owner_id || null, payload.title, payload.description, payload.project_type || payload.type || 'fixed', payload.budget_min || null, payload.budget_max || null]
    )
    const project = rows[0]
    // If skills were provided, insert into project_skills if table exists
    if (payload.skills && Array.isArray(payload.skills) && payload.skills.length) {
      for (const name of payload.skills) {
        try {
          const s = await db.query('SELECT id FROM skills WHERE name = $1', [name])
          if (s.rows[0]) {
            await db.query('INSERT INTO project_skills (project_id, skill_id) VALUES ($1,$2) ON CONFLICT DO NOTHING', [project.id, s.rows[0].id])
          }
        } catch (e) {
          // ignore skill insertion errors in fallback
        }
      }
    }
    // attach skills array
    project.skills = payload.skills || []
    return project
  }
  // fallback sample project
  const project = Object.assign({}, payload, { id: 'p-' + Date.now(), owner_id: payload.owner_id || 'local-user', project_type: payload.project_type || payload.type || 'fixed', created_at: new Date().toISOString(), skills: payload.skills || [] })
  SAMPLE_PROJECTS.unshift(project)
  return project
}

async function getProjectDetail(id) {
  if (db.isDbEnabled) {
    const { rows } = await db.query('SELECT p.*, COALESCE((SELECT json_agg(s.name) FROM project_skills pk JOIN skills s ON s.id = pk.skill_id WHERE pk.project_id = p.id),\'[]\') AS skills FROM projects p WHERE p.id = $1', [id])
    if (!rows[0]) return null
    const project = rows[0]
    try { project.skills = Array.isArray(project.skills) ? project.skills : JSON.parse(project.skills || '[]') } catch (e) { project.skills = [] }
    return project
  }
  return SAMPLE_PROJECTS.find(p => p.id === id) || null
}

module.exports = { listProjects, createProject, getProjectDetail }
