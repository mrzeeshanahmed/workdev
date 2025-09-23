import { describe, it, expect, vi } from 'vitest'

// Mock the supabase client module used by the service (relative path)
vi.mock('../../../../frontend/src/lib/supabaseClient', () => {
  return {
    default: {
      from: () => ({
        select: () => ({ eq: () => ({ single: async () => ({ data: { id: '00000000-0000-0000-0000-000000000002', display_name: 'devuser' }, error: null }) }) })
      })
    }
  }
})

import { getProfile } from '../../../../frontend/src/services/profiles.service'

describe('profiles.service', () => {
  it('getProfile returns profile data', async () => {
    const p = await getProfile('00000000-0000-0000-0000-000000000002')
    expect(p).toBeDefined()
    expect(p?.display_name).toBe('devuser')
  })
})
