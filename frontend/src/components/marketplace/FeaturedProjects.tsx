import React from 'react'
import ProjectCard from './ProjectCard'

const SAMPLE = [
  { id: '1111', title: 'Build API Integration', short_description: 'Connect multiple services', budget: { min: 500, max: 1500, currency: 'USD' } },
  { id: '2222', title: 'Design Marketing Site', short_description: 'Landing page and CMS', budget: { min: 800, max: 2500, currency: 'USD' } }
]

export default function FeaturedProjects() {
  return (
    <section>
      <h2>Featured Projects</h2>
      {SAMPLE.map(p => (
        <ProjectCard key={p.id} id={p.id} title={p.title} short_description={p.short_description} budget={p.budget} />
      ))}
    </section>
  )
}
