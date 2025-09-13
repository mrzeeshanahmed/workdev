import React, { useState, useEffect } from 'react'
import { createReview } from '../../services/reviews.service'
import supabase from '../../lib/supabaseClient'

type Props = {
  projectId: string
  reviewerId?: string
  onSubmitted?: () => void
}

export default function ReviewForm({ projectId, reviewerId, onSubmitted }: Props) {
  const [score, setScore] = useState(5)
  const [comment, setComment] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [localReviewer, setLocalReviewer] = useState<string | undefined>(reviewerId)

  useEffect(() => {
    if (!reviewerId) {
      (async () => {
        try {
          const s = await supabase.auth.getSession()
          const uid = (s as any).data?.session?.user?.id
          if (uid) setLocalReviewer(uid)
        } catch (e) {
          // noop
        }
      })()
    }
  }, [reviewerId])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const rid = localReviewer || reviewerId
      if (!rid) throw new Error('not-authenticated')
      await createReview({ project_id: projectId, reviewer_id: rid, reviewee_id: undefined, score, comment })
      setComment('')
      if (typeof onSubmitted === 'function') onSubmitted()
    } catch (err: any) {
      setError(err?.message || 'Failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={submit}>
      <div>
        <label htmlFor="score">Score</label>
        <input id="score" type="number" min={1} max={5} value={score} onChange={(e) => setScore(Number(e.target.value))} />
      </div>
      <div>
        <label htmlFor="comment">Comment</label>
        <textarea id="comment" value={comment} onChange={(e) => setComment(e.target.value)} />
      </div>
      {error && <div role="alert">{error}</div>}
      <button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Submit Review'}</button>
    </form>
  )
}
