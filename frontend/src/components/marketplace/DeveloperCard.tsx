import React from 'react'
import '../../styles/marketplace.css'

type Props = { id: string; name: string; headline?: string; skills?: string[] }

export default function DeveloperCard({ id, name, headline, skills }: Props) {
  return (
    <article className="dev-card">
      <h3>{name}</h3>
      <p>{headline}</p>
      {skills && skills.length > 0 && <p>Skills: {skills.join(', ')}</p>}
      <a href={`/developers/${id}`}>View profile</a>
    </article>
  )
}
