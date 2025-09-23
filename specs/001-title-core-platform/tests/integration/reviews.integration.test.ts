import { describe, it, expect, vi } from 'vitest'

// Mock supabase client used by services
vi.mock('@supabase/supabase-js', () => {
  return {
    createClient: () => ({
      from: (table: string) => {
        if (table === 'reviews') {
          return {
            insert: (rows: any[]) => ({ select: () => ({ single: async () => ({ data: { ...rows[0], id: 'r-1', created_at: new Date().toISOString() } }) }) })
          }
        }
        if (table === 'reputation') {
          return {
            select: () => ({ single: async () => ({ data: { profile_id: 'p-1', review_count: 1, avg_score: 4.5 } }) })
          }
        }
        return { select: () => ({ single: async () => ({ data: null }) }) }
      }
    })
  }
})

import { createReview, getReputation } from '../../../../frontend/src/services/reviews.service'

describe('Reviews integration (T010)', () => {
  it('creates a review and reputation is available', async () => {
    const review = await createReview({ project_id: 'proj-1', reviewer_id: 'u-1', reviewee_id: 'p-1', score: 5, comment: 'Great' })
    expect(review).toHaveProperty('id')

    const rep = await getReputation('p-1')
    expect(rep).toMatchObject({ profile_id: 'p-1' })
  })
})
