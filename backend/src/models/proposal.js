export function createProposal(payload = {}) {
  const { id, developer_id, project_id, cover_letter = '', hourly_rate = null, total_price = null, status = 'submitted' } = payload
  if (!id) throw new Error('id is required')
  if (!developer_id) throw new Error('developer_id is required')
  if (!project_id) throw new Error('project_id is required')

  const allowed = ['submitted', 'viewed', 'shortlisted', 'interview', 'offered', 'accepted', 'rejected', 'withdrawn']
  const s = allowed.includes(status) ? status : 'submitted'

  return {
    id: String(id),
    developer_id: String(developer_id),
    project_id: String(project_id),
    cover_letter: String(cover_letter),
    hourly_rate: hourly_rate === null ? null : Number(hourly_rate),
    total_price: total_price === null ? null : Number(total_price),
    status: s,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
}

export function validateProposal(obj) {
  if (!obj) return false
  return typeof obj.id === 'string' && typeof obj.developer_id === 'string' && typeof obj.project_id === 'string'
}
