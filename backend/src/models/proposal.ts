export type Proposal = {
  id: string
  project_id: string
  applicant_id: string
  cover_letter: string
  amount?: number
  hours_estimate?: number
  status?: string
  created_at?: string
  updated_at?: string
}

export const ProposalModel = {
  async create(db: any, payload: Partial<Proposal>) {
    const { rows } = await db.query(
      `INSERT INTO proposals (project_id, applicant_id, cover_letter, amount, hours_estimate, status)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [payload.project_id, payload.applicant_id || null, payload.cover_letter, payload.amount || null, payload.hours_estimate || null, payload.status || 'submitted']
    )
    return rows[0]
  },
  async findById(db: any, id: string) {
    const { rows } = await db.query('SELECT * FROM proposals WHERE id = $1', [id])
    return rows[0] || null
  },
  async listForProject(db: any, projectId: string) {
    const { rows } = await db.query('SELECT * FROM proposals WHERE project_id = $1 ORDER BY created_at DESC', [projectId])
    return rows
  }
}
