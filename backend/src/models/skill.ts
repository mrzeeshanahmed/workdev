// Lightweight skill model helpers
export type Skill = {
  id: string
  name: string
  slug: string
  created_at?: string
}

export const SkillModel = {
  async findAll(db: any) {
    const { rows } = await db.query('SELECT id, name, slug, created_at FROM skills ORDER BY name');
    return rows;
  },
  async findById(db: any, id: string) {
    const { rows } = await db.query('SELECT id, name, slug, created_at FROM skills WHERE id = $1', [id]);
    return rows[0] || null;
  }
}
// end
