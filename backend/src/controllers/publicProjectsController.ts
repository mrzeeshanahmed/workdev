import type { Project } from '../models/project'

const SAMPLE_PROJECTS: Project[] = [
  { id: '11111111-1111-1111-1111-111111111111', title: 'Featured Project', featured: true },
  { id: '22222222-2222-2222-2222-222222222222', title: 'Regular Project', featured: false }
]

export async function listPublicProjects(_query: any = {}): Promise<{ items: Project[]; total_count: number; next_cursor?: string }>{
  // Very simple filtering example (skills/budget not implemented yet)
  return { items: SAMPLE_PROJECTS, total_count: SAMPLE_PROJECTS.length, next_cursor: undefined }
}

export default { listPublicProjects }
