const db = require('../db')
const SAMPLE_DEVS = [
  { id: 'd1', display_name: 'Ada Lovelace', name: 'Ada Lovelace', headline: 'Backend Engineer', summary: 'Experienced in systems', skills: ['python','systems'] },
  { id: 'd2', display_name: 'Grace Hopper', name: 'Grace Hopper', headline: 'Frontend Engineer', summary: 'UI and accessibility', skills: ['javascript','accessibility'] }
]

async function listPublicDevelopers(query = {}) {
  if (db.pool) {
    const limit = parseInt(query.page_size, 10) || 20
    const page = parseInt(query.page, 10) || 0
    const offset = page * limit
    const where = ['1=1']
    const params = []
    let idx = 1
    if (query.q) {
      where.push("(display_name ILIKE $" + idx + " OR headline ILIKE $" + idx + " OR bio ILIKE $" + idx + ")")
      params.push('%' + query.q + '%')
      idx++
    }
    const whereSql = 'WHERE ' + where.join(' AND ')
    const sql = `SELECT id, display_name, headline, bio, location FROM developer_profiles ${whereSql} LIMIT $${idx} OFFSET $${idx+1}`
    params.push(limit, offset)
    const { rows } = await db.query(sql, params)
    return { items: rows, total_count: rows.length, next_cursor: (rows.length === limit ? String(page + 1) : null) }
  }

  // fallback
  let items = SAMPLE_DEVS.slice()
  if (query.q) {
    const q = String(query.q).toLowerCase()
    items = items.filter(d => (d.display_name + ' ' + (d.headline||'') + ' ' + (d.summary||'')).toLowerCase().includes(q))
  }
  const page_size = parseInt(query.page_size, 10) || 20
  const page = parseInt(query.page, 10) || 0
  const start = page * page_size
  const paged = items.slice(start, start + page_size)
  return { items: paged, total_count: items.length, next_cursor: (start + page_size < items.length) ? String(page + 1) : null }
}

module.exports = { listPublicDevelopers, SAMPLE_DEVS }
