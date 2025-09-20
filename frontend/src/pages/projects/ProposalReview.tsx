import React from 'react'

export default function ProposalReview({ proposals, onShortlist }:{ proposals?: any[], onShortlist?: (id:string)=>void }){
  const list = proposals || []
  if (list.length === 0) return <div role="status" aria-live="polite">No proposals</div>
  return (
    <div>
      <h2>Proposals</h2>
      <ul>
        {list.map(p=> (
          <li key={p.id} data-testid={`proposal-${p.id}`}>
            <div>{p.applicant_name}</div>
            <div>{p.cover_letter}</div>
            <div>Bid: {p.bid}</div>
            <button type="button" aria-label={`Shortlist ${p.applicant_name}`} onClick={()=>onShortlist && onShortlist(p.id)}>Shortlist</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
