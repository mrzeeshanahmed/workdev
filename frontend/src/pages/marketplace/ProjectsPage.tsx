import React, { useEffect, useState } from 'react'
import FeaturedProjects from '../../components/marketplace/FeaturedProjects'
import ProjectCard from '../../components/marketplace/ProjectCard'
import '../../styles/marketplace.css'

const SAMPLE = [
  { id: 'p1', title: 'Small Widget', short_description: 'A tiny widget project', budget: { min: 100, max: 300, currency: 'USD' } },
  { id: 'p2', title: 'Large Platform', short_description: 'Enterprise platform build', budget: { min: 5000, max: 20000, currency: 'USD' } }
]

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const res = await fetch('/api/public/projects')
        if (!res.ok) throw new Error('Network response not ok')
        const data = await res.json()
        if (mounted) setProjects(Array.isArray(data) ? data : data.items || [])
      } catch (err: any) {
        console.warn('Failed to fetch projects, falling back to sample', err)
        if (mounted) {
          setError('Could not load live projects; showing samples')
          setProjects(SAMPLE)
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()
    return () => {
      mounted = false
    }
  }, [])

  return (
    <div>
      <h1>Projects</h1>
      <FeaturedProjects />
      <div className="marketpage-body">
        <h2>All Projects</h2>
        {loading && <p className="loading">Loading projects…</p>}
        {error && <p className="loading">{error}</p>}
        {projects && projects.map(p => (
          <ProjectCard key={p.id} id={p.id} title={p.title} short_description={p.short_description} budget={p.budget} />
        ))}
      </div>
    </div>
  )
}
