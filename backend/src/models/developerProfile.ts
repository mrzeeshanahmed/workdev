export type DeveloperProfile = {
  id: string
  user_id: string
  display_name: string
  headline?: string
  bio?: string
  location?: string
  hourly_rate?: number
  is_public?: boolean
  created_at?: string
  updated_at?: string
}

export const DeveloperProfileModel = {
  async findById(db: any, id: string) {
    const { rows } = await db.query('SELECT * FROM developer_profiles WHERE id = $1', [id]);
    return rows[0] || null;
  },
  async search(db: any, q: string, limit = 20) {
    const { rows } = await db.query("SELECT * FROM developer_profiles WHERE is_public = true AND (display_name ILIKE $1 OR headline ILIKE $1 OR bio ILIKE $1) LIMIT $2", [`%${q}%`, limit]);
    return rows;
  }
}
// end
