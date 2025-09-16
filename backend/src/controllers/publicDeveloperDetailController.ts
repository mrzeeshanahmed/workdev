import type { DeveloperProfile } from '../models/developerProfile'

const SAMPLE_DEV: DeveloperProfile = {
  id: '33333333-3333-3333-3333-333333333333',
  display_name: 'Dev One',
  headline: 'Frontend',
  summary: 'Experienced frontend engineer',
  is_public: true
}

export async function getDeveloperDetail(id: string, opts: any = {}): Promise<DeveloperProfile | null> {
  if (!id) return null
  const base = id === SAMPLE_DEV.id ? SAMPLE_DEV : { id, display_name: 'Dev ' + id }
  if (opts && opts.authenticated) {
    // Attach contact metadata for authenticated callers
    return { ...base, contact: { email: 'dev@example.com' } as any }
  }
  return base
}

export default { getDeveloperDetail }
