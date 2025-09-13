import { describe, it, expect, vi } from 'vitest'

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
            select: () => ({
              eq: (_k: string, _v: string) => ({
                single: async () => ({ data: { profile_id: 'p-1', review_count: 1, avg_score: 4.5 } })
              })
            })
          }
        }
        return { select: () => ({ single: async () => ({ data: null }) }) }
      }
    })
  }
})

import { createReview, getReputation } from '../../services/reviews.service'

describe('frontend reviews integration', () => {
  it('creates a review and returns reputation', async () => {
    const r = await createReview({ project_id: 'proj-1', reviewer_id: 'u-1', reviewee_id: 'p-1', score: 5, comment: 'Nice' })
    expect(r).toHaveProperty('id')
    const rep = await getReputation('p-1')
    expect(rep).toMatchObject({ profile_id: 'p-1' })
  })
})
