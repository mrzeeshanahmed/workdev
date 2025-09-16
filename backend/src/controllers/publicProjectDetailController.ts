import type { Project } from '../models/project'

const SAMPLE_PROJECT: Project = {
  id: '11111111-1111-1111-1111-111111111111',
  title: 'Featured Project',
  description: 'Full description of featured project',
  short_description: 'Short desc',
  project_type: 'fixed',
  budget_min: 500,
  budget_max: 2000,
  budget_currency: 'USD',
  featured: true
}

export async function getProjectDetail(id: string): Promise<Project | null> {
  if (!id) return null
  // Return sample if id matches, otherwise return a basic object
  if (id === SAMPLE_PROJECT.id) return SAMPLE_PROJECT
  return { id, title: 'Project ' + id }
}

export default { getProjectDetail }
