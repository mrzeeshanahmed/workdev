export const ProjectSkills = {
  async setForProject(db: any, projectId: string, skillIds: string[]) {
    // simple implementation: remove existing and insert supplied ids
    await db.query('DELETE FROM project_skills WHERE project_id = $1', [projectId])
    for (const sid of skillIds) {
      await db.query('INSERT INTO project_skills (project_id, skill_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [projectId, sid])
    }
    return true
  },
  async listForProject(db: any, projectId: string) {
    const { rows } = await db.query('SELECT s.* FROM skills s JOIN project_skills ps ON ps.skill_id = s.id WHERE ps.project_id = $1', [projectId])
    return rows
  }
}
