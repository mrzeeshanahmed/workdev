import db from '../db.js'

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
    const page_size = Math.max(1, parseInt(query.page_size, 10) || 20)
    const page = Math.max(0, parseInt(query.page, 10) || 0)
    const offset = page * page_size

    const where = []
    const params = []
    let idx = 1

    // Full-text or simple ILIKE search on title/description
    if (query.q) {
      where.push(`(p.title ILIKE $${idx} OR p.short_description ILIKE $${idx} OR p.description ILIKE $${idx})`)
      params.push('%' + query.q + '%')
      idx++
    }

    // canonical schema does not include a 'status' column; ignore query.status unless schema changes

    const whereSql = where.length ? 'WHERE ' + where.join(' AND ') : ''

    // Aggregate skills via joins and group by project columns
    const sql = `SELECT
      p.id, p.owner_id, p.title, p.short_description, p.description, p.project_type, p.budget_min, p.budget_max, p.budget_currency, p.is_public, p.featured, p.featured_at, p.created_at,
      COALESCE(array_agg(DISTINCT s.name) FILTER (WHERE s.name IS NOT NULL) ORDER BY s.name, ARRAY[]::text[]) AS skills
    FROM projects p
    LEFT JOIN project_skills pk ON pk.project_id = p.id
    LEFT JOIN skills s ON s.id = pk.skill_id
    ${whereSql}
    GROUP BY p.id
    ORDER BY p.created_at DESC
    LIMIT $${idx} OFFSET $${idx+1}`
    params.push(page_size, offset)

  const { rows } = await db.query(sql, params)
    const items = rows.map(r => {
      // ensure skills is always an array
      r.skills = Array.isArray(r.skills) ? r.skills : []
      return r
    })

    // total count
    const countParams = params.slice(0, idx - 1)
    const countSql = `SELECT COUNT(*)::int AS cnt FROM projects p ${whereSql}`
  const countRes = await db.query(countSql, countParams)
    const total = countRes.rows[0] ? countRes.rows[0].cnt : items.length

    const next_cursor = (items.length === page_size) ? String(page + 1) : null
    return { items, total_count: total, next_cursor }
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
  // Try DB-backed flow; if it fails (DB not configured or query throws), fallback to in-memory
  try {
    // Expect caller (route) to set payload.owner_id from authenticated user (req.user.id)
    const { rows } = await db.query(`INSERT INTO projects (owner_id, title, short_description, description, project_type, budget_min, budget_max, budget_currency, is_public, featured) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [
        payload.owner_id || null,
        payload.title,
        payload.short_description || null,
        payload.description || null,
        payload.project_type || payload.type || 'fixed',
        payload.budget_min || null,
        payload.budget_max || null,
        payload.budget_currency || 'USD',
        typeof payload.is_public === 'boolean' ? payload.is_public : true,
        !!payload.featured
      ]
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
    // If skills were provided, insert into project_skills as before and attach array
    project.skills = []
    return project
  } catch (err) {
    // fallback sample project
    // eslint-disable-next-line no-console
    console.debug('createProject db path failed, falling back to in-memory:', err && err.message)
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

export { listProjects, createProject, getProjectDetail }
