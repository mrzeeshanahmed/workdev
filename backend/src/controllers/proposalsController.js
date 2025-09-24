const db = require('../db')

async function createProposal(projectId, payload) {
  // basic validation
  if (!payload || (!payload.cover_letter && !payload.amount)) {
    const err = new Error('validation')
    err.status = 400
    throw err
  }

  if (db.isDbEnabled) {
    const { rows } = await db.query(
      `INSERT INTO proposals (project_id, proposer_id, cover_letter, amount, status)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [projectId, payload.proposer_id || null, payload.cover_letter || null, payload.amount || null, payload.status || 'submitted']
    )
    return rows[0]
  }
  // fallback sample
  const proposal = Object.assign({}, payload, { id: 'prop-' + Date.now(), project_id: projectId, created_at: new Date().toISOString(), proposer_id: payload.proposer_id || 'local-user' })
  return proposal
}

async function acceptProposal(projectId, proposalId, actorId) {
  if (db.isDbEnabled) {
    // mark selected proposal accepted and project status in a transaction
    return await db.transaction(async (client) => {
      const { rows: propRows } = await client.query(
        'UPDATE proposals SET status = $1 WHERE id = $2 AND project_id = $3 RETURNING *',
        ['accepted', proposalId, projectId]
      )
      if (!propRows[0]) {
        // returning null keeps response shape consistent when nothing was updated
        return null
      }
      await client.query('UPDATE projects SET status = $1 WHERE id = $2', ['in_progress', projectId])
      return propRows[0]
    })
  }
  // fallback: return a simple accepted object
  return { id: proposalId, project_id: projectId, status: 'accepted', accepted_by: actorId || 'owner', accepted_at: new Date().toISOString() }
}

module.exports = { createProposal, acceptProposal }
