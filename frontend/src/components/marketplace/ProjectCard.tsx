import React from 'react'
import '../../styles/marketplace.css'

type Props = {
  id: string
  title: string
  short_description?: string
  budget?: { min?: number | null; max?: number | null; currency?: string }
}

export default function ProjectCard({ id, title, short_description, budget }: Props) {
  return (
    <article className="project-card">
      <h3>{title}</h3>
      <p>{short_description}</p>
      {budget && (
        <p>
          Budget: {budget.min ?? 'N/A'} - {budget.max ?? 'N/A'} {budget.currency || ''}
        </p>
      )}
      <a href={`/projects/${id}`}>View</a>
    </article>
  )
}
