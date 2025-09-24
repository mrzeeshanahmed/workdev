import type { DeveloperProfile } from '../models/developerProfile'

const SAMPLE_DEVS: DeveloperProfile[] = [
  { id: '33333333-3333-3333-3333-333333333333', user_id: 'user-3333', display_name: 'Dev One', headline: 'Frontend' }
]

export async function listPublicDevelopers(_query: any = {}): Promise<{ items: DeveloperProfile[]; total_count: number; next_cursor?: string }> {
  return { items: SAMPLE_DEVS, total_count: SAMPLE_DEVS.length, next_cursor: undefined }
}

export default { listPublicDevelopers }
