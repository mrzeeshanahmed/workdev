import React, { useState } from 'react'
import ReviewForm from './ReviewForm'
import ReputationDisplay from './ReputationDisplay'

type Props = { projectId?: string; revieweeId?: string }

export default function ReviewsPage({ projectId, revieweeId }: Props) {
  const pid = projectId || (window.location.pathname.replace('/reviews/', '') || 'proj-1')
  const reviewee = revieweeId || `p-${pid}`
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <div>
      <h2>Reviews for {pid}</h2>
      <ReputationDisplay profileId={reviewee} reloadKey={refreshKey} />
      <ReviewForm projectId={pid} reviewerId={'test-user'} onSubmitted={() => { setRefreshKey((k) => k + 1) }} />
    </div>
  )
}
