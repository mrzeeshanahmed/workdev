export type Project = {
  id: string
  title: string
  short_description?: string
  description?: string
  project_type?: string
  budget_min?: number
  budget_max?: number
  budget_currency?: string
  is_public?: boolean
  featured?: boolean
  featured_at?: string
  owner_id?: string
  created_at?: string
  updated_at?: string
}

export const ProjectModel = {
  async findById(db: any, id: string) {
    const { rows } = await db.query('SELECT * FROM projects WHERE id = $1', [id]);
    return rows[0] || null;
  },
  async list(db: any, opts: any = {}) {
    const limit = opts.limit || 20;
    const offset = opts.offset || 0;
    const { rows } = await db.query('SELECT * FROM projects WHERE is_public = true ORDER BY featured DESC, featured_at DESC, created_at DESC LIMIT $1 OFFSET $2', [limit, offset]);
    return rows;
  }
}
import { Skill } from './skill'
// end
