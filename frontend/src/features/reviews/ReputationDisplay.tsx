import React, { useEffect, useState } from 'react'
import { getReputation } from '../../services/reviews.service'

type Props = { profileId: string; pollIntervalMs?: number; reloadKey?: number }

export default function ReputationDisplay({ profileId, pollIntervalMs = 5000, reloadKey = 0 }: Props) {
  const [rep, setRep] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  async function fetchRep() {
    try {
      const r = await getReputation(profileId)
      setRep(r)
    } catch (e) {
      // noop
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // fetch immediately when profileId or reloadKey changes
    fetchRep()
    const id = setInterval(fetchRep, pollIntervalMs)
    return () => clearInterval(id)
  }, [profileId, pollIntervalMs, reloadKey])

  if (loading) return <div>Loading reputation...</div>
  if (!rep) return <div>No reputation</div>
  return (
    <div>
      <div>Average score: {Number(rep.avg_score).toFixed(2)}</div>
      <div>Reviews: {rep.review_count}</div>
    </div>
  )
}
